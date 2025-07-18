import { useEffect, useState } from "react";

// Interfaces for gallery and photo
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
    // State 
    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [error, setError] = useState("");
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    // Fetch client's private gallery on mount 
    useEffect(() => {
        const role = localStorage.getItem("userRole");

        // Redirect non-clients to login
        if (role !== "Client") {
            window.location.href = "/login";
            return;
        }

        // Fetch gallery for authenticated client
        fetch("https://lpphotography.azurewebsites.net/api/galleries/client", {
            method: "GET",
            credentials: "include", // send cookies
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

    //  Error state 
    if (error) {
        return <div className="p-6 text-red-600">Error: {error}</div>;
    }

    // Loading state 
    if (!gallery) {
        return <div className="p-6">Loading your gallery...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6 font-sans text-gray-900">
            <h1 className="text-3xl font-bold text-center mb-8">{gallery.title}</h1>

            {/*  Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {gallery.photos.map((photo) => (
                    <div key={photo.id} className="rounded overflow-hidden shadow">
                        {/* 📷 Thumbnail Image */}
                        <img
                            src={photo.url}
                            alt={photo.caption || "Photo"}
                            onClick={() => setSelectedPhoto(photo)}
                            className="cursor-pointer w-full h-48 object-cover rounded hover:opacity-80 transition"
                        />

                        {/* 📎 Download link */}
                        <div className="flex justify-center gap-4 p-2 bg-white">
                            <a
                                href={photo.url.replace("/upload/", "/upload/fl_attachment/")}
                                download
                                className="text-sm text-indigo-600 hover:underline"
                            >
                                Download
                            </a>
                        </div>

                        {/* Caption (optional) */}
                        {photo.caption && (
                            <div className="p-2 bg-white text-sm text-center">
                                {photo.caption}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal for fullscreen preview  */}
            {selectedPhoto && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="relative max-w-4xl w-full mx-4">
                        {/* ❌ Close Button */}
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-300 transition"
                            aria-label="Close"
                        >
                            &times;
                        </button>

                        {/* Fullscreen Image */}
                        <img
                            src={selectedPhoto.url}
                            alt={selectedPhoto.caption || "Full View"}
                            className="w-full max-h-[80vh] object-contain rounded shadow-lg"
                        />

                        {/* Download + Close */}
                        <div className="flex justify-center gap-6 mt-4">
                            <a
                                href={selectedPhoto.url.replace(
                                    "/upload/",
                                    "/upload/fl_attachment/"
                                )}
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

                        {/* Optional caption below modal */}
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
