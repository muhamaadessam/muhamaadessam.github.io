'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { sendTelegramMessage } from '@/lib/services';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Send, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setStatus('loading');
    
    const formattedMessage = `
🌟 New Contact Form Submission!
👤 Name: ${formData.name}
📧 Email: ${formData.email}
📝 Message: 
${formData.message}
    `;

    const success = await sendTelegramMessage(formattedMessage);
    
    // Save to Firestore
    try {
      await addDoc(collection(db, 'messages'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: serverTimestamp(),
        read: false
      });
    } catch (e) {
      console.error('Error saving message to database', e);
    }
    
    if (success) {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section 
      id="contact" 
      className="py-24 relative bg-dark-bg bg-fixed bg-cover bg-center"
      style={{ backgroundImage: 'url("/backgrounds/contact_bg.png")' }}
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
            I&apos;m open to new opportunities. Looking for a Flutter Developer who can build scalable, production-ready mobile applications? Let&apos;s talk.
          </p>
          <div className="flex flex-wrap justify-center gap-5 mt-7">
            <a href="https://drive.google.com/uc?export=download&id=11R3XbF-0bTpnFe4wCdOYy9Qgw4ISQKEc" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors">
              <FileText className="w-5 h-5" /> Download CV
            </a>
            <a href="https://www.linkedin.com/in/muhammadessam159/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors">
              <FaLinkedin className="w-5 h-5" /> LinkedIn
            </a>
            <a href="https://github.com/muhamaadessam" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors">
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
                  Sent Successfully
                </>
              ) : status === 'error' ? (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Failed to Send
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
