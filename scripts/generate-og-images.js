import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const forceRegenerate = process.argv.includes('--force');
const WIDTH = 1536;
const HEIGHT = 1024;
const AUTHOR = 'Aleksey Maltsev';

// Shared with src/lib/content/taxonomy.ts
const tagStyles = JSON.parse(readFileSync(join(root, 'src/lib/content/tags.json'), 'utf-8'));

/**
 * Minimal front-matter reader: `key: value` pairs and `key:` followed by `  - item` lists.
 * Good enough for the fields used here (title, preview, date, draft, tags).
 */
function extractFrontmatter(content) {
	const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return {};

	const unquote = (s) => s.trim().replace(/^["']|["']$/g, '');
	const frontmatter = {};
	let listKey = null;

	for (const line of match[1].split(/\r?\n/)) {
		const item = line.match(/^\s+-\s+(.*)$/);
		if (item && listKey) {
			frontmatter[listKey].push(unquote(item[1]));
			continue;
		}

		const colon = line.indexOf(':');
		if (colon === -1) continue;

		const key = line.substring(0, colon).trim();
		const value = line.substring(colon + 1).trim();
		if (value === '') {
			frontmatter[key] = [];
			listKey = key;
		} else {
			frontmatter[key] = unquote(value);
			listKey = null;
		}
	}

	return frontmatter;
}

function getHeroImageAsBase64(slug) {
	const imagePath = join(root, 'static', 'images', 'posts', slug, 'hero.jpg');
	if (!existsSync(imagePath)) return null;
	return `data:image/jpeg;base64,${readFileSync(imagePath).toString('base64')}`;
}

function resolveTags(tags = []) {
	return tags.map((tag) => {
		const style = tagStyles[tag];
		return style
			? { label: style.label, color: `--livery-${style.livery}` }
			: { label: tag, color: '--ink-3' };
	});
}

async function renderOGImage(page, data, outputPath) {
	await page.setContent(readFileSync(join(__dirname, 'og-template.html'), 'utf-8'), {
		waitUntil: 'networkidle'
	});

	await page.evaluate((d) => window.setContent(d), data);

	// Web fonts and the cover must be ready before the screenshot
	await page.evaluate(() => document.fonts.ready);
	if (data.heroImageBase64) {
		await page
			.waitForFunction(
				() => {
					const img = document.getElementById('hero-image');
					return img && img.complete && img.naturalHeight !== 0;
				},
				{ timeout: 5000 }
			)
			.catch(() => console.warn('⚠️  Image loading timeout - proceeding with screenshot'));
	}

	const screenshot = await page.screenshot({
		type: 'jpeg',
		quality: 90,
		clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT }
	});
	writeFileSync(outputPath, screenshot);
}

async function generateAllOGImages() {
	console.log('🚀 Starting OG image generation with Playwright...');
	if (forceRegenerate) console.log('🔄 Force mode enabled - will regenerate all images');

	const outputDir = join(root, 'static', 'images', 'og');
	if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

	const postFiles = await glob('src/posts/*/index.svx', { cwd: root });
	console.log(`📄 Found ${postFiles.length} blog posts`);

	let browser;
	let page;
	let generatedCount = 0;
	let skippedCount = 0;

	try {
		for (const postFile of postFiles) {
			try {
				const frontmatter = extractFrontmatter(readFileSync(join(root, postFile), 'utf-8'));

				if (!frontmatter.title) {
					console.warn(`⚠️  Skipping ${postFile}: No title found`);
					continue;
				}
				if (frontmatter.draft === 'true') {
					console.log(`📝 Skipping draft: ${frontmatter.title}`);
					continue;
				}

				const slug = postFile.replace(/\\/g, '/').split('/').at(-2); // src/posts/<slug>/index.svx
				const outputPath = join(outputDir, `${slug}.jpg`);

				if (!forceRegenerate && existsSync(outputPath)) {
					console.log(`⏭️  Skipping ${slug}: OG image already exists`);
					skippedCount++;
					continue;
				}

				// Launch lazily: nothing to do on most builds
				if (!browser) {
					browser = await chromium.launch();
					page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
				}

				const heroImageBase64 = getHeroImageAsBase64(slug);
				const action = existsSync(outputPath) ? 'Regenerating' : 'Generating';
				console.log(`🎨 ${action} OG image for: ${frontmatter.title} (slug: ${slug})`);

				await renderOGImage(
					page,
					{
						title: frontmatter.title,
						preview: frontmatter.preview || '',
						date: frontmatter.date,
						number: slug.split('-')[0],
						author: AUTHOR,
						tags: resolveTags(frontmatter.tags),
						caption: frontmatter.coverCaption || '',
						heroImageBase64
					},
					outputPath
				);

				console.log(`✅ Generated: ${slug}.jpg`);
				generatedCount++;
			} catch (error) {
				console.error(`❌ Error generating OG image for ${postFile}:`, error.message);
			}
		}
	} finally {
		await browser?.close();
	}

	console.log(`🎉 OG image generation complete!`);
	console.log(`📊 Generated: ${generatedCount} images, Skipped: ${skippedCount} existing images`);
}

generateAllOGImages().catch(console.error);
