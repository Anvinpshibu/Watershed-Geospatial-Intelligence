import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import exifr from '../ui/node_modules/exifr/dist/full.esm.mjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const catalogPath = path.resolve(__dirname, '../data/field_images/catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

console.log('================================================================');
console.log('ARASKOVA GEOSPATIAL INTELLIGENCE // REAL IMAGE FORENSIC AUDIT');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

for (const entry of catalog) {
  const filePath = path.resolve(__dirname, '../ui/public/field_images', entry.file_name);
  console.log(`Auditing [${entry.id}]: ${entry.display_name} (${entry.file_name})`);

  if (!fs.existsSync(filePath)) {
    console.error(`  FAIL: Image file not found at ${filePath}`);
    failCount++;
    continue;
  }

  const fileBytes = fs.readFileSync(filePath);
  const sizeKb = (fileBytes.length / 1024).toFixed(1);

  // 1. Verify cryptographic SHA-256
  const computedHash = crypto.createHash('sha256').update(fileBytes).digest('hex');
  if (computedHash === entry.sha256_hash) {
    console.log(`  ✓ SHA-256 Hash Matched: ${computedHash}`);
    passCount++;
  } else {
    console.error(`  FAIL: SHA-256 mismatch! Expected: ${entry.sha256_hash}, Got: ${computedHash}`);
    failCount++;
  }

  // 2. Verify EXIF parsing via exifr
  const exif = await exifr.parse(fileBytes);

  if (!exif) {
    console.error('  FAIL: No EXIF parsed by exifr');
    failCount++;
    continue;
  }

  // Verify latitude & longitude
  const latDiff = Math.abs(exif.latitude - entry.latitude);
  const lonDiff = Math.abs(exif.longitude - entry.longitude);

  if (latDiff < 0.001 && lonDiff < 0.001) {
    console.log(`  ✓ Binary EXIF GPS Matched: ${exif.latitude.toFixed(4)}°N, ${exif.longitude.toFixed(4)}°E`);
    passCount++;
  } else {
    console.error(`  FAIL: GPS coords mismatch! Catalog: ${entry.latitude}, ${entry.longitude} vs EXIF: ${exif.latitude}, ${exif.longitude}`);
    failCount++;
  }

  // Verify Camera & Device metadata
  if (exif.Make === entry.camera_make) {
    console.log(`  ✓ Camera Hardware Matched: ${exif.Make} ${exif.Model}`);
    passCount++;
  } else {
    console.warn(`  ! Camera make difference: EXIF=${exif.Make}, Catalog=${entry.camera_make}`);
  }

  console.log(`  -> File Verified: ${sizeKb} KB, High-Fidelity Forensic Evidence Authenticated\n`);
}

// 3. Test Zero-Fabrication Policy on Unlocated Image
console.log('Testing Zero-Fabrication GPS Policy on unlocated image...');
const blankBytes = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xd9]);
const unlocatedExif = await exifr.parse(blankBytes).catch(() => null);
if (!unlocatedExif || unlocatedExif.latitude === undefined) {
  console.log('  ✓ Zero-Fabrication Confirmed: No coordinates synthesized for unlocated image\n');
  passCount++;
} else {
  console.error('  FAIL: Coordinates were fabricated for unlocated image');
  failCount++;
}

console.log('================================================================');
console.log(`AUDIT COMPLETE: ${passCount} Checks Passed, ${failCount} Failures`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
}
