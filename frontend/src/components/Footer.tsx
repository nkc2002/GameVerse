import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Github, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-100 border-t border-primary-500/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-500/20 rounded-xl">
                <Gamepad2 className="w-6 h-6 text-primary-400" />
              </div>
              <span className="font-display text-xl text-gradient">GameVerse</span>
            </Link>
            <p className="text-slate-400 max-w-md">
              Your ultimate gaming universe. Discover new games, read reviews, and connect with fellow gamers.
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg text-slate-200 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/games" className="text-slate-400 hover:text-primary-400 transition-colors">
                  Games
                </Link>
              </li>
              <li>
                <Link to="/posts" className="text-slate-400 hover:text-primary-400 transition-colors">
                  Posts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg text-slate-200 mb-4">Connect</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-dark-200 rounded-lg text-slate-400 hover:text-primary-400 hover:bg-dark-300 transition-all cursor-pointer"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-dark-200 rounded-lg text-slate-400 hover:text-primary-400 hover:bg-dark-300 transition-all cursor-pointer"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-500/10 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} GameVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};


