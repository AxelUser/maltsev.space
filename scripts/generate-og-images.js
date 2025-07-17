import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const forceRegenerate = process.argv.includes('--force');

function extractFrontmatter(content) {
	const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
	const match = content.match(frontmatterRegex);

	if (!match) return {};

	const frontmatter = {};
	const lines = match[1].split('\n');

	for (const line of lines) {
		const colonIndex = line.indexOf(':');
		if (colonIndex !== -1) {
			const key = line.substring(0, colonIndex).trim();
			const value = line
				.substring(colonIndex + 1)
				.trim()
				.replace(/^["']|["']$/g, '');
			frontmatter[key] = value;
		}
	}

	return frontmatter;
}

function formatDate(dateString) {
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	} catch {
		return dateString;
	}
}

function getHeroImageAsBase64(slug) {
	try {
		const imagePath = join(__dirname, '..', 'static', 'images', 'posts', slug, 'hero.jpg');
		if (existsSync(imagePath)) {
			const imageBuffer = readFileSync(imagePath);
			const base64 = imageBuffer.toString('base64');
			return `data:image/jpeg;base64,${base64}`;
		}
		return null;
	} catch (error) {
		console.warn(`⚠️  Could not load hero image for ${slug}:`, error.message);
		return null;
	}
}

async function generateOGImage(title, preview, date, author, heroImageBase64, outputPath) {
	const browser = await chromium.launch();
	const page = await browser.newPage();

	// Set the viewport to exactly match our OG image dimensions
	await page.setViewportSize({ width: 1536, height: 1024 });

	// Load the HTML template
	const templatePath = join(__dirname, 'og-template.html');
	const templateContent = readFileSync(templatePath, 'utf-8');

	// Load the page with the template
	await page.setContent(templateContent, { waitUntil: 'domcontentloaded' });

	// Wait for fonts to load
	await page.waitForLoadState('networkidle');

	// Inject the content
	await page.evaluate(
		(data) => {
			window.setContent(data.title, data.preview, data.date, data.author, data.heroImageBase64);
		},
		{ title, preview, date, author, heroImageBase64 }
	);

	// Wait for the image to load if it exists
	if (heroImageBase64) {
		await page
			.waitForFunction(
				() => {
					const img = document.getElementById('hero-image');
					return img && img.complete && img.naturalHeight !== 0;
				},
				{ timeout: 5000 }
			)
			.catch(() => {
				console.warn('⚠️  Image loading timeout - proceeding with screenshot');
			});
	}

	// Take screenshot
	const screenshot = await page.screenshot({
		type: 'jpeg',
		quality: 90,
		clip: { x: 0, y: 0, width: 1536, height: 1024 }
	});

	// Save the image
	writeFileSync(outputPath, screenshot);

	await browser.close();
}

async function generateAllOGImages() {
	console.log('🚀 Starting OG image generation with Playwright...');

	if (forceRegenerate) {
		console.log('🔄 Force mode enabled - will regenerate all images');
	}

	// Ensure output directory exists
	const outputDir = join(__dirname, '..', 'static', 'images', 'og');
	if (!existsSync(outputDir)) {
		mkdirSync(outputDir, { recursive: true });
	}

	// Find all blog post markdown files
	const postFiles = await glob('src/posts/*/index.md', {
		cwd: join(__dirname, '..')
	});

	console.log(`📄 Found ${postFiles.length} blog posts`);

	let generatedCount = 0;
	let skippedCount = 0;

	for (const postFile of postFiles) {
		try {
			const fullPath = join(__dirname, '..', postFile);
			const content = readFileSync(fullPath, 'utf-8');
			const frontmatter = extractFrontmatter(content);

			if (!frontmatter.title) {
				console.warn(`⚠️  Skipping ${postFile}: No title found`);
				continue;
			}

			if (frontmatter.draft === 'true') {
				console.log(`📝 Skipping draft: ${frontmatter.title}`);
				continue;
			}

			// Extract slug from path
			const normalizedPath = postFile.replace(/\\/g, '/');
			const pathParts = normalizedPath.split('/');
			const slug = pathParts[pathParts.length - 2]; // Get the directory name before index.md

			if (!slug) {
				console.warn(`⚠️  Could not extract slug from path: ${postFile}`);
				continue;
			}

			const outputPath = join(outputDir, `${slug}.jpg`);

			// Check if OG image already exists (unless force mode is enabled)
			if (!forceRegenerate && existsSync(outputPath)) {
				console.log(`⏭️  Skipping ${slug}: OG image already exists`);
				skippedCount++;
				continue;
			}

			const title = frontmatter.title;
			const preview = frontmatter.preview || '';
			const date = formatDate(frontmatter.date);
			const author = 'Aleksey Maltsev';
			const heroImageBase64 = getHeroImageAsBase64(slug);

			const action = existsSync(outputPath) ? 'Regenerating' : 'Generating';
			console.log(
				`🎨 ${action} OG image for: ${title} (slug: ${slug})${heroImageBase64 ? ' with hero image' : ' without hero image'}`
			);

			await generateOGImage(title, preview, date, author, heroImageBase64, outputPath);

			console.log(`✅ Generated: ${slug}.jpg`);
			generatedCount++;
		} catch (error) {
			console.error(`❌ Error generating OG image for ${postFile}:`, error.message);
		}
	}

	console.log(`🎉 OG image generation complete!`);
	console.log(`📊 Generated: ${generatedCount} images, Skipped: ${skippedCount} existing images`);
}

// Run the script
generateAllOGImages().catch(console.error);
