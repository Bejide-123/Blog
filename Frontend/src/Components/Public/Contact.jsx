import React, { useState } from "react";
import { 
  FiSend, 
  FiCheckCircle, 
  FiMail, 
  FiUser, 
  FiMessageSquare,
  FiPhone,
  FiMapPin,
  FiClock,
  FiChevronRight,
  FiAlertCircle,
  FiLoader
} from "react-icons/fi";
import { useTheme } from "../../Context/themeContext";

const ContactSection = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({
    type: "", // "success", "error", "loading"
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value 
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus({
        type: "error",
        message: "Please fix the errors below"
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({
      type: "loading",
      message: "Sending your message..."
    });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Form submitted:", formData);
      
      setStatus({
        type: "success",
        message: "Your message has been sent successfully! We'll get back to you within 24 hours."
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setErrors({});
      
    } catch (error) {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <FiMail className="w-6 h-6" />,
      title: "Email Us",
      info: "support@scribe.com",
      link: "mailto:support@scribe.com"
    },
    {
      icon: <FiPhone className="w-6 h-6" />,
      title: "Call Us",
      info: "+1 (555) 123-4567",
      link: "tel:+15551234567"
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: "Visit Us",
      info: "123 Story Street, Creative City",
      link: "#"
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Response Time",
      info: "Within 24 hours",
    }
  ];

  return (
    <section id="contact" className={`relative py-20 overflow-hidden ${theme === 'light' ? 'bg-gradient-to-b from-white via-gray-50/50 to-white' : 'bg-gradient-to-b from-gray-900 via-gray-800/50 to-gray-900'}`}>
      {/* Background Elements */}
      <div className={`absolute top-0 left-0 w-full h-32 ${theme === 'light' ? 'bg-gradient-to-b from-blue-50/30 to-transparent' : 'bg-gradient-to-b from-blue-900/30 to-transparent'}`} />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className={`inline-block px-4 py-2 rounded-full ${theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/50 text-blue-300'} text-sm font-semibold mb-4`}>
            📬 Contact Us
          </span>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6`}>
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Connect</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
          <p className={`text-xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} max-w-2xl mx-auto leading-relaxed`}>
            Have questions, feedback, or want to collaborate? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-2xl p-8 shadow-xl border ${theme === 'light' ? 'border-gray-200/50' : 'border-gray-700/50'} h-full`}>
              <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-8`}>
                Get in Touch
              </h3>
              
              <div className="space-y-6 mb-8">
                {contactInfo.map((item, index) => (
                  <div 
                    key={index}
                    className={`flex items-start gap-4 p-4 rounded-xl ${theme === 'light' ? 'hover:bg-gray-50/50' : 'hover:bg-gray-700/50'} transition-colors duration-300`}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-1`}>
                        {item.title}
                      </h4>
                      {item.link ? (
                        <a 
                          href={item.link}
                          className={`${theme === 'light' ? 'text-gray-600 hover:text-blue-600' : 'text-gray-400 hover:text-blue-400'} transition-colors`}
                        >
                          {item.info}
                        </a>
                      ) : (
                        <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{item.info}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Follow Us */}
              <div>
                <h4 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-4`}>
                  Follow Our Journey
                </h4>
                <div className="flex gap-3">
                  {['Twitter', 'LinkedIn', 'Instagram', 'YouTube'].map((social) => (
                    <button
                      key={social}
                      className={`flex-1 py-3 rounded-lg ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} font-medium transition-colors duration-300`}
                    >
                      {social}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-2xl p-8 shadow-xl border ${theme === 'light' ? 'border-gray-200/50' : 'border-gray-700/50'}`}>
              <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}>
                Send us a message
              </h3>
              <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-8`}>
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-2`}>
                      <span className="flex items-center gap-2">
                        <FiUser className="w-4 h-4" />
                        Full Name *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.name ? 'border-red-300' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                      } ${theme === 'light' ? 'bg-white' : 'bg-gray-700 text-white'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <FiAlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-2`}>
                      <span className="flex items-center gap-2">
                        <FiMail className="w-4 h-4" />
                        Email Address *
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.email ? 'border-red-300' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                      } ${theme === 'light' ? 'bg-white' : 'bg-gray-700 text-white'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <FiAlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone Field */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-2`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.phone ? 'border-red-300' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                      } ${theme === 'light' ? 'bg-white' : 'bg-gray-700 text-white'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    />
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <FiAlertCircle className="w-4 h-4" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-2`}>
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${theme === 'light' ? 'border-gray-300' : 'border-gray-600'} ${theme === 'light' ? 'bg-white' : 'bg-gray-700 text-white'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="collaboration">Collaboration</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-2`}>
                    <span className="flex items-center gap-2">
                      <FiMessageSquare className="w-4 h-4" />
                      Your Message *
                    </span>
                  </label>
                  <textarea
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.message ? 'border-red-300' : theme === 'light' ? 'border-gray-300' : 'border-gray-600'
                    } ${theme === 'light' ? 'bg-white' : 'bg-gray-700 text-white'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none`}
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle className="w-4 h-4" />
                      {errors.message}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {formData.message.length}/500 characters
                    </span>
                    {formData.message.length > 500 && (
                      <span className="text-sm text-red-600">
                        Character limit exceeded
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit Button & Status */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full px-8 py-4 rounded-xl font-semibold text-lg 
                             bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                             hover:shadow-2xl hover:shadow-blue-500/25 active:scale-95
                             transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <FiLoader className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <FiSend className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {status.message && (
                    <div className={`mt-6 p-4 rounded-xl border ${
                      status.type === 'success' 
                        ? 'border-green-200 bg-green-50 text-green-800'
                        : status.type === 'error'
                        ? 'border-red-200 bg-red-50 text-red-800'
                        : 'border-blue-200 bg-blue-50 text-blue-800'
                    }`}>
                      <div className="flex items-center gap-3">
                        {status.type === 'success' && <FiCheckCircle className="w-5 h-5 flex-shrink-0" />}
                        {status.type === 'error' && <FiAlertCircle className="w-5 h-5 flex-shrink-0" />}
                        {status.type === 'loading' && <FiLoader className="w-5 h-5 flex-shrink-0 animate-spin" />}
                        <p className="font-medium">{status.message}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Privacy Notice */}
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-center`}>
                  By submitting this form, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ CTA */}
        <div className="mt-16 text-center">
          <div className={`inline-block ${theme === 'light' ? 'bg-gradient-to-r from-blue-50/50 to-purple-50/50' : 'bg-gradient-to-r from-blue-900/50 to-purple-900/50'} rounded-2xl p-8 border ${theme === 'light' ? 'border-blue-100/50' : 'border-blue-800/50'}`}>
            <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-3`}>
              Frequently Asked Questions
            </h3>
            <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-6 max-w-2xl mx-auto`}>
              Check out our FAQ section for quick answers to common questions.
            </p>
            <button className={`group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold ${theme === 'light' ? 'text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:shadow-md' : 'text-gray-300 bg-gray-800 border border-gray-600 hover:border-gray-500 hover:shadow-md'} transition-all duration-300`}>
              Visit FAQ
              <FiChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ContactSection);
