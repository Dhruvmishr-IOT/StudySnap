
const { extractTextFromImages } = require("../services/ocrService");

const processOCR = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one image."
            });
        }

        const results = await extractTextFromImages(req.files);

        res.status(200).json({
            success: true,
            totalImages: results.length,
            results
        });

    } catch (error) {
        console.error("OCR Error:", error);

        res.status(500).json({
            success: false,
            message: "Text extraction failed."
        });
    }
};

module.exports = { processOCR };
