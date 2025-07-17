# OG Image Generation

This script automatically generates Open Graph (OG) images for all blog posts by rendering the actual ArticleHero component and taking screenshots. Each is a 1536 x 1024 pixels PNG file.

## How it Works

1. **HTML Template**: Creates a standalone HTML page (`og-template.html`) that replicates the ArticleHero component
2. **Playwright Browser**: Launches a headless browser to render the component
3. **Content Injection**: Dynamically populates the template with post data (title, preview, date, author, hero image)
4. **Screenshot Capture**: Takes a precise 1536x1024 screenshot of the rendered component
5. **Image Output**: Saves the screenshot as a PNG file

## Usage

### Generate missing OG images only (recommended)

```bash
pnpm run generate-og
```

This will only generate OG images for posts that don't already have them, making it very fast for incremental updates.

### Force regenerate all OG images

```bash
pnpm run generate-og:force
# or
node scripts/generate-og-images.js --force
```

Use this when you've updated the template design or want to regenerate all images.

### Manual execution

```bash
node scripts/generate-og-images.js
```

## Output

Generated images are saved to:

- **Location**: `static/images/og/`
- **Naming**: `{slug}.png` (matches the blog post slug)
- **Format**: PNG with high quality
- **Dimensions**: 1536 x 1024 pixels


## Files

### Core Files

- `generate-og-images.js` - Main generation script using Playwright
- `og-template.html` - HTML template that replicates ArticleHero component
- `README.md` - This documentation

### Template Structure

The HTML template includes:

- Complete CSS variables from Open Props and app.css
- ArticleHero component styling
- Space-themed design elements
- Typography matching the site

## Customization

### Styling

To modify the OG image appearance, edit `og-template.html`:

```css
.hero-background-container {
    width: 1536px;
    height: 1024px;
    /* Modify container styling */
}

.space-title {
    font-size: var(--font-size-8);
    /* Adjust title styling */
}
```

### Content

To change how content is displayed, modify the `setContent` function in `og-template.html`:

```javascript
function setContent(title, preview, date, author, heroImageUrl) {
    // Customize how content is populated
}
```

### Generation Logic

To modify the screenshot process, edit `generateOGImage` function in `generate-og-images.js`:

```javascript
// Adjust viewport, timing, or screenshot options
await page.setViewportSize({ width: 1536, height: 1024 });
```

## Dependencies

- `@playwright/test` - Browser automation and screenshot capture
- `glob` - File pattern matching for finding blog posts
- Node.js built-in modules for file operations

## Installation

Playwright requires browser binaries to be installed:

```bash
# Install dependencies
pnpm install

# Install Playwright browsers (if needed)
npx playwright install chromium
```

## Notes

- Only processes published posts (skips drafts)
- Requires post frontmatter with `title` and `preview` fields
- Uses actual hero images from `static/images/posts/{slug}/hero.jpg`
- Creates output directory automatically if it doesn't exist
- Provides detailed console logging during generation
- Browser automation ensures consistent rendering across environments
