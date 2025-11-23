import React, { useState } from 'react';
import { personalInfo } from '../data/Portfolio';

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! I will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl p-8 shadow-2xl animate-slideIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white hover:rotate-90 transition-all duration-300 text-2xl w-10 h-10 flex items-center justify-center"
          aria-label="Close"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-4xl font-bold mb-2 animate-glow bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
          Get In Touch
        </h2>
        <p className="text-gray-400 mb-8">Fill out the form below and I'll get back to you as soon as possible.</p>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20 text-white placeholder-gray-500 transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20 text-white placeholder-gray-500 transition-all"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows="5"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20 text-white placeholder-gray-500 transition-all resize-none"
              placeholder="Your message here..."
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300 font-semibold"
            >
              Send Message
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-gray-400 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Contact Info */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm text-center mb-4">Or reach me directly via:</p>
          <div className="flex justify-center gap-6">
            <a 
              href={`mailto:${personalInfo.email}`} 
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <span>📧</span> Email
            </a>
            <a 
              href={personalInfo.social.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <span>💼</span> LinkedIn
            </a>
            <a 
              href={personalInfo.social.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <span>🐙</span> GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;