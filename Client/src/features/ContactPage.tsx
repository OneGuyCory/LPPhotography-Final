import { useState } from "react";

// ✅ Define the shape of the form data
interface ContactFormData {
    name: string;
    email: string;
    service: string;
    message: string;
}

const ContactPage: React.FC = () => {
    // === State to manage form inputs ===
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        service: "",
        message: ""
    });

    // === Handles input changes (text, textarea, and select fields) ===
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // === Handles form submission ===
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 📤 Send contact form to backend API
        fetch("https://localhost:5001/api/ContactMessage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
            .then((res) => {
                if (res.ok) {
                    alert("Message sent!");
                } else {
                    alert("Failed to send message.");
                }
            })
            .catch(() => {
                alert("Network error: could not send message.");
            });

        // ✅ Clear the form after submission
        setFormData({ name: "", email: "", service: "", message: "" });
    };

    return (
        <div className=" bg-[#ebe3d2] max-w-3xl mx-auto p-6 font-sans text-gray-900">
            <h2 className="text-3xl font-bold mb-6 text-center">Contact Me</h2>

            {/* === Contact Form === */}
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md">

                {/* Name Field */}
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

                {/* Email Field */}
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

                {/* Service Dropdown */}
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

                {/* Message Textarea */}
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

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
                >
                    Send Message
                </button>
            </form>
        </div>
    );
};

export default ContactPage;
