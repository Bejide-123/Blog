import React, { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(""); // "success" or "error"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      return;
    }

    setStatus("success");
    console.log("Form submitted:", formData);

    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="py-20  bg-gradient-to-b from-white to-slate-50" id="contact">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Get in Touch
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Have questions or want to collaborate? Send us a message!
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-lg flex flex-col gap-6"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            Send Message
          </button>

          {status === "success" && (
            <p className="text-green-600 font-medium text-center">
              Message sent successfully!
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600 font-medium text-center">
              Please fill all fields correctly.
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
