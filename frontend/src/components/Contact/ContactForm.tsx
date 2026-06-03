"use client";

import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');

    try {
      await fetch('https://formspree.io/f/placeholder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
      });
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-wider text-primary/40 ml-4">
            Full Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full bg-white border border-primary/5 rounded px-6 py-4 outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-wider text-primary/40 ml-4">
            Email Address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full bg-white border border-primary/5 rounded px-6 py-4 outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-wider text-primary/40 ml-4">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          value={form.message}
          onChange={handleChange}
          placeholder="Describe your inquiry..."
          className="w-full bg-white border border-primary/5 rounded px-6 py-4 outline-none focus:border-accent transition-colors resize-none"
        />
      </div>

      {status === 'sent' && (
        <p className="text-sm font-semibold text-accent">
          ✓ Message sent! We'll get back to you within 24 hours.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm font-semibold text-red-500">
          Something went wrong. Please email us directly at support@moniqo.com
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending' || status === 'sent'}
        className="btn btn-primary w-full py-4 text-sm shadow-xl rounded font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent ✓' : 'Submit Message'}
        {status !== 'sending' && status !== 'sent' && (
          <span className="material-symbols-outlined ml-2 text-lg">send</span>
        )}
      </button>
    </form>
  );
}
