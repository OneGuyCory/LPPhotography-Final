import React from "react";

interface GalleryItem {
    id: string;
    title: string;
    coverImageUrl: string;
}

const sampleGalleries: GalleryItem[] = [
    {
        id: "weddings",
        title: "Weddings",
        coverImageUrl: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/weddings_cover.jpg"
    },
    {
        id: "portraits",
        title: "Portraits",
        coverImageUrl: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/portraits_cover.jpg"
    },
    {
        id: "events",
        title: "Events",
        coverImageUrl: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/events_cover.jpg"
    },
    {
        id: "landscapes",
        title: "Landscapes",
        coverImageUrl: "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/landscapes_cover.jpg"
    }
];

const GalleryPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {sampleGalleries.map((gallery) => (
                        <a
                            key={gallery.id}
                            href={`/galleries/${gallery.id}`}
                            className="block rounded overflow-hidden shadow hover:shadow-lg transform hover:scale-[1.01] transition"
                        >
                            <img
                                src={gallery.coverImageUrl}
                                alt={gallery.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4 bg-white">
                                <h3 className="text-lg font-semibold text-gray-900">{gallery.title}</h3>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GalleryPage;
