import React from "react";

const HomePage: React.FC = () => {
    const sampleImages: string[] = [
        "sample1",
        "sample2",
        "sample3",
        "sample4",
        "sample5",
        "sample6"
    ];

    return (
        <div className="font-sans text-gray-900">

            {/* Hero */}
            <section
                className="bg-cover bg-center h-[60vh] flex items-center justify-center text-white text-center"
                style={{ backgroundImage: "url('/your-hero-image.jpg')" }}
            >
                <div className="bg-black/60 p-6 rounded-xl">
                    <h2 className="text-4xl md:text-5xl font-bold mb-2">Capturing Life's Moments</h2>
                    <p className="text-lg md:text-xl mb-4">
                        Weddings * Portraits * Events * Landscapes
                    </p>
                    <a
                        href="#contact"
                        className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition"
                    >
                        Book a Session
                    </a>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="galleries" className="p-8">
                <h3 className="text-3xl font-bold text-center mb-6">Featured Work</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {sampleImages.map((img, i) => (
                        <div key={i} className="rounded overflow-hidden shadow-lg">
                            <img
                                src={`https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/${img}.jpg`}
                                alt={`Sample ${i + 1}`}
                                className="w-full h-48 object-cover"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="bg-gray-100 p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Let's Work Together</h3>
                <p className="mb-4">Have questions or want to book a shoot? Reach out!</p>
                <a
                    href="/contact"
                    className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
                >
                    Contact Me
                </a>
            </section>
        </div>
    );
};

export default HomePage;
