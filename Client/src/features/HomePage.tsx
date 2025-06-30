import { useEffect, useState } from 'react'

        interface Photo {
        id: string;
        url: string;
        caption?: string;
        isFeatured?: boolean;
    }

    export default function HomePage() {
        const [featuredPhotos, setFeaturedPhotos] = useState<Photo[]>([]);

        useEffect(() => {
            fetch("https://localhost:5001/api/photos/featured")
                .then((res) => res.json())
                .then(setFeaturedPhotos)
                .catch((err) => console.error("Failed to load featured photos", err));
        }, []);


        return (
        <div className="dark">
            <div className="font-sans  text-gray-900 ">
                {/* Hero */}
                <section
                    className="bg-cover bg-center h-[60vh] flex items-center justify-center text-white text-center"
                    style={{ backgroundImage: "url('/your-hero-image.jpg')" }}
                >
                    <div className="bg-black/60 p-6 rounded-xl">
                        <h2 className="text-4xl md:text-5xl font-bold mb-2">Capturing Life's Moments</h2>
                        <p className="text-lg md:text-xl mb-4">Weddings * Portraits * Events * Landscapes</p>
                        <a href="#contact" className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition">
                            Book a Session
                        </a>
                    </div>
                </section>

                {/* Featured Gallery Section */}
                <section id="galleries" className="p-8">
                    <h3 className="text-3xl font-bold text-center mb-6">Featured Work</h3>
                    {featuredPhotos.length === 0 ? (
                        <p className="text-center text-gray-500">No featured photos yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {featuredPhotos.map((photo) => (
                                <div
                                    key={photo.id}
                                    className="rounded overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-[1.02] bg-white"
                                >
                                    <img
                                        src={photo.url}
                                        alt={photo.caption || "Featured photo"}
                                        className="w-full h-60 object-cover"
                                    />
                                    {photo.caption && (
                                        <div className="p-3 text-center text-sm font-medium text-gray-800">
                                            {photo.caption}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>



                <section id="pricing" className="bg-white p-8">
                    <h3 className="text-3xl font-bold text-center mb-8">Pricing</h3>
                    <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">

                        <div className="border rounded-lg p-6 shadow hover:shadow-lg transition">
                            <h4 className="text-xl font-semibold mb-2 text-center">Portrait Session</h4>
                            <p className="text-center text-gray-700 mb-4">$150</p>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>✔ 1 hour shoot</li>
                                <li>✔ 10 edited photos</li>
                                <li>✔ Online gallery delivery</li>
                            </ul>
                        </div>

                        <div className="border rounded-lg p-6 shadow hover:shadow-lg transition">
                            <h4 className="text-xl font-semibold mb-2 text-center">Wedding Package</h4>
                            <p className="text-center text-gray-700 mb-4">$1200</p>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>✔ 8 hours coverage</li>
                                <li>✔ 150+ edited photos</li>
                                <li>✔ Full-day event documentation</li>
                            </ul>
                        </div>

                        <div className="border rounded-lg p-6 shadow hover:shadow-lg transition">
                            <h4 className="text-xl font-semibold mb-2 text-center">Event Coverage</h4>
                            <p className="text-center text-gray-700 mb-4">$300</p>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>✔ 3 hours coverage</li>
                                <li>✔ 50 edited photos</li>
                                <li>✔ Great for parties & ceremonies</li>
                            </ul>
                        </div>

                    </div>
                </section>


                {/* Contact CTA */}
                <section id="contact" className="bg-gray-100 p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">Let's Work Together</h3>
                    <p className="mb-4">Have questions or want to book a shoot? Reach out!</p>
                    <a href="/contact" className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition">
                        Contact Me
                    </a>
                </section>
            </div>
        </div>
    );
}
