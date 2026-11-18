
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import ImageUploader from "../components/ImageUploader";
import ImagePreview from "../components/ImagePreview";
import OCRResult from "../components/OCRResult";
import Footer from "../components/Footer.jsx";

import { extractText, generatePDF } from "../services/api";

import { useEffect, useState } from "react";

function Dashboard() {
    const { user, logout } = useAuth();

    const [images, setImages] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Cleanup preview URLs
    useEffect(() => {
        return () => {
            images.forEach((image) => {
                URL.revokeObjectURL(image.preview);
            });
        };
    }, [images]);

    // Upload images
    const handleImagesSelected = (files) => {
        setImages((previous) => {
            const remaining = Math.max(0, 20 - previous.length);
            const selected = files.slice(0, remaining);

            const newImages = selected.map((file) => ({
                id: crypto.randomUUID(),
                file,
                preview: URL.createObjectURL(file)
            }));

            setError(
                selected.length < files.length
                    ? "Maximum 20 images allowed."
                    : ""
            );

            return [...previous, ...newImages];
        });

        setResults([]);
    };

    // Remove image
    const removeImage = (id) => {
        setImages((previous) =>
            previous.filter((image) => image.id !== id)
        );

        setResults([]);
    };

    // Reorder images
    const moveImage = (index, direction) => {
        setImages((previous) => {
            const updated = [...previous];
            const target = index + direction;

            if (target < 0 || target >= updated.length) {
                return previous;
            }

            [updated[index], updated[target]] =
                [updated[target], updated[index]];

            return updated;
        });

        setResults([]);
    };

    // Extract text
    const handleOCR = async () => {
        if (images.length === 0) {
            setError("Please upload images first.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await extractText(
                images.map((image) => image.file)
            );

            setResults(data.results);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Text extraction failed. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    // Generate PDF
    const handlePDF = async () => {
        if (images.length === 0) {
            setError("Please upload images first.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const blob = await generatePDF(
                images.map((image) => image.file)
            );

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "StudySnap-Notes.pdf";

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "PDF generation failed."
            );

        } finally {
            setLoading(false);
        }
    };

    // Edit extracted text
    const handleTextChange = (index, value) => {
        setResults((previous) =>
            previous.map((item, i) =>
                i === index
                    ? { ...item, extractedText: value }
                    : item
            )
        );
    };

    // Logout
    const handleLogout = async () => {
        try {
            await logout();
            window.location.href = "/login";
        } catch (error) {
            setError("Logout failed. Please try again.");
        }
    };

    return (
        <>
            <Navbar />

            <main className="container" id="home">

                <section className="hero">
                    <h1>
                        Welcome, {user?.name || "Student"}!
                    </h1>

                    <p>
                        Turn your study images into smart notes
                        and organized PDFs.
                    </p>

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </section>

                <section id="upload">

                    <ImageUploader
                        onImagesSelected={handleImagesSelected}
                    />

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                    <ImagePreview
                        images={images}
                        onRemove={removeImage}
                        onMove={moveImage}
                    />

                    {images.length > 0 && (
                        <div className="action-buttons">

                            <button
                                onClick={handleOCR}
                                disabled={loading}
                            >
                                {loading
                                    ? "Processing..."
                                    : "Extract Text"}
                            </button>

                            <button
                                onClick={handlePDF}
                                disabled={loading}
                            >
                                {loading
                                    ? "Processing..."
                                    : "Generate PDF"}
                            </button>

                        </div>
                    )}

                    <OCRResult
                        results={results}
                        onTextChange={handleTextChange}
                    />

                </section>

            </main>

            <Footer />

        </>
    );
}

export default Dashboard;
