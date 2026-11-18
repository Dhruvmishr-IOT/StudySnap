
import { Trash2, ArrowUp, ArrowDown } from "lucide-react";

function ImagePreview({ images, onRemove, onMove }) {
    if (images.length === 0) return null;

    return (
        <div className="preview-section">
            <h3>Uploaded Images ({images.length})</h3>

            <div className="image-grid">
                {images.map((image, index) => (
                    <div className="image-card" key={image.id}>
                        <img src={image.preview} alt={image.file.name} />

                        <p>{image.file.name}</p>

                        <div className="image-actions">
                            <button
                                onClick={() => onMove(index, -1)}
                                disabled={index === 0}
                                title="Move up"
                            >
                                <ArrowUp size={17} />
                            </button>

                            <button
                                onClick={() => onMove(index, 1)}
                                disabled={index === images.length - 1}
                                title="Move down"
                            >
                                <ArrowDown size={17} />
                            </button>

                            <button
                                onClick={() => onRemove(image.id)}
                                className="delete-button"
                                title="Remove image"
                            >
                                <Trash2 size={17} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ImagePreview;
