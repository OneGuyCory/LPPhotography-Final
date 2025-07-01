import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

// === Defines a Photo structure ===
interface Photo {
    id: string;
    url: string;
    caption?: string;
}

// === Main Component ===
const GalleryDetailPage: React.FC = () => {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null); // For full-screen modal view
    const { id } = useParams<{ id: string }>(); // Gets the gallery ID from URL
    const [photos, setPhotos] = useState<Photo[]>([]); // Stores photo data
    const [loading, setLoading] = useState(true); // Tracks loading state

    // === Fetches gallery photos when page loads or ID changes ===
    useEffect(() => {
        if (!id) return;

        fetch(`https://localhost:5001/api/galleries/${id}/photos`, {
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch photos");
                return res.json();
            })
            .then((data) => {
                setPhotos(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading photos:", err);
                setLoading(false);
            });
    }, [id]);

    return (
        <div className="max-w-6xl mx-auto p-6 font-sans text-gray-900">
            {/* === Header Section === */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold capitalize">Gallery</h2>
                <Link to="/galleries" className="text-indigo-600 hover:underline text-sm">
                    ← Back to Galleries
                </Link>
            </div>

            {/* === Photo Grid / Loading / Empty State === */}
            {loading ? (
                <p className="text-center text-gray-600">Loading photos...</p>
            ) : photos.length === 0 ? (
                <p className="text-center text-gray-600">No photos available in this gallery.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {photos.map((photo) => (
                        <div key={photo.id} className="rounded overflow-hidden shadow">
                            {/* === Thumbnail Clickable Image === */}
                            <img
                                src={photo.url}
                                alt={photo.caption || "Photo"}
                                onClick={() => setSelectedPhoto(photo)}
                                className="cursor-pointer w-full h-48 object-cover rounded hover:opacity-80 transition"
                            />

                            {/* === Download Button === */}
                            <div className="flex justify-center gap-4 p-2 bg-white">
                                <a
                                    href={photo.url.replace("/upload/", "/upload/fl_attachment/")}
                                    download
                                    className="text-sm text-indigo-600 hover:underline"
                                >
                                    Download
                                </a>
                            </div>

                            {/* === Optional Caption === */}
                            {photo.caption && (
                                <div className="p-2 bg-white text-sm text-center">
                                    {photo.caption}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* === Modal Viewer (if user clicks on a photo) === */}
            {selectedPhoto && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="relative max-w-4xl w-full mx-4">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-300 transition"
                            aria-label="Close"
                        >
                            &times;
                        </button>

                        {/* Large Image */}
                        <img
                            src={selectedPhoto.url}
                            alt={selectedPhoto.caption || "Full View"}
                            className="w-full max-h-[80vh] object-contain rounded shadow-lg"
                        />

                        {/* Download + Close Actions */}
                        <div className="flex justify-center gap-6 mt-4">
                            <a
                                href={selectedPhoto.url.replace("/upload/", "/upload/fl_attachment/")}
                                download
                                className="text-white bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700 transition text-sm"
                            >
                                Download
                            </a>
                            <button
                                onClick={() => setSelectedPhoto(null)}
                                className="text-sm text-white underline hover:text-red-300"
                            >
                                Close
                            </button>
                        </div>

                        {/* Caption Below Image */}
                        {selectedPhoto.caption && (
                            <p className="text-white mt-4 text-center text-lg">
                                {selectedPhoto.caption}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryDetailPage;
