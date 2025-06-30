import React, { useState, useEffect } from "react";
import {Link} from "react-router";

interface GalleryItem {
    id: string;
    title: string;
    coverImageUrl: string | null;
}

const GalleryPage: React.FC = () => {
    const [galleries, setGalleries] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://localhost:5001/api/galleries", { credentials: "include" })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch galleries");
                }
                return res.json();
            })
            .then((data) => {
                setGalleries(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading galleries:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Gallery</h2>
                    <Link
                        to="/"
                        className="text-indigo-600 hover:underline text-sm"
                    >
                        ← Back to Home
                    </Link>
                </div>

                {loading ? (
                    <p className="text-center text-gray-600">Loading galleries...</p>
                ) : galleries.length === 0 ? (
                    <p className="text-center text-gray-600">
                        No galleries found. Check back soon!
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {galleries.map((gallery) => (
                            <a
                                key={gallery.id}
                                href={`/galleries/${gallery.id}`}
                                className="block rounded overflow-hidden shadow hover:shadow-lg transform hover:scale-[1.01] transition"
                            >
                                <img
                                    src={
                                        gallery.coverImageUrl ||
                                        "https://via.placeholder.com/600x400?text=No+Image"
                                    }
                                    alt={gallery.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4 bg-white">
                                    <h3 className="text-lg font-semibold text-gray-900 text-center">
                                        {gallery.title}
                                    </h3>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GalleryPage;
