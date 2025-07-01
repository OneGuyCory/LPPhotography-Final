// AdminPage.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// Define shape of a gallery
interface Gallery {
    id: string;
    title: string;
}

// Define shape of a photo (optional fields for caption/featured)
interface Photo {
    id: string;
    url: string;
    caption?: string;
    isFeatured?: boolean;
}

// Define shape of a user object
interface User {
    id: string;
    email: string;
    role: string;
}

export default function AdminPage() {
    const navigate = useNavigate();

    // 📦 Admin state variables
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [selectedGalleryId, setSelectedGalleryId] = useState("");
    const [photos, setPhotos] = useState<Photo[]>([]);

    // 📤 Upload and form inputs
    const [uploading, setUploading] = useState(false);
    const [uploadUrl, setUploadUrl] = useState("");
    const [caption, setCaption] = useState("");

    // 🖊️ Photo editing state
    const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
    const [editCaption, setEditCaption] = useState("");
    const [editIsFeatured, setEditIsFeatured] = useState(false);

    // 🆕 New gallery form
    const [newGalleryTitle, setNewGalleryTitle] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [clientEmail, setClientEmail] = useState("");
    const [accessCode, setAccessCode] = useState("");

    // 👤 User management
    const [users, setUsers] = useState<User[]>([]);
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");
    const [newUserRole, setNewUserRole] = useState("Client");

    // 🔐 Redirect non-admins
    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role !== "Admin") {
            navigate("/login");
        }
    }, [navigate]);

    // 📥 Fetch galleries and users on load
    useEffect(() => {
        fetch("https://localhost:5001/api/galleries/all", { credentials: "include" })
            .then((res) => res.json())
            .then(setGalleries)
            .catch(console.error);

        fetch("https://localhost:5001/api/users/all", { credentials: "include" })
            .then((res) => res.json())
            .then(setUsers)
            .catch(console.error);
    }, []);

    // 📷 Fetch photos for selected gallery
    useEffect(() => {
        if (selectedGalleryId) {
            fetch(`https://localhost:5001/api/galleries/${selectedGalleryId}/photos`)
                .then((res) => res.json())
                .then(setPhotos);
        } else {
            setPhotos([]);
        }
    }, [selectedGalleryId]);

    // 🌩️ Upload image to Cloudinary
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "unassigned");

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dxqrgfgqo/image/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            setUploadUrl(data.secure_url);
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setUploading(false);
        }
    };

    // 💾 Save uploaded image as photo in backend
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
            .then((saved) => {
                setPhotos((prev) => [...prev, saved]);
                setUploadUrl("");
                setCaption("");
            });
    };

    // ✏️ Update existing photo (caption + isFeatured)
    const handleUpdatePhoto = (photoId: string) => {
        const existing = photos.find((p) => p.id === photoId);
        if (!existing) return;

        const updatedPhoto = {
            id: photoId,
            caption: editCaption,
            url: existing.url,
            galleryId: selectedGalleryId,
            isFeatured: editIsFeatured,
        };

        fetch(`https://localhost:5001/api/photos/${photoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(updatedPhoto),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Update failed");
                setPhotos((prev) =>
                    prev.map((p) =>
                        p.id === photoId ? { ...p, caption: editCaption, isFeatured: editIsFeatured } : p
                    )
                );
                setEditingPhotoId(null);
            })
            .catch(() => alert("Failed to update photo"));
    };

    // ❌ Delete a photo
    const handleDeletePhoto = (photoId: string) => {
        fetch(`https://localhost:5001/api/photos/${photoId}`, {
            method: "DELETE",
            credentials: "include",
        }).then(() => setPhotos((prev) => prev.filter((p) => p.id !== photoId)));
    };

    // ❌ Delete a gallery
    const handleDeleteGallery = (galleryId: string) => {
        if (!window.confirm("Delete this gallery and all its photos?")) return;

        fetch(`https://localhost:5001/api/galleries/${galleryId}`, {
            method: "DELETE",
            credentials: "include",
        }).then(() => {
            setGalleries((prev) => prev.filter((g) => g.id !== galleryId));
            if (galleryId === selectedGalleryId) {
                setSelectedGalleryId("");
                setPhotos([]);
            }
        });
    };

    // ➕ Create new gallery (public or private)
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

    // ⭐ Set a cover image for a gallery
    const handleSetCover = (photoUrl: string) => {
        fetch(`https://localhost:5001/api/galleries/${selectedGalleryId}/cover`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(photoUrl),
        }).then((res) => {
            if (!res.ok) return alert("Failed to set cover");
            alert("Cover updated");
        });
    };

    // ➕ Register a new admin or client user
    const handleCreateUser = () => {
        const endpoint = newUserRole === "Client" ? "register-client" : "register";
        const payload =
            newUserRole === "Client"
                ? { email: newUserEmail, password: newUserPassword, accessCode }
                : { email: newUserEmail, password: newUserPassword, role: "Admin" };

        fetch(`https://localhost:5001/api/users/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("User creation failed");
                return fetch("https://localhost:5001/api/users/all", { credentials: "include" });
            })
            .then((res) => res.json())
            .then((updatedUsers) => {
                setUsers(updatedUsers);
                setNewUserEmail("");
                setNewUserPassword("");
                setAccessCode("");
            })
            .catch(() => alert("Failed to create user"));
    };

    // ❌ Delete a user by ID
    const handleDeleteUser = (userId: string) => {
        if (!window.confirm("Delete this user?")) return;
        fetch(`https://localhost:5001/api/users/${userId}`, {
            method: "DELETE",
            credentials: "include",
        })
            .then(() => setUsers((prev) => prev.filter((u) => u.id !== userId)))
            .catch(() => alert("User deletion failed"));
    };

return (
        <div className=" p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

            {/* Create Users */}
            <div className="mb-6 border-b pb-4">
                <h2 className="text-xl font-semibold mb-2">Create User</h2>
                <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="Email"
                    className="p-2 border rounded mr-2"
                />
                <div className="mb-2">
                    <input
                        type="password"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        placeholder="Password"
                        className="p-2 border rounded mr-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 6 characters and include:
                        uppercase, lowercase, number, and symbol.
                    </p>
                </div>

                <select
                    value={newUserRole}
                    onChange={(e) => {
                        setNewUserRole(e.target.value);
                        setNewUserEmail("");
                        setNewUserPassword("");
                        setAccessCode("");
                    }}
                    className="p-2 border rounded mr-2"
                >
                    <option value="Client">Client</option>
                    <option value="Admin">Admin</option>
                </select>
                {newUserRole === "Client" && (
                    <input
                        type="text"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        placeholder="Access Code"
                        className="p-2 border rounded mr-2"
                    />
                )}
                <button
                    onClick={handleCreateUser}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create User
                </button>
            </div>

            {/* User List */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold mb-2">All Users</h2>
                {users.length === 0 ? (
                    <p className="text-gray-500">No users yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {users.map((user) => (
                            <li key={user.id} className="flex justify-between items-center border p-2 rounded">
                                <span>{user.email} ({user.role})</span>
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

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
                    <label htmlFor="privateGalleryCheckbox">Private Gallery</label>
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

            {/* Manage Galleries */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Manage Galleries</h2>
                {galleries.length === 0 ? (
                    <p className="text-gray-500">No galleries found. Create one above to get started.</p>
                ) : (
                    <div className="space-y-2">
                        {galleries.map((gallery) => (
                            <div
                                key={gallery.id}
                                className={`flex justify-between items-center p-3 border rounded ${gallery.id === selectedGalleryId ? "bg-blue-100" : ""}`}
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

            {/* Photo Upload */}
            {selectedGalleryId && (
                <div className="mb-10 mt-6 border-t pt-6">
                    <h3 className="text-xl font-semibold mb-4">Upload a Photo to This Gallery</h3>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
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

            {/* Gallery Photos */}
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
                                                className="p-1 border rounded w-full mb-2"
                                            />
                                            <label className="flex items-center space-x-2 mb-2">
                                                <input
                                                    type="checkbox"
                                                    checked={editIsFeatured}
                                                    onChange={() => setEditIsFeatured(!editIsFeatured)}
                                                />
                                                <span>Mark as Featured</span>
                                            </label>
                                            <div className="space-x-2">
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
                                                <button
                                                    onClick={() => handleSetCover(photo.url)}
                                                    className="text-indigo-600 hover:underline text-sm"
                                                >
                                                    Set as Cover
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
                                                        setEditIsFeatured(photo.isFeatured || false);
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