// Footer.tsx

import React from "react";

// 📌 Footer component with gradient background and Facebook link
const Footer: React.FC = () => {
    return (
        <footer
            className="text-white p-4 text-center flex flex-col md:flex-row items-center justify-between"
            style={{
                background: `linear-gradient(to right, #2a4c65 0%, #fd8a93 69%, #f9b294 89%)`
            }}
        >
            {/* 📆 Dynamic copyright */}
            <p className="mb-2 md:mb-0">
                &copy; {new Date().getFullYear()} LP Photography. All rights reserved.
            </p>

            {/* 🔗 Facebook link */}
            <a
                href="https://www.facebook.com/LovelyProfanity"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:underline"
            >
                {/* 📘 Facebook SVG Icon */}
                <svg
                    className="w-5 h-5 fill-white hover:fill-blue-300 transition"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <path d="M22.675 0h-21.35C.595 0 0 .593 0 1.326v21.348C0 23.408.595 24 1.325 24h11.488v-9.294H9.691V11.01h3.122V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.796.143v3.24l-1.918.001c-1.504 0-1.796.716-1.796 1.765v2.314h3.587l-.467 3.696h-3.12V24h6.116C23.406 24 24 23.407 24 22.674V1.326C24 .593 23.406 0 22.675 0z" />
                </svg>
            </a>
        </footer>
    );
};

export default Footer;
