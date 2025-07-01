// src/app/features/LoginPage/LoginPage.tsx
import React, { useState } from "react";

export default function LoginPage() {
    // === STATE HOOKS ===
    const [email, setEmail] = useState("");             // shared for both admin and client
    const [password, setPassword] = useState("");       // for admin login
    const [accessCode, setAccessCode] = useState("");   // for client login
    const [isAdmin, setIsAdmin] = useState(true);       // toggle between admin/client views

    // === HANDLER: FORM SUBMIT ===
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isAdmin) {
            // 🔐 ADMIN LOGIN FLOW
            try {
                const res = await fetch("https://localhost:5001/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include", // send cookies
                    body: JSON.stringify({ email, password })
                });

                if (!res.ok) {
                    const error = await res.text();
                    alert("Admin login failed: " + error);
                    return;
                }

                const data = await res.json();
                localStorage.setItem("userRole", data.role);
                localStorage.setItem("userEmail", data.email);
                window.location.href = "/admin"; // redirect to admin dashboard
            } catch (error) {
                console.error("Admin login error", error);
                alert("An error occurred during admin login.");
            }
        } else {
            // 👤 CLIENT LOGIN FLOW
            try {
                const res = await fetch("https://localhost:5001/api/users/login-client", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ email, accessCode })
                });

                if (!res.ok) {
                    const error = await res.text();
                    alert("Client login failed: " + error);
                    return;
                }

                const data = await res.json();
                localStorage.setItem("userRole", "Client");
                localStorage.setItem("userEmail", data.email);
                window.location.href = `/client-gallery`; // redirect to private gallery
            } catch (error) {
                console.error("Client login error", error);
                alert("An error occurred during client login.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#ebe3d2] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded shadow max-w-md w-full">
                {/* === Heading === */}
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isAdmin ? "Admin Login" : "Client Access"}
                </h2>

                {/* === Toggle Buttons (Admin / Client) === */}
                <div className="flex justify-center mb-4 space-x-4">
                    <button
                        className={`px-4 py-2 rounded ${isAdmin ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        onClick={() => setIsAdmin(true)}
                        type="button"
                    >
                        Admin
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${!isAdmin ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        onClick={() => setIsAdmin(false)}
                        type="button"
                    >
                        Client
                    </button>
                </div>

                {/* === Login Form === */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email (used by both roles) */}
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {/* Conditional Field: Admin Password or Client Access Code */}
                    {isAdmin ? (
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    ) : (
                        <input
                            type="password"
                            placeholder="Access Code"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            required
                        />
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        {isAdmin ? "Login as Admin" : "Access Gallery"}
                    </button>
                </form>
            </div>
        </div>
    );
}
