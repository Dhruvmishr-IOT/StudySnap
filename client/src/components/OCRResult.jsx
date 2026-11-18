
import {
    FileText,
    Copy,
    Download,
    Check,
    Files
} from "lucide-react";

import { useState } from "react";

function OCRResult({ results, onTextChange }) {
    const [copiedIndex, setCopiedIndex] = useState(null);

    if (!results || results.length === 0) return null;

    const copyText = async (text, index) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
        } catch (error) {
            alert("Unable to copy text.");
        }
    };

    const downloadText = (item) => {
        const blob = new Blob(
            [item.extractedText],
            { type: "text/plain;charset=utf-8" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `${item.filename || "extracted-text"}.txt`;
        link.click();

        URL.revokeObjectURL(url);
    };

    const copyAllText = async () => {
        const allText = results
            .map(item => item.extractedText)
            .join("\n\n--------------------\n\n");

        try {
            await navigator.clipboard.writeText(allText);
            setCopiedIndex("all");
        } catch (error) {
            alert("Unable to copy text.");
        }
    };

    return (
        <section className="ocr-section">

            <div className="ocr-header">
                <div className="ocr-heading">
                    <div className="ocr-heading-icon">
                        <FileText size={25} />
                    </div>

                    <div>
                        <h2>Extracted Data</h2>
                        <p>Your extracted text is ready to edit</p>
                    </div>
                </div>

                <div className="ocr-count">
                    <Files size={16} />
                    {results.length} Files
                </div>
            </div>

            <div className="ocr-toolbar">
                <span>
                    Review and edit your extracted notes below.
                </span>

                <button
                    className="ocr-btn ocr-btn-secondary"
                    onClick={copyAllText}
                    type="button"
                >
                    {copiedIndex === "all" ? (
                        <Check size={17} />
                    ) : (
                        <Copy size={17} />
                    )}

                    {copiedIndex === "all" ? "Copied All" : "Copy All"}
                </button>
            </div>

            <div className="ocr-cards">

                {results.map((item, index) => (
                    <div className="ocr-card" key={index}>

                        <div className="ocr-card-header">

                            <div className="ocr-file-info">
                                <div className="ocr-file-icon">
                                    <FileText size={22} />
                                </div>

                                <div>
                                    <h3>{item.filename}</h3>
                                    <p>
                                        Extracted Document {index + 1}
                                    </p>
                                </div>
                            </div>

                            {typeof item.confidence === "number" && (
                                <span className="ocr-confidence">
                                    {item.confidence}% Confidence
                                </span>
                            )}

                        </div>

                        <div className="ocr-editor">
                            <div className="ocr-editor-label">
                                <span>Extracted Text</span>
                                <span>Editable</span>
                            </div>

                            <textarea
                                className="ocr-textarea"
                                value={item.extractedText || ""}
                                onChange={(event) =>
                                    onTextChange(index, event.target.value)
                                }
                                placeholder="Extracted text will appear here..."
                                rows={12}
                            />
                        </div>

                        <div className="ocr-card-actions">

                            <button
                                className="ocr-btn ocr-btn-primary"
                                onClick={() =>
                                    copyText(item.extractedText, index)
                                }
                                type="button"
                            >
                                {copiedIndex === index ? (
                                    <Check size={17} />
                                ) : (
                                    <Copy size={17} />
                                )}

                                {copiedIndex === index ? "Copied" : "Copy Text"}
                            </button>

                            <button
                                className="ocr-btn ocr-btn-secondary"
                                onClick={() => downloadText(item)}
                                type="button"
                            >
                                <Download size={17} />
                                Download TXT
                            </button>

                        </div>

                    </div>
                ))}

            </div>

        </section>
    );
}

export default OCRResult;
