import React, { useEffect, useState } from "react";
import { Link } from "react-router"; // make sure you're using react-router-dom!

const Navbar: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        setUserRole(localStorage.getItem("userRole"));
    }, []);

    const logout = async () => {
        await fetch("https://localhost:5001/api/users/logout", {
            method: "POST",
            credentials: "include",
        });

        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        window.location.href = "/";
    };

    return (
        <nav
            className="sticky top-0 text-white p-4"
            style={{
                background: `linear-gradient(to right, #2a4c65 0%, #fd8a93 69%, #f9b294 89%)`,
            }}
        >
            <div className="flex items-center justify-between">
                <Link to="/" className="text-xl font-bold">
                    LP Photography
                </Link>
                <button className="md:hidden" onClick={() => setOpen(!open)}>
                    ☰
                </button>
                <ul className="hidden md:flex space-x-6">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/galleries">Galleries</Link></li>
                    <li><Link to="/contact">Contact</Link></li>

                    {userRole === "Admin" && <li><Link to="/admin">Admin</Link></li>}
                    {userRole === "Client" && <li><Link to="/client-gallery">My Gallery</Link></li>}

                    {userRole ? (
                        <li>
                            <button onClick={logout} className="hover:underline">
                                Logout
                            </button>
                        </li>
                    ) : (
                        <li><Link to="/login">Login</Link></li>
                    )}
                </ul>
            </div>

            {open && (
                <ul className="flex flex-col md:hidden mt-2 space-y-2">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/galleries">Galleries</Link></li>
                    <li><Link to="/contact">Contact</Link></li>

                    {userRole === "Admin" && <li><Link to="/admin">Admin</Link></li>}
                    {userRole === "Client" && <li><Link to="/client-gallery">My Gallery</Link></li>}

                    {userRole ? (
                        <li>
                            <button onClick={logout} className="hover:underline text-left">
                                Logout
                            </button>
                        </li>
                    ) : (
                        <li><Link to="/login">Login</Link></li>
                    )}
                </ul>
            )}
        </nav>
    );
};

export default Navbar;
