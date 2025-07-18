import { useState } from "react";

// Define the shape of the form data
interface ContactFormData {
    name: string;
    email: string;
    service: string;
    message: string;
}

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        service: "",
        message: ""
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        fetch("https://lpphotography.azurewebsites.net/api/ContactMessage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
            .then((res) => {
                if (res.ok) {
                    setSuccessMessage("Your message was sent successfully!");
                    setErrorMessage(null);
                    setFormData({ name: "", email: "", service: "", message: "" });
                } else {
                    setErrorMessage("Something went wrong. Please try again.");
                    setSuccessMessage(null);
                }
            })
            .catch(() => {
                setErrorMessage("Network error. Please try again later.");
                setSuccessMessage(null);
            });

        // Hide messages after 3 seconds
        setTimeout(() => {
            setSuccessMessage(null);
            setErrorMessage(null);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#ebe3d2] flex items-center justify-center p-6 font-sans text-gray-900">
            <div className="w-full max-w-3xl bg-white p-6 rounded shadow-md relative">
                <h2 className="text-3xl font-bold mb-6 text-center">Contact Me</h2>

                {/* Success Message */}
                {successMessage && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded shadow transition-opacity duration-300">
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded shadow transition-opacity duration-300">
                        {errorMessage}
                    </div>
                )}

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block mb-1 font-medium">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="service" className="block mb-1 font-medium">Service</label>
                        <select
                            id="service"
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select a service</option>
                            <option value="Weddings">Weddings</option>
                            <option value="Portraits">Portraits</option>
                            <option value="Engagement">Engagement</option>
                            <option value="Events">Events</option>
                            <option value="Landscapes">Landscapes</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="message" className="block mb-1 font-medium">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows={5}
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
