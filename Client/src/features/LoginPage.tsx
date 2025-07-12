import React, { useState } from "react";

export default function LoginPage() {
    const [isAdmin, setIsAdmin] = useState(true);

    // =ADMIN LOGIN STATE 
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");

    // CLIENT LOGIN STATE
    const [clientEmail, setClientEmail] = useState("");
    const [accessCode, setAccessCode] = useState("");

    // TOGGLE VIEW AND RESET
    const handleToggle = (admin: boolean) => {
        setIsAdmin(admin);
        // Clear both forms on toggle
        setAdminEmail("");
        setAdminPassword("");
        setClientEmail("");
        setAccessCode("");
    };

    //  HANDLER: ADMIN LOGIN
    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("https://lpphotography.azurewebsites.net/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: adminEmail, password: adminPassword })
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
    };

    // HANDLER: CLIENT LOGIN
    const handleClientLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("https://lpphotography.azurewebsites.net/api/users/login-client", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: clientEmail, accessCode })
            });

            if (!res.ok) {
                const error = await res.text();
                alert("Client login failed: " + error);
                return;
            }

            const data = await res.json();
            localStorage.setItem("userRole", "Client");
            localStorage.setItem("userEmail", data.email);
            window.location.href = `/client-gallery`;
        } catch (error) {
            console.error("Client login error", error);
            alert("An error occurred during client login.");
        }
    };

    return (
        <div className="min-h-screen bg-[#ebe3d2] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded shadow max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isAdmin ? "Admin Login" : "Client Access"}
                </h2>

                {/* Toggle Buttons */}
                <div className="flex justify-center mb-6 space-x-4">
                    <button
                        onClick={() => handleToggle(true)}
                        className={`px-4 py-2 rounded ${isAdmin ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        type="button"
                    >
                        Admin
                    </button>
                    <button
                        onClick={() => handleToggle(false)}
                        className={`px-4 py-2 rounded ${!isAdmin ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                        type="button"
                    >
                        Client
                    </button>
                </div>

                {/*  ADMIN LOGIN FORM*/}
                {isAdmin && (
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        >
                            Login as Admin
                        </button>
                    </form>
                )}

                {/* CLIENT LOGIN FORM */}
                {!isAdmin && (
                    <form onSubmit={handleClientLogin} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Access Code"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        >
                            Access Gallery
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
