
const { createPDF } = require("../services/pdfService");

const generatePDF = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload images first."
            });
        }

        const pdfBuffer = await createPDF(req.files);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="StudySnap-Notes.pdf"'
        );

        res.send(pdfBuffer);

    } catch (error) {
        console.error("PDF Error:", error);

        res.status(500).json({
            success: false,
            message: "PDF generation failed."
        });
    }
};

module.exports = { generatePDF };
