
const PDFDocument = require("pdfkit");
const sharp = require("sharp");

async function createPDF(files) {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: "A4",
                margin: 40,
                autoFirstPage: false
            });

            const chunks = [];

            doc.on("data", chunk => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);

            for (const file of files) {
                const imageBuffer = await sharp(file.buffer)
                    .rotate()
                    .jpeg()
                    .toBuffer();

                doc.addPage();

                doc.image(imageBuffer, 40, 40, {
                    fit: [515, 762],
                    align: "center",
                    valign: "center"
                });
            }

            doc.end();

        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { createPDF };
