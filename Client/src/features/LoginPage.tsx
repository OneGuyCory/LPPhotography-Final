// src/app/features/LoginPage/LoginPage.tsx
import React, { useState } from "react";

export default function LoginPage() {
    // State to track login form inputs
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [isAdmin, setIsAdmin] = useState(true); // toggle between admin/client

    // Handles form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isAdmin) {
            // 🔐 Admin Login
            try {
                const res = await fetch("https://localhost:5001/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include", // allow cookies
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
                window.location.href = "/admin";
            } catch (error) {
                console.error("Admin login error", error);
                alert("An error occurred during admin login.");
            }
        } else {
            // 👤 Client Login (Email + Access Code)
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
                window.location.href = `/client-gallery`;// redirect after login
            } catch (error) {
                console.error("Client login error", error);
                alert("An error occurred during client login.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded shadow max-w-md w-full">
                {/* Heading */}
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isAdmin ? "Admin Login" : "Client Access"}
                </h2>

                {/* Toggle Buttons */}
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Shared email field */}
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    

                    {isAdmin ? (
                        // Admin: Email + Password
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    ) : (
                        // Client: Email + Access Code
                        <input
                            type="password"
                            placeholder="Access Code"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            required
                        />
                    )}

                    {/* Submit button */}
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
