
import { useRef } from "react";
import { UploadCloud, FileUp } from "lucide-react";

function ImageUploader({ onImagesSelected }) {
    const fileInputRef = useRef(null);

    const handleFiles = (event) => {
        const files = Array.from(event.target.files || []);

        const validFiles = files.filter((file) =>
            ["image/jpeg", "image/png", "image/webp"].includes(file.type)
        );

        if (validFiles.length !== files.length) {
            alert("Only JPG, PNG and WEBP images are allowed.");
        }

        if (validFiles.length > 0) {
            onImagesSelected(validFiles);
        }

        event.target.value = "";
    };

    return (
        <div className="upload-box">

            <UploadCloud size={45} />

            <h3>Upload Your Notes</h3>

            <p>Select multiple images of your notes</p>

            <label className="upload-button">
                Choose Images

                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    hidden
                    onChange={handleFiles}
                />
            </label>

            {/* NEW UPLOAD BUTTON */}
            <button
                type="button"
                className="upload-submit-button"
                onClick={() => fileInputRef.current?.click()}
            >
                <FileUp size={18} />
                Upload Files
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                hidden
                onChange={handleFiles}
            />

            <small>JPG, PNG, WEBP | Maximum 20 images</small>

        </div>
    );
}

export default ImageUploader;
