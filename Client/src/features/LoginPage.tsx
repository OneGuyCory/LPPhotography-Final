// src/app/features/LoginPage/LoginPage.tsx
import React, { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [isAdmin, setIsAdmin] = useState(true); // toggle between admin/client

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isAdmin) {
            // Admin login logic
            console.log("Admin login", { email, password });
            // Call your API: POST /api/auth/admin-login
        } else {
            // Client login logic
            console.log("Client login", { accessCode });
            // Call your API: POST /api/auth/client-login
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded shadow max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">{isAdmin ? "Admin Login" : "Client Access"}</h2>

                <div className="flex justify-center mb-4 space-x-4">
                    <button
                        className={`px-4 py-2 rounded ${isAdmin ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        onClick={() => setIsAdmin(true)}
                    >
                        Admin
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${!isAdmin ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        onClick={() => setIsAdmin(false)}
                    >
                        Client
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isAdmin ? (
                        <>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </>
                    ) : (
                        <input
                            type="text"
                            placeholder="Access Code"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            required
                        />
                    )}

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
