import React, { useState } from 'react';
import { personalInfo } from '../data/Portfolio';

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    // Replace the URL below with your Formspree endpoint.
    // Example: https://formspree.io/f/xxxxx
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mrbdvgnk';

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, message: formData.message })
      });

      if (res.ok) {
        setStatus('sent');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        console.error('Formspree error response:', res);
      }
    } catch (err) {
      setStatus('error');
      console.error('Network error:', err);
    }
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

        {/* Contact Form / Status Views */}
        {status === 'sent' ? (
          <div className="text-center py-8">
            <div className="mx-auto w-24 h-24 rounded-full bg-green-600 flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">Message sent</h3>
            <p className="text-gray-400 mb-6">Thanks for getting in touch — I'll respond shortly.</p>
            <div className="flex justify-center">
              <button
                onClick={() => { setStatus('idle'); onClose(); }}
                className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        ) : status === 'error' ? (
          <div className="text-center py-8">
            <div className="mx-auto w-24 h-24 rounded-full bg-red-600 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a1 1 0 100 2 1 1 0 000-2z"/><path fillRule="evenodd" d="M.458 10C1.732 4.943 5.943 1 10 1s8.268 3.943 9.542 9c-1.274 5.057-5.485 8-9.542 8S1.732 15.057.458 10zM10 18c3.59 0 7.023-2.68 8.242-7C17.023 6.68 13.59 4 10 4S2.977 6.68 1.758 11C2.977 15.32 6.41 18 10 18z" clipRule="evenodd"/></svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">Failed to send</h3>
            <p className="text-gray-400 mb-6">There was a problem sending your message. Please try again.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setStatus('idle')}
                className="px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-800 hover:border-gray-400 transition-all duration-200"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
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
              disabled={status === 'sending'}
              className="flex-1 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300 font-semibold disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
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
        )}

        {/* Contact Info */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm text-center mb-4">Or reach me directly via:</p>
          <div className="flex justify-center gap-6">
            <a
              href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(personalInfo.email)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <span>📧</span> Email
            </a>
            {/* LinkedIn removed */}
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