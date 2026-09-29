import puppeteer from '../ui/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.resolve(__dirname, '../presentation_assets');
fs.makedirs ? fs.makedirs(outputDir) : fs.mkdirSync(outputDir, { recursive: true });

const artifactDir = '/Users/anvinpshibu/.gemini/antigravity-ide/brain/0267562b-c371-46e4-b07f-6bd089aa39b8/presentation_assets';
fs.mkdirSync(artifactDir, { recursive: true });

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function capture() {
  console.log('Launching headless Google Chrome for presentation asset capture...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1920,1080',
    ],
    defaultViewport: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2, // 2x Retina resolution for sharp PPT projection
    },
  });

  const page = await browser.newPage();
  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1500));

  const saveShot = async (name, description) => {
    const localPath = path.join(outputDir, name);
    const artPath = path.join(artifactDir, name);
    await page.screenshot({ path: localPath, fullPage: false });
    fs.copyFileSync(localPath, artPath);
    const size = (fs.statSync(localPath).size / 1024).toFixed(0);
    console.log(`✓ Captured [${name}] (${size} KB): ${description}`);
  };

  // 1. Main Dashboard View
  await saveShot('01_main_gis_digital_twin.png', 'Full Watershed Digital Twin with Palakkad AOI, Stream Hierarchy, Field Evidence Pins & KPIs');

  // 2. Open Evidence Dossier Modal
  console.log('Clicking on Masonry Stream Check Dam observation...');
  const obsCards = await page.$$('.terminal-card');
  let clickedCard = false;
  for (const card of obsCards) {
    const text = await page.evaluate((el) => el.innerText, card);
    if (text.includes('Masonry Stream Check Dam') || text.includes('OBS-001')) {
      await card.click();
      clickedCard = true;
      break;
    }
  }
  if (!clickedCard) {
    // Click pin on map as fallback
    await page.click('circle[fill="#d9461e"]');
  }
  await new Promise((r) => setTimeout(r, 1200));
  await saveShot('02_evidence_dossier_modal.png', 'Evidence Dossier Modal: Authentic Kasaragod Check Dam photo, AI detection box, SHA-256, GPS & Satellite Context');

  // Close Evidence modal
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 800));

  // 3. Open Ingestion Modal
  console.log('Opening Ingestion Modal...');
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text.includes('INGEST PHOTO')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));
  await saveShot('03_field_ingestion_modal.png', 'Forensic Ingestion Modal: Zero-Fabrication EXIF GPS Extraction & Web Crypto SHA-256 Engine');

  // Upload real field image to demonstrate live in-browser forensic verification
  console.log('Uploading real field photo to Ingestion Modal...');
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    const testImgPath = path.resolve(__dirname, '../data/field_images/PND_Percolation_Storage_02.jpg');
    await fileInput.uploadFile(testImgPath);
    await new Promise((r) => setTimeout(r, 1500));
    await saveShot('03b_field_ingestion_verified_pass.png', 'Live Forensic Verification: Real EXIF GPS coordinates extracted, SHA-256 computed & integrity pass badge');
  }

  // Close Ingestion modal
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 800));

  // 4. Temporal Split Comparison View
  console.log('Switching to Temporal Split View...');
  const viewButtons = await page.$$('button');
  for (const btn of viewButtons) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text.includes('TEMPORAL SPLIT') || text.includes('02 TEMPORAL')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1200));
  await saveShot('04_temporal_split_comparison.png', 'Multitemporal Split-Screen: Sentinel-2 2023 Baseline vs 2026 Greening (+34.5% NDVI gain & water retention)');

  // 5. Switch back to Digital Twin and select NDWI Water Layer
  for (const btn of await page.$$('button')) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text.includes('DIGITAL TWIN') || text.includes('01 DIGITAL')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));

  for (const btn of await page.$$('button')) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text.includes('NDWI WATER')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1000));
  await saveShot('05_water_spectral_ndwi_layer.png', 'Surface Hydrology Analysis: Normalized Difference Water Index (NDWI) with perennial water body delineation');

  // 6. DoLR Audit Report Modal
  console.log('Opening DoLR Audit Report Modal...');
  for (const btn of await page.$$('button')) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text.includes('DoLR AUDIT REPORT') || text.includes('AUDIT REPORT')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1200));
  await saveShot('06_dolr_audit_report_modal.png', 'Government Audit & Compliance Dossier: Automated DoLR Report with forensic SHA-256 chain of custody');

  // Close report modal
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 800));

  // 7. Element screenshot: Right Analytics & KPI Panel
  console.log('Capturing modular element screenshots...');
  const rightPanel = await page.$('.sidebar-panel.right');
  if (rightPanel) {
    const localPath = path.join(outputDir, '07_metrics_kpi_panel.png');
    await rightPanel.screenshot({ path: localPath });
    fs.copyFileSync(localPath, path.join(artifactDir, '07_metrics_kpi_panel.png'));
    console.log('✓ Captured [07_metrics_kpi_panel.png]: Dedicated KPI Grid & Field Evidence Stream');
  }

  // 8. Element screenshot: Left AOI & Layer Control
  const leftPanel = await page.$('.sidebar-panel:not(.right)');
  if (leftPanel) {
    const localPath = path.join(outputDir, '08_aoi_layers_control.png');
    await leftPanel.screenshot({ path: localPath });
    fs.copyFileSync(localPath, path.join(artifactDir, '08_aoi_layers_control.png'));
    console.log('✓ Captured [08_aoi_layers_control.png]: AOI Metadata & Remote Sensing Calibrated Layers');
  }

  await browser.close();
  console.log('\nAll high-resolution presentation screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
