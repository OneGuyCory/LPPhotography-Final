// src/app/features/AdminPage/AdminPage.tsx
import { useEffect, useState } from "react";
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
    const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
    const [editCaption, setEditCaption] = useState<string>("");


    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role !== "Admin") {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        fetch("https://localhost:5001/api/galleries/all", { credentials: "include" })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch galleries");
                return res.json();
            })
            .then(setGalleries)
            .catch((err) => {
                console.error("Error loading galleries:", err);
            });
    }, []);

    useEffect(() => {
        if (selectedGalleryId) {
            fetch(`https://localhost:5001/api/galleries/${selectedGalleryId}/photos`)
                .then((res) => res.json())
                .then(setPhotos);
        } else {
            setPhotos([]);
        }
    }, [selectedGalleryId]);

    const handleDeletePhoto = (photoId: string) => {
        fetch(`https://localhost:5001/api/photos/${photoId}`, {
            method: "DELETE",
            credentials: "include",
        }).then(() =>
            setPhotos((prev) => prev.filter((p) => p.id !== photoId))
        );
    };
    
    

    const handleDeleteGallery = (galleryId: string) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this gallery? This will also remove all associated photos."
        );

        if (!confirmDelete) return;

        fetch(`https://localhost:5001/api/galleries/${galleryId}`, {
            method: "DELETE",
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to delete gallery");
                setGalleries((prev) => prev.filter((g) => g.id !== galleryId));

                if (galleryId === selectedGalleryId) {
                    setSelectedGalleryId("");
                    setPhotos([]);
                }

                alert("Gallery deleted successfully.");
            })
            .catch((err) => {
                console.error("Error deleting gallery:", err);
                alert("Failed to delete gallery. Check console for details.");
            });
    };

    const handleCreateGallery = () => {
        const newGallery = {
            title: newGalleryTitle,
            isPrivate,
            clientEmail: isPrivate ? clientEmail : null,
            accessCode: isPrivate ? accessCode : null,
            category: "Custom",
        };

        fetch("https://localhost:5001/api/galleries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
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
        formData.append("upload_preset", "unassigned");

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dxqrgfgqo/image/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.text();
                console.error("Cloudinary upload failed:", error);
                alert("Upload failed. Check console for more.");
                return;
            }

            const data = await response.json();
            setUploadUrl(data.secure_url);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading image.");
        } finally {
            setUploading(false);
        }
    };

    const handleUpdatePhoto = async (photoId: string) => {
        
        
        
        const updatedPhoto = {
            id: photoId,
            caption: editCaption,
            url: photos.find((p) => p.id === photoId)?.url || "",
            galleryId: selectedGalleryId,
        };

        const res = await fetch(`https://localhost:5001/api/photos/${photoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(updatedPhoto),
        });

        if (res.ok) {
            setPhotos((prev) =>
                prev.map((p) => (p.id === photoId ? { ...p, caption: editCaption } : p))
            );
            setEditingPhotoId(null);
        } else {
            alert("Failed to update photo.");
        }
    };


    const handleSavePhoto = () => {
        if (!uploadUrl) return;

        const newPhoto = {
            url: uploadUrl,
            caption,
            galleryId: selectedGalleryId,
        };

        fetch("https://localhost:5001/api/photos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
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
                <h2 className="text-xl font-semibold mb-2">Manage Galleries</h2>
                {galleries.length === 0 ? (
                    <p className="text-gray-500">No galleries found. Create one above to get started.</p>
                ) : (
                    <div className="space-y-2">
                        {galleries.map((gallery) => (
                            <div
                                key={gallery.id}
                                className={`flex justify-between items-center p-3 border rounded ${
                                    gallery.id === selectedGalleryId ? "bg-blue-100" : ""
                                }`}
                            >
                                <span className="font-medium">{gallery.title}</span>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => setSelectedGalleryId(gallery.id)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                    >
                                        Select
                                    </button>
                                    <button
                                        onClick={() => handleDeleteGallery(gallery.id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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

            {photos.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Photos in Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {photos.map((photo) => (
                            <div key={photo.id} className="border rounded overflow-hidden">
                                <img src={photo.url} alt={photo.caption || "Photo"} className="w-full h-48 object-cover" />
                                <div className="p-2">
                                    {editingPhotoId === photo.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editCaption}
                                                onChange={(e) => setEditCaption(e.target.value)}
                                                className="p-1 border border-gray-300 rounded w-full mb-2"
                                            />
                                            <div className="flex justify-between">
                                                <button
                                                    onClick={() => handleUpdatePhoto(photo.id)}
                                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingPhotoId(null)}
                                                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex justify-between items-center">
                                            <span>{photo.caption}</span>
                                            <div className="space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingPhotoId(photo.id);
                                                        setEditCaption(photo.caption || "");
                                                    }}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePhoto(photo.id)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            )}
        </div>
    );
}
