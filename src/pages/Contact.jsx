import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { api } from '../api/client';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = await api.contact.send(form);
      setSuccess(data.message);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-accent">Get in Touch</p>
          <h1 className="font-playfair text-4xl font-bold text-white sm:text-5xl">Contact Us</h1>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="flex items-start gap-4">
              <FiMapPin className="mt-1 text-accent" size={24} />
              <div>
                <h3 className="font-playfair text-xl font-bold text-white">Visit Us</h3>
                <p className="text-gray-400">Nalasupara, Mumbai, Maharashtra</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FiPhone className="mt-1 text-accent" size={24} />
              <div>
                <h3 className="font-playfair text-xl font-bold text-white">Call Us</h3>
                <p className="text-gray-400">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FiMail className="mt-1 text-accent" size={24} />
              <div>
                <h3 className="font-playfair text-xl font-bold text-white">Email Us</h3>
                <p className="text-gray-400">hello@rizla.com</p>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-8"
          >
            {success && <p className="rounded-lg bg-accent/20 p-3 text-sm text-accent">{success}</p>}
            {error && <p className="rounded-lg bg-red-500/20 p-3 text-sm text-red-300">{error}</p>}

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
            />
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              rows={5}
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-gray-500 focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-accent py-3 font-montserrat text-sm font-bold uppercase tracking-[0.2em] text-background hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
