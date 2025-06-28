// src/app/features/AdminPage/AdminPage.tsx
import  { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function AdminPage() {
    const [uploading, setUploading] = useState(false);
    const [uploadUrl, setUploadUrl] = useState("");
    const [caption, setCaption] = useState("");
    const navigate = useNavigate();
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [selectedGalleryId, setSelectedGalleryId] = useState<string>("");
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [newGalleryTitle, setNewGalleryTitle] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [clientEmail, setClientEmail] = useState("");
    const [accessCode, setAccessCode] = useState("");


    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role !== "Admin") {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        fetch("/api/galleries")
            .then((res) => res.json())
            .then(setGalleries);
    }, []);

    useEffect(() => {
        if (selectedGalleryId) {
            fetch(`/api/galleries/${selectedGalleryId}/photos`)
                .then((res) => res.json())
                .then(setPhotos);
        }
    }, [selectedGalleryId]);

    const handleDeletePhoto = (photoId: string) => {
        fetch(`/api/photos/${photoId}`, { method: "DELETE" })
            .then(() => setPhotos((prev) => prev.filter((p) => p.id !== photoId)));
    };

    const handleCreateGallery = () => {
        const newGallery = {
            title: newGalleryTitle,
            isPrivate,
            clientEmail: isPrivate ? clientEmail : null,
            accessCode: isPrivate ? accessCode : null,
            category: "Custom", // optional: set default category
        };

        fetch("https://localhost:5001/api/galleries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newGallery),
        })
            .then((res) => res.json())
            .then((gallery) => {
                setGalleries((prev) => [...prev, gallery]);
                setNewGalleryTitle("");
                setIsPrivate(false);
                setClientEmail("");
                setAccessCode("");
            });
    };


    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "YOUR_UNSIGNED_UPLOAD_PRESET");

        const response = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        setUploadUrl(data.secure_url);
        setUploading(false);
    };

    const handleSavePhoto = () => {
        if (!uploadUrl) return;

        const newPhoto = {
            url: uploadUrl,
            caption,
            galleryId: selectedGalleryId,
        };

        fetch("/api/photos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPhoto),
        })
            .then((res) => res.json())
            .then((savedPhoto) => {
                setPhotos((prev) => [...prev, savedPhoto]);
                setUploadUrl("");
                setCaption("");
            });
    };


    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Create New Gallery</h2>
                <input
                    type="text"
                    value={newGalleryTitle}
                    onChange={(e) => setNewGalleryTitle(e.target.value)}
                    placeholder="Gallery Title"
                    className="p-2 border border-gray-300 rounded mr-2"
                />

                <div className="flex items-center space-x-2 mb-2">
                    <input
                        id="privateGalleryCheckbox"
                        type="checkbox"
                        checked={isPrivate}
                        onChange={() => setIsPrivate(!isPrivate)}
                    />
                    <label htmlFor="privateGalleryCheckbox" className="cursor-pointer">
                        Private Gallery
                    </label>
                </div>


                {isPrivate && (
                    <>
                        <input
                            type="email"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            placeholder="Client Email"
                            className="p-2 border border-gray-300 rounded mr-2"
                        />
                        <input
                            type="text"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            placeholder="Access Code"
                            className="p-2 border border-gray-300 rounded mr-2"
                        />
                    </>
                )}

                <button
                    onClick={handleCreateGallery}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create Gallery
                </button>
            </div>


            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Select Gallery</h2>
                <select
                    value={selectedGalleryId}
                    onChange={(e) => setSelectedGalleryId(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="">-- Select --</option>
                    {galleries.map((gallery) => (
                        <option key={gallery.id} value={gallery.category}>
                            {gallery.title}
                        </option>
                    ))}
                </select>

                {galleries.length === 0 && (
                    <p className="text-gray-500 mt-2">No galleries found. Create one above to get started.</p>
                )}


                {selectedGalleryId && (
                    <div className="mb-10 mt-6 border-t pt-6">
                        <h3 className="text-xl font-semibold mb-4">Upload a Photo to This Gallery</h3>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Caption (optional)"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full mb-2"
                        />
                        <button
                            onClick={handleSavePhoto}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            disabled={!uploadUrl || uploading}
                        >
                            {uploading ? "Uploading..." : "Save Photo"}
                        </button>
                    </div>
                )}

            </div>

            {photos.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Photos in Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {photos.map((photo) => (
                            <div key={photo.id} className="border rounded overflow-hidden">
                                <img
                                    src={photo.url}
                                    alt={photo.caption || "Photo"}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="flex justify-between items-center p-2">
                                    <span>{photo.caption}</span>
                                    <button
                                        onClick={() => handleDeletePhoto(photo.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
