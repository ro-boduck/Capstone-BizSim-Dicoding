'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useTheme } from '@/app/theme-provider';
import Icon from '@/components/Icon';

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout, isDemo } = useAuth();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { theme, setTheme } = useTheme();
  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `tracking-wider text-[13px] font-bold uppercase transition-all duration-200 px-3 py-1 flex items-center gap-1.5 ${
      isActive
        ? 'text-primary-action font-extrabold'
        : 'text-muted-text hover:text-foreground'
    }`;
  };

  const themeIcon = theme === 'dark' ? 'dark_mode' : 'light_mode';

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-border-aura bg-background/80 backdrop-blur-md transition-all duration-300">
      <nav className="w-full max-w-5xl mx-auto px-6 py-3.5 flex items-center">
        
        {/* Left column: Brand Logo */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-0.5 group" aria-label="BizSim Home">
            <div className="flex items-center justify-center">
              <img src="/logo.svg" alt="BizSim Logo" className="w-16 h-16 transition-transform duration-300 group-hover:scale-105 dark:brightness-0 dark:invert" />
            </div>
            <span className="font-extrabold text-sm uppercase tracking-wider text-foreground">
              Biz<span className="text-primary-action font-black">Sim</span>
            </span>
            {isDemo && (
              <span className="text-[8px] font-bold bg-surface-muted text-muted-text border border-border-aura px-1 py-0.5 rounded-[4px] tracking-normal ml-1">
                Lokal
              </span>
            )}
          </Link>
        </div>

        {/* Center column: Links (hidden on mobile) */}
        <div className="hidden md:flex items-center justify-center gap-4">
          <Link href="/" className={getLinkClass('/')}>
            Home
          </Link>
          <Link href="/tentang" className={getLinkClass('/tentang')}>
            Tentang
          </Link>
          <Link href="/simulasi" className={getLinkClass('/simulasi')}>
            Predictor
          </Link>
          {user && (
            <Link href="/dashboard" className={getLinkClass('/dashboard')}>
              Dashboard
            </Link>
          )}
        </div>

        {/* Right column: CTA Actions */}
        <div className="flex-1 flex items-center justify-end gap-3">
           {/* Theme Toggle */}
           <button
             onClick={() => {
               setTheme(theme === 'dark' ? 'light' : 'dark');
             }}
             className="flex w-8 h-8 rounded-full border border-border-aura bg-secondary-surface hover:bg-surface-muted transition items-center justify-center cursor-pointer"
             title={`Theme: ${theme}`}
           >
             <Icon name={themeIcon} size={16} className="text-muted-text" />
           </button>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(prev => !prev)}
                className="w-8 h-8 rounded-full bg-secondary-surface border border-border-aura hover:border-primary-action transition-all duration-200 flex items-center justify-center text-foreground font-bold text-xs uppercase cursor-pointer"
                title="Pengaturan Akun"
              >
                {user.email ? user.email.charAt(0) : 'U'}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-background border border-border-aura rounded-md shadow-lg py-2 z-50 animate-fade-in text-left">
                  <div className="px-3.5 py-2 border-b border-border-aura">
                    <p className="text-[10px] uppercase font-bold text-muted-text tracking-wider">Email Akun</p>
                    <p className="text-xs font-semibold text-foreground truncate mt-0.5" title={user.email}>
                      {user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-muted-text hover:text-foreground hover:bg-secondary-surface transition-colors"
                    >
                      <Icon name="person" size={14} className="text-muted-text" />
                      <span>Dashboard Keuangan</span>
                    </Link>
                    <Link
                      href="/simulasi"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-muted-text hover:text-foreground hover:bg-secondary-surface transition-colors"
                    >
                      <Icon name="settings" size={14} className="text-muted-text" />
                      <span>Simulasi Instan</span>
                    </Link>
                  </div>
                  <div className="border-t border-border-aura pt-1 mt-1">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-health-critical hover:bg-red-50 transition-colors cursor-pointer text-left"
                    >
                      <Icon name="logout" size={14} />
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="text-[11px] font-bold uppercase tracking-wider text-muted-text hover:text-foreground px-2"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="bg-primary-action text-primary-foreground hover:bg-primary-action/90 rounded-[6px] py-1.5 px-3 text-[10px] font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center"
              >
                Daftar
              </Link>
            </div>
          )}
          {/* Mobile menu toggle button */}
          <button
            onClick={() => setShowMobileMenu(prev => !prev)}
            className="md:hidden flex w-8 h-8 rounded-full border border-border-aura bg-secondary-surface hover:bg-surface-muted transition items-center justify-center cursor-pointer text-muted-text hover:text-foreground"
            aria-label="Toggle Menu"
          >
            <Icon name={showMobileMenu ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </nav>
      {/* Mobile menu overlay */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-border-aura bg-background px-6 py-4 flex flex-col gap-4 animate-fade-in text-left">
          <Link
            href="/"
            onClick={() => setShowMobileMenu(false)}
            className={getLinkClass('/')}
          >
            Home
          </Link>
          <Link
            href="/tentang"
            onClick={() => setShowMobileMenu(false)}
            className={getLinkClass('/tentang')}
          >
            Tentang
          </Link>
          <Link
            href="/simulasi"
            onClick={() => setShowMobileMenu(false)}
            className={getLinkClass('/simulasi')}
          >
            Predictor
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setShowMobileMenu(false)}
                className={getLinkClass('/dashboard')}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 py-1 px-3 text-left text-xs font-bold uppercase tracking-wider text-health-critical cursor-pointer"
              >
                <Icon name="logout" size={14} />
                <span>Keluar</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-2 border-t border-border-aura">
              <Link
                href="/login"
                onClick={() => setShowMobileMenu(false)}
                className="text-[11px] font-bold uppercase tracking-wider text-muted-text hover:text-foreground px-3 py-1"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setShowMobileMenu(false)}
                className="bg-primary-action text-primary-foreground hover:bg-primary-action/90 rounded-[6px] py-1.5 px-3 text-[10px] font-bold uppercase tracking-wider transition-colors text-center inline-block"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
