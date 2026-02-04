import React from 'react';
import { Link } from 'react-router-dom';
import { FaBagShopping, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhoneFlip, FaLocationDot } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col items-center gap-16 mb-16">
          {/* Brand Column */}
          <div className="space-y-6 flex flex-col items-center max-w-lg">
            <Link to="/shop" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-900/50 group-hover:scale-110 transition-transform duration-500">
                <FaBagShopping className="text-white text-2xl" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white uppercase">
                Luxe<span className="text-indigo-400">Smart</span>
              </span>
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed">
              Empowering enterprises with next-generation inventory management and high-performance commerce solutions globally since 2026.
            </p>
            <div className="flex gap-4">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:border-indigo-900/30 hover:bg-slate-800/50 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
            {/* Contact Info */}
            <div className="flex flex-col items-center">
              <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8">Get In Touch</h4>
              <ul className="space-y-6">
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-800/50 rounded-xl flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <FaLocationDot />
                  </div>
                  <div className="text-left">
                    <p className="text-slate-200 font-bold text-sm">Headquarters</p>
                    <p className="text-slate-500 text-sm">123 Tech Avenue, Silicon Valley</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-800/50 rounded-xl flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <FaEnvelope />
                  </div>
                  <div className="text-left">
                    <p className="text-slate-200 font-bold text-sm">Support Email</p>
                    <p className="text-slate-500 text-sm">support@luxesmart.com</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="flex flex-col items-center">
              <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8">Newsletter</h4>
              <p className="text-slate-400 text-sm font-medium mb-6">Get the latest updates on new features and product listings.</p>
              <div className="relative group w-full max-w-md">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-950 focus:border-indigo-500 transition-all"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
            &copy; 2026 LUXESMART ECOSYSTEM. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-xs font-black text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
