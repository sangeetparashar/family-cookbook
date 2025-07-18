/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

// Configuration
const CONFIG = {
  pdfFolder: "./public/recipes",
  outputFormat: "png", // or 'jpg' if you prefer
  density: 300, // DPI for conversion (300 is good for text)
  quality: 95, // Only used for JPEG (1-100)
  concurrent: 3, // Number of concurrent conversions
};

class PDFConverter {
  constructor() {
    this.convertedCount = 0;
    this.errorCount = 0;
    this.totalFiles = 0;
  }

  async checkDependencies() {
    try {
      await execAsync("magick -version");
      console.log("✅ ImageMagick is installed");
    } catch (error) {
      console.error(error);
      console.error("❌ ImageMagick is not installed or not in PATH");
      console.error("Please install ImageMagick:");
      console.error(
        "- Windows: https://imagemagick.org/script/download.php#windows"
      );
      console.error("- macOS: brew install imagemagick");
      console.error("- Linux: sudo apt-get install imagemagick");
      process.exit(1);
    }
  }

  async getPdfFiles() {
    try {
      const files = fs.readdirSync(CONFIG.pdfFolder);
      return files.filter(
        (file) => path.extname(file).toLowerCase() === ".pdf"
      );
    } catch (error) {
      console.error(
        `❌ Error reading directory ${CONFIG.pdfFolder}:`,
        error.message
      );
      return [];
    }
  }

  async convertPdfToImages(pdfPath, outputDir) {
    const pdfName = path.basename(pdfPath, ".pdf");

    try {
      // Create output directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Check if conversion already exists
      const existingFiles = fs
        .readdirSync(outputDir)
        .filter(
          (file) =>
            file.startsWith("page-") && file.endsWith(`.${CONFIG.outputFormat}`)
        );

      if (existingFiles.length > 0) {
        console.log(
          `⏭️  Skipping ${pdfName} - already converted (${existingFiles.length} pages)`
        );
        return { success: true, pages: existingFiles.length, skipped: true };
      }

      // Build ImageMagick command
      const outputPath = path.join(outputDir, `page-%d.${CONFIG.outputFormat}`);
      let command = `magick -density ${CONFIG.density}`;

      if (CONFIG.outputFormat === "jpg") {
        command += ` -quality ${CONFIG.quality}`;
      }

      command += ` "${pdfPath}" "${outputPath}"`;

      console.log(`🔄 Converting ${pdfName}...`);

      const startTime = Date.now();
      await execAsync(command);
      const endTime = Date.now();

      // Count generated pages
      const generatedFiles = fs
        .readdirSync(outputDir)
        .filter(
          (file) =>
            file.startsWith("page-") && file.endsWith(`.${CONFIG.outputFormat}`)
        );

      const processingTime = ((endTime - startTime) / 1000).toFixed(2);
      console.log(
        `✅ ${pdfName} converted successfully - ${generatedFiles.length} pages (${processingTime}s)`
      );

      return { success: true, pages: generatedFiles.length, skipped: false };
    } catch (error) {
      console.error(`❌ Error converting ${pdfName}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async processInBatches(pdfFiles, batchSize) {
    const results = [];

    for (let i = 0; i < pdfFiles.length; i += batchSize) {
      const batch = pdfFiles.slice(i, i + batchSize);
      const batchPromises = batch.map(async (pdfFile) => {
        const pdfPath = path.join(CONFIG.pdfFolder, pdfFile);
        const pdfName = path.basename(pdfFile, ".pdf");
        const outputDir = path.join(CONFIG.pdfFolder, pdfName);

        return this.convertPdfToImages(pdfPath, outputDir);
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      console.log(
        `📊 Batch ${Math.ceil((i + batchSize) / batchSize)} of ${Math.ceil(
          pdfFiles.length / batchSize
        )} completed`
      );
    }

    return results;
  }

  generateSummaryReport(results, pdfFiles) {
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);
    const skipped = results.filter((r) => r.success && r.skipped);
    const totalPages = successful.reduce((sum, r) => sum + (r.pages || 0), 0);

    console.log("\n📋 CONVERSION SUMMARY");
    console.log("=".repeat(50));
    console.log(`📁 Total PDF files found: ${pdfFiles.length}`);
    console.log(
      `✅ Successfully converted: ${successful.length - skipped.length}`
    );
    console.log(`⏭️  Skipped (already exists): ${skipped.length}`);
    console.log(`❌ Failed conversions: ${failed.length}`);
    console.log(`📄 Total pages generated: ${totalPages}`);
    console.log(`💾 Output format: ${CONFIG.outputFormat.toUpperCase()}`);
    console.log(`🎯 Quality settings: ${CONFIG.density} DPI`);

    if (failed.length > 0) {
      console.log("\n❌ FAILED CONVERSIONS:");
      failed.forEach((result, index) => {
        console.log(`${index + 1}. Error: ${result.error}`);
      });
    }

    // Generate file structure preview
    console.log("\n📂 GENERATED FILE STRUCTURE:");
    console.log("public/recipes/");
    pdfFiles.slice(0, 3).forEach((file) => {
      const name = path.basename(file, ".pdf");
      console.log(`├── ${name}/`);
      console.log(`│   ├── page-1.${CONFIG.outputFormat}`);
      console.log(`│   ├── page-2.${CONFIG.outputFormat}`);
      console.log(`│   └── ...`);
      console.log(`└── ${file} (original PDF)`);
    });

    if (pdfFiles.length > 3) {
      console.log(`... and ${pdfFiles.length - 3} more recipe folders`);
    }
  }

  async run() {
    console.log("🚀 PDF to Image Converter Started");
    console.log("=".repeat(50));

    // Check dependencies
    await this.checkDependencies();

    // Get PDF files
    const pdfFiles = await this.getPdfFiles();

    if (pdfFiles.length === 0) {
      console.log(`❌ No PDF files found in ${CONFIG.pdfFolder}`);
      return;
    }

    console.log(`📁 Found ${pdfFiles.length} PDF files to process`);
    console.log(
      `⚙️  Settings: ${
        CONFIG.density
      } DPI, ${CONFIG.outputFormat.toUpperCase()} format`
    );
    console.log(`🔄 Processing ${CONFIG.concurrent} files concurrently...\n`);

    const startTime = Date.now();

    // Process files in batches
    const results = await this.processInBatches(pdfFiles, CONFIG.concurrent);

    const endTime = Date.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(2);

    // Generate summary report
    this.generateSummaryReport(results, pdfFiles);

    console.log(`\n⏱️  Total processing time: ${totalTime} seconds`);
    console.log("🎉 Conversion completed!");
  }
}

// Run the converter
const converter = new PDFConverter();
converter.run().catch(console.error);
