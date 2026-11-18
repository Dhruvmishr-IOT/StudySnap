
const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const { processOCR } = require("../controllers/ocrController");
const { generatePDF } = require("../controllers/pdfController");

// OCR API
router.post("/ocr", upload.array("images", 20), processOCR);

// PDF API
router.post("/pdf", upload.array("images", 20), generatePDF);

module.exports = router;
