/**
 * Full Migration Script: Convert gallery to Keystatic structure
 * 
 * Target structure:
 * public/gallery/{category-slug}/images/{1,2,3...}/image.{ext}
 * 
 * JSON format:
 * "image": "/gallery/{slug}/images/{n}/image.{ext}"
 * "order": n (starting from 1)
 */

const fs = require('fs');
const path = require('path');

const GALLERY_DIR = path.join(__dirname, '../public/gallery');
const DATA_DIR = path.join(__dirname, '../src/data/gallery');

// Read all JSON files
const jsonFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

console.log('📁 Found', jsonFiles.length, 'gallery categories\n');

let movedCount = 0;
let updatedCount = 0;

for (const jsonFile of jsonFiles) {
    const jsonPath = path.join(DATA_DIR, jsonFile);
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    const slug = data.slug;
    const categoryDir = path.join(GALLERY_DIR, slug);
    const imagesDir = path.join(categoryDir, 'images');

    console.log(`\n📂 Processing: ${slug}`);

    // Ensure category folder exists
    if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
    }

    // Ensure images folder exists
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Process each image
    const newImages = [];

    for (let i = 0; i < data.images.length; i++) {
        const img = data.images[i];
        const imageIndex = i + 1; // Start from 1
        const indexDir = path.join(imagesDir, String(imageIndex));

        // Create index folder
        if (!fs.existsSync(indexDir)) {
            fs.mkdirSync(indexDir, { recursive: true });
        }

        // Get current image path
        let currentImagePath = img.image;
        if (!currentImagePath) {
            console.log(`   ⚠️  Image #${imageIndex} has no path, skipping`);
            newImages.push({
                ...img,
                order: imageIndex
            });
            continue;
        }

        // Resolve full path
        let oldFullPath;
        if (currentImagePath.startsWith('/gallery/')) {
            // Already absolute
            oldFullPath = path.join(GALLERY_DIR, '..', 'public', currentImagePath);
        } else {
            // Relative
            oldFullPath = path.join(GALLERY_DIR, currentImagePath);
        }

        // Check if already in correct structure
        const expectedPathPattern = `/gallery/${slug}/images/${imageIndex}/`;
        if (currentImagePath.includes(expectedPathPattern)) {
            console.log(`   ⏭️  Already migrated: images/${imageIndex}/`);
            newImages.push({
                ...img,
                order: imageIndex
            });
            continue;
        }

        // Get file extension
        const ext = path.extname(oldFullPath) || '.jpg';
        const newFilename = `image${ext}`;
        const newFullPath = path.join(indexDir, newFilename);
        const newRelativePath = `/gallery/${slug}/images/${imageIndex}/${newFilename}`;

        // Move file if exists
        if (fs.existsSync(oldFullPath)) {
            // Check if destination already has a file
            if (fs.existsSync(newFullPath)) {
                console.log(`   ⏭️  Destination exists: images/${imageIndex}/${newFilename}`);
            } else {
                fs.renameSync(oldFullPath, newFullPath);
                console.log(`   📦 Moved: → images/${imageIndex}/${newFilename}`);
                movedCount++;
            }
        } else {
            console.log(`   ⚠️  Source not found: ${currentImagePath}`);
        }

        // Update image reference
        newImages.push({
            image: newRelativePath,
            alt: img.alt || `${data.title} ${imageIndex}`,
            order: imageIndex
        });
    }

    // Update JSON
    data.images = newImages;
    data.order = data.order || 1;
    data.coverIndex = 1; // First image is cover

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');
    console.log(`   💾 Updated JSON: ${jsonFile}`);
    updatedCount++;
}

// Clean up empty folders in gallery root
console.log('\n🧹 Cleaning up empty folders...');
const entries = fs.readdirSync(GALLERY_DIR, { withFileTypes: true });
for (const entry of entries) {
    if (entry.isDirectory()) {
        const subPath = path.join(GALLERY_DIR, entry.name);
        const subEntries = fs.readdirSync(subPath);

        // Check for loose files (not in images/ folder)
        for (const subEntry of subEntries) {
            const fullSubPath = path.join(subPath, subEntry);
            if (fs.statSync(fullSubPath).isFile()) {
                // This is a loose file, should have been migrated
                console.log(`   ⚠️  Loose file found: ${entry.name}/${subEntry}`);
            }
        }
    } else if (entry.isFile()) {
        // Loose file at gallery root
        console.log(`   ⚠️  Loose file at root: ${entry.name}`);
    }
}

console.log('\n' + '='.repeat(50));
console.log(`✅ Migration complete!`);
console.log(`   📦 Files moved: ${movedCount}`);
console.log(`   💾 JSON files updated: ${updatedCount}`);
console.log('\nNext steps:');
console.log('1. Review: git status');
console.log('2. Commit: git add . && git commit -m "migrate: restructure gallery to Keystatic format"');
console.log('3. Push: git push');
