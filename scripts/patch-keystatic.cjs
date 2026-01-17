/**
 * Postinstall script to patch @keystatic/core for OAuth redirect_uri bug
 * 
 * Issue: In githubOauthCallback(), Keystatic sends redirect_uri during initial 
 * OAuth (line 338) but omits it during token exchange (line 217-220).
 * GitHub requires redirect_uri to be consistent across both steps.
 * 
 * This patch adds redirect_uri to the token exchange request.
 */

const fs = require('fs');
const path = require('path');

const filesToPatch = [
    'node_modules/@keystatic/core/dist/keystatic-core-api-generic.js',
    'node_modules/@keystatic/core/dist/keystatic-core-api-generic.worker.js',
    'node_modules/@keystatic/core/dist/keystatic-core-api-generic.node.js',
];

let patchedCount = 0;

for (const relativePath of filesToPatch) {
    const filePath = path.join(__dirname, '..', relativePath);

    if (!fs.existsSync(filePath)) {
        continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Check if already patched
    if (content.includes('/* KEYSTATIC_REDIRECT_URI_PATCH */')) {
        console.log(`ℹ️  Already patched: ${relativePath}`);
        continue;
    }

    // The bug is in githubOauthCallback function around line 217-220:
    // url.searchParams.set('client_id', config.clientId);
    // url.searchParams.set('client_secret', config.clientSecret);
    // url.searchParams.set('code', code);
    // 
    // We need to add redirect_uri after 'code' is set
    // 
    // Pattern: Look for the line that sets 'code' in token exchange context
    // (it's inside githubOauthCallback, after creating URL for access_token)

    const pattern = /url\.searchParams\.set\s*\(\s*['"]code['"]\s*,\s*code\s*\)\s*;/g;

    if (pattern.test(content)) {
        // Reset regex after test
        content = content.replace(
            /url\.searchParams\.set\s*\(\s*['"]code['"]\s*,\s*code\s*\)\s*;/g,
            `url.searchParams.set('code', code); /* KEYSTATIC_REDIRECT_URI_PATCH */ url.searchParams.set('redirect_uri', new URL(req.url).origin + '/api/keystatic/github/oauth/callback');`
        );

        fs.writeFileSync(filePath, content);
        console.log(`✅ Patched: ${relativePath}`);
        patchedCount++;
    } else {
        console.log(`⚠️  Pattern not found in: ${relativePath}`);
    }
}

if (patchedCount > 0) {
    console.log(`\n🎉 Successfully patched ${patchedCount} file(s) for OAuth redirect_uri fix`);
    console.log('   The redirect_uri will now be included in token exchange requests.');
} else {
    console.log('\n⚠️  No files were patched. Keystatic version may have changed or already fixed.');
}
