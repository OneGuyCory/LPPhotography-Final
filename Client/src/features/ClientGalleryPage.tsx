import { useEffect, useState } from "react";

interface Gallery {
    id: string;
    title: string;
    photos: Photo[];
}

interface Photo {
    id: string;
    url: string;
    caption: string;
}

export default function ClientGallery() {
    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [error, setError] = useState("");
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role !== "Client") {
            window.location.href = "/login";
            return;
        }

        fetch("https://localhost:5001/api/galleries/client", {
            method: "GET",
            credentials: "include",
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errMsg = await res.text();
                    throw new Error(errMsg);
                }
                return res.json();
            })
            .then(setGallery)
            .catch((err) => {
                setError(err.message || "Something went wrong.");
            });
    }, []);

    if (error) {
        return <div className="p-6 text-red-600">Error: {error}</div>;
    }

    if (!gallery) {
        return <div className="p-6">Loading your gallery...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6 font-sans text-gray-900">
            <h1 className="text-3xl font-bold text-center mb-8">{gallery.title}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {gallery.photos.map((photo) => (
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

            {/* 📸 Fullscreen Modal */}
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
                            <p className="text-white mt-4 text-center text-lg">
                                {selectedPhoto.caption}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
