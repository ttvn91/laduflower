/**
 * Migration script: Move gallery images to category subfolders
 * This script will:
 * 1. Create subfolders for each gallery category
 * 2. Move images from flat gallery/ to gallery/{category-slug}/
 * 3. Update JSON data files with new paths
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

    console.log(`\n📂 Processing: ${slug}`);

    // Create category subfolder if not exists
    if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
        console.log(`   ✅ Created folder: ${slug}/`);
    }

    let jsonModified = false;

    // Process each image
    for (let i = 0; i < data.images.length; i++) {
        const img = data.images[i];
        if (!img.image) continue;

        const imagePath = img.image;

        // Skip if already using new path format (starts with / or contains slug folder)
        if (imagePath.startsWith('/') || imagePath.includes(slug + '/')) {
            console.log(`   ⏭️  Skipping (already migrated): ${imagePath}`);
            continue;
        }

        // Image is in flat folder - needs migration
        const oldPath = path.join(GALLERY_DIR, imagePath);
        const newFilename = imagePath; // Keep same filename
        const newPath = path.join(categoryDir, newFilename);

        if (fs.existsSync(oldPath)) {
            // Move file
            fs.renameSync(oldPath, newPath);
            console.log(`   📦 Moved: ${imagePath} → ${slug}/${newFilename}`);
            movedCount++;

            // Update JSON with new path
            data.images[i].image = `${slug}/${newFilename}`;
            jsonModified = true;
        } else if (fs.existsSync(newPath)) {
            // File already in subfolder, just update JSON
            console.log(`   ℹ️  Already exists: ${slug}/${newFilename}`);
            data.images[i].image = `${slug}/${newFilename}`;
            jsonModified = true;
        } else {
            console.log(`   ⚠️  File not found: ${imagePath}`);
        }
    }

    // Save updated JSON
    if (jsonModified) {
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');
        console.log(`   💾 Updated: ${jsonFile}`);
        updatedCount++;
    }
}

console.log('\n' + '='.repeat(50));
console.log(`✅ Migration complete!`);
console.log(`   📦 Files moved: ${movedCount}`);
console.log(`   💾 JSON files updated: ${updatedCount}`);
console.log('\nNext steps:');
console.log('1. Review changes: git status');
console.log('2. Commit: git add . && git commit -m "migrate: move gallery images to subfolders"');
console.log('3. Push: git push');
