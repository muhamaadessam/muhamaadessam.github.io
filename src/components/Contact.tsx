'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PortfolioData, incrementCvDownloadCount, trackPortfolioEvent } from '@/lib/services';
import { Mail, Send, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

export default function Contact({ data }: { data: PortfolioData | null }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const phone = data?.phone || '+201557760110';
  const email = data?.email || 'muhammadessam159@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    if (Date.now() - Number(localStorage.getItem('last_contact_submit') || 0) < 60_000) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }
    
    setStatus('loading');
    
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || 'https://portfolio-contact-api-muhammad-essam.vercel.app/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name,
          email: formData.email,
          message: formData.message 
        })
      });

      if (!response.ok) throw new Error('Failed to send message via backend');
      
      await trackPortfolioEvent('contact_submit', 'contact_form');
      localStorage.setItem('last_contact_submit', String(Date.now()));
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (e) {
      console.error('Error in contact flow:', e);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section 
      id="contact" 
      className="py-24 relative bg-dark-bg bg-fixed bg-cover bg-center"
      style={{ backgroundImage: 'url("/backgrounds/contact_bg.webp")' }}
    >
      <div className="absolute inset-0 bg-dark-bg/90"></div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Open to Flutter Developer opportunities and freelance projects. Looking for a developer who can build scalable, production-ready mobile applications? Let&apos;s talk.
          </p>
          <div className="flex flex-wrap justify-center gap-5 mt-7">
            <a href={`mailto:${email}`} onClick={() => trackPortfolioEvent('external_link_click', 'email')} className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors">
              <Mail className="w-5 h-5" /> Email
            </a>
            <a href={`https://api.whatsapp.com/send/?phone=${phone.replace('+', '')}&text&type=phone_number&app_absent=0`} target="_blank" rel="noreferrer" onClick={() => trackPortfolioEvent('external_link_click', 'whatsapp')} className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors">
              <FaWhatsapp className="w-5 h-5" /> WhatsApp
            </a>
            <a href="https://drive.google.com/uc?export=download&id=11R3XbF-0bTpnFe4wCdOYy9Qgw4ISQKEc" target="_blank" rel="noreferrer" onClick={() => incrementCvDownloadCount()} className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors">
              <FileText className="w-5 h-5" /> Download CV
            </a>
            <a href="https://www.linkedin.com/in/muhammadessam159/" target="_blank" rel="noreferrer" onClick={() => trackPortfolioEvent('external_link_click', 'linkedin')} className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors">
              <FaLinkedin className="w-5 h-5" /> LinkedIn
            </a>
            <a href="https://github.com/muhamaadessam" target="_blank" rel="noreferrer" onClick={() => trackPortfolioEvent('external_link_click', 'github')} className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors">
              <FaGithub className="w-5 h-5" /> GitHub
            </a>
          </div>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.form 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit} 
            className="glass p-8 md:p-10 rounded-2xl flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="John Doe"
                  disabled={status === 'loading'}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="john@example.com"
                  disabled={status === 'loading'}
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                placeholder="Your message here..."
                disabled={status === 'loading'}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent text-white font-medium py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
            >
              {status === 'loading' ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : status === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Message Saved
                </>
              ) : status === 'error' ? (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Please try again shortly
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
