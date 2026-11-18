
const { createWorker } = require("tesseract.js");
const sharp = require("sharp");

async function preprocessImage(imageBuffer) {
    return await sharp(imageBuffer)
        .rotate()
        .flatten({ background: "#ffffff" })
        .grayscale()
        .normalize()
        .sharpen()
        .resize({
            width: 2500,
            withoutEnlargement: true
        })
        .png()
        .toBuffer();
}

async function extractTextFromImages(files) {
    const worker = await createWorker("eng");

    try {
        // Better settings for printed document pages
        await worker.setParameters({
            tessedit_pageseg_mode: "6",
            preserve_interword_spaces: "1",
            user_defined_dpi: "300"
        });

        const results = [];

        for (const file of files) {
            // Step 1: Improve image quality
            const processedImage = await preprocessImage(file.buffer);

            // Step 2: Extract text
            const { data } = await worker.recognize(processedImage);

            // Step 3: Clean unnecessary whitespace
            const extractedText = data.text
                .replace(/\r\n/g, "\n")
                .replace(/[ \t]+\n/g, "\n")
                .trim();

            results.push({
                filename: file.originalname,
                extractedText
            });
        }

        return results;

    } finally {
        await worker.terminate();
    }
}

module.exports = { extractTextFromImages };
