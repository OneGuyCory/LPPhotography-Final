import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

interface Photo {
    id: string;
    url: string;
    caption?: string;
}

const mockGalleryPhotos: { [key: string]: Photo[] } = {
    weddings: [
        { id: "1", url: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/wedding1.jpg", caption: "Ceremony" },
        { id: "2", url: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/wedding2.jpg", caption: "First Dance" }
    ],
    portraits: [
        { id: "1", url: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/portrait1.jpg", caption: "Outdoor Headshot" },
        { id: "2", url: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/portrait2.jpg", caption: "Studio Shot" }
    ],
    events: [
        { id: "1", url: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/event1.jpg" },
        { id: "2", url: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/event2.jpg" }
    ],
    landscapes: [
        { id: "1", url: "https://res.cloudinary.com/dxqrgfgqo/image/upload/v1748728132/LPPhotography/o1kxybps3sygylornf6o.jpg", caption: "flower"}
    ]
};



const GalleryDetailPage: React.FC = () => {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const { id } = useParams(); // id will be something like 'weddings' or 'portraits'
    const [photos, setPhotos] = useState<Photo[]>([]);

    useEffect(() => {
        // This would become a fetch(`/api/galleries/${id}/photos`) later
        const galleryPhotos = mockGalleryPhotos[id as string] || [];
        setPhotos(galleryPhotos);
    }, [id]);

    return (
        <div className="max-w-6xl mx-auto p-6 font-sans text-gray-900">
            <h2 className="text-3xl font-bold text-center capitalize mb-8">{id} Gallery</h2>

            {photos.length === 0 ? (
                <p className="text-center text-gray-600">No photos available in this gallery.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {photos.map(photo => (
                        <div key={photo.id} className="rounded overflow-hidden shadow">
                            <img
                                src={photo.url}
                                alt={photo.caption || "Photo"}
                                onClick={() => setSelectedPhoto(photo)}
                                className="cursor-pointer w-full h-48 object-cover rounded hover:opacity-80 transition"
                            />
                            {photo.caption && (
                                <div className="p-2 bg-white text-sm text-center">{photo.caption}</div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* 📸 Modal to show selected photo full screen */}
            {selectedPhoto && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="relative max-w-4xl w-full mx-4">
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-300 transition"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <img
                            src={selectedPhoto.url}
                            alt={selectedPhoto.caption || "Full View"}
                            className="w-full max-h-[80vh] object-contain rounded shadow-lg"
                        />
                        {selectedPhoto.caption && (
                            <p className="text-white mt-4 text-center text-lg">{selectedPhoto.caption}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryDetailPage;
