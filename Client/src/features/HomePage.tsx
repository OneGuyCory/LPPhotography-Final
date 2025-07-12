import { useEffect, useState } from 'react';

// Define the expected structure of a photo returned from the API
interface Photo {
    id: string;
    url: string;
    caption?: string;
    isFeatured?: boolean;
}

export default function HomePage() {
    const [featuredPhotos, setFeaturedPhotos] = useState<Photo[]>([]);

    // Load featured photos on mount
    useEffect(() => {
        fetch("https://lpphotography.azurewebsites.net/api/photos/featured")
            .then((res) => res.json())
            .then(setFeaturedPhotos)
            .catch((err) => console.error("Failed to load featured photos", err));
    }, []);

    return (
        <div className="font-sans text-gray-900">

            {/*Hero Parallax Section */}
            <section
                className="relative h-[70vh] flex items-center justify-center text-white overflow-hidden"
                style={{
                    backgroundImage: `url('/WheatAssThing.jpg')`,
                    backgroundAttachment: 'fixed',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                }}
            >
                <div className="relative z-10 text-center px-6 bg-opacity-50 p-8 rounded">
                    <img
                        src="/LPLOGOEYE.png"
                        alt="LP Photography logo"
                        className="mx-auto mb-6 w-[300px] max-w-full opacity-70"
                    />
                    <h1 className="text-5xl md:text-7xl font-bold tracking-wide mb-4 font-display">
                        LP Photography
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 tracking-wider mb-8">
                        Weddings • Portraits • Stories • Streets
                    </p>
                    <a
                        href="https://lpphotography.azurewebsites.net/contact"
                        className="inline-block border border-white text-white px-6 py-2 rounded-full text-sm tracking-widest hover:bg-white hover:text-black transition"
                    >
                        Book a Session
                    </a>
                </div>
            </section>

            {/* Featured Work Section */}
            <section id="galleries" className="p-8 bg-[#ebe3d2]">
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

            {/* Parallax Divider Section */}
            <section
                className="h-[60vh] bg-fixed bg-center bg-cover"
                style={{ backgroundImage: `url('sunflowerfield.jpg')` }}
            />

            {/* Pricing Section */}
            <section id="pricing" className="bg-[#ebe3d2] p-8">
                <h3 className="text-3xl font-bold text-center mb-8">Pricing</h3>

                <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
                    {/* Portrait */}
                    <div
                        style={{
                            background: `linear-gradient(to right, #2a4c65 0%, #fd8a93 69%, #f9b294 89%)`,
                        }}
                        className="border rounded-lg p-6 shadow hover:shadow-lg transition"
                    >
                        <h4 className="text-xl font-semibold mb-2 text-center text-white">Portrait Session</h4>
                        <p className="text-center text-white mb-4">$150</p>
                        <ul className="text-sm text-white space-y-2">
                            <li>✔ 1 hour shoot</li>
                            <li>✔ 10 edited photos</li>
                            <li>✔ Online gallery delivery</li>
                        </ul>
                    </div>

                    {/* Wedding */}
                    <div
                        style={{
                            background: `linear-gradient(to right, #2a4c65 0%, #fd8a93 69%, #f9b294 89%)`,
                        }}
                        className="border rounded-lg p-6 shadow hover:shadow-lg transition"
                    >
                        <h4 className="text-xl font-semibold mb-2 text-center text-white">Wedding Package</h4>
                        <p className="text-center text-white mb-4">$1200</p>
                        <ul className="text-sm text-white space-y-2">
                            <li>✔ 8 hours coverage</li>
                            <li>✔ 150+ edited photos</li>
                            <li>✔ Full-day event documentation</li>
                        </ul>
                    </div>

                    {/* Event */}
                    <div
                        style={{
                            background: `linear-gradient(to right, #2a4c65 0%, #fd8a93 69%, #f9b294 89%)`,
                        }}
                        className="border rounded-lg p-6 shadow hover:shadow-lg transition"
                    >
                        <h4 className="text-xl font-semibold mb-2 text-center text-white">Event Coverage</h4>
                        <p className="text-center text-white mb-4">$300</p>
                        <ul className="text-sm text-white space-y-2">
                            <li>✔ 3 hours coverage</li>
                            <li>✔ 50 edited photos</li>
                            <li>✔ Great for parties & ceremonies</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Parallax Divider Section */}
            <section
                className="h-[60vh] bg-fixed bg-center bg-cover"
                style={{ backgroundImage: `url('graffiti2.jpg')` }}
            />

            {/* === Contact CTA Section === */}
            <section id="contact" className="bg-[#ebe3d2] p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Let's Work Together</h3>
                <p className="mb-4">Have questions or want to book a shoot? Reach out!</p>
                <a
                    href="https://lpphotography.azurewebsites.net/contact"
                    className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
                >
                    Contact Me
                </a>
            </section>
        </div>
    );
}
