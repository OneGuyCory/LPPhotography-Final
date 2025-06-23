import React, { useState } from "react";

const Navbar: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <nav
            className="text-white p-4"
            style={{
                background: `linear-gradient(to right, #2a4c65 0%, #fd8a93 69%, #f9b294 89%)`,
            }}
        >
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">LP Photography</h1>
                <button className="md:hidden" onClick={() => setOpen(!open)}>
                    ☰
                </button>
                <ul className="hidden md:flex space-x-6">
                    <li><a href="/">Home</a></li>
                    <li><a href="/galleries">Galleries</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/login">Login</a></li>
                </ul>
            </div>

            {open && (
                <ul className="flex flex-col md:hidden mt-2 space-y-2">
                    <li><a href="/">Home</a></li>
                    <li><a href="/galleries">Galleries</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/login">Login</a></li>
                </ul>
            )}
        </nav>
    );
};

export default Navbar;
