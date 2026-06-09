'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const { register, isDemo, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !businessName) {
      setError('Harap lengkapi semua kolom.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await register(email, password);
      if (res.success) {
        router.push('/dashboard');
      } else {
        setError(res.error || 'Gagal mendaftar. Silakan coba kembali.');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-12 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md aura-card p-8 bg-background border border-border-aura">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">Daftar Akun</h1>
          <p className="text-sm text-medium-gray">
            Mulai pantau kesehatan finansial UMKM Anda
          </p>
        </div>

        {isDemo && (
          <div className="mb-6 p-4 rounded-md bg-secondary-surface border border-border-aura text-xs text-foreground leading-relaxed">
            <span className="font-bold block text-foreground mb-1">📢 Mode Demo Aktif</span>
            Supabase tidak terkonfigurasi. Akun demo akan dibuat secara instan di peramban Anda untuk mencoba tracker.
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 rounded-md border border-health-critical bg-red-50 text-xs text-health-critical">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="label-medium text-foreground">Nama Bisnis / UMKM</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="aura-input w-full"
              placeholder="Warung Maju Bersama"
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label-medium text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="aura-input w-full"
              placeholder="nama@bisnisanda.com"
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label-medium text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="aura-input w-full"
              placeholder="Minimal 6 karakter"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="aura-btn-primary w-full mt-2"
            disabled={loading}
          >
            {loading ? 'Mendaftarkan...' : 'Daftar Akun Baru'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="body-small text-muted-text">
            Sudah memiliki akun?{' '}
            <Link href="/login" className="font-medium text-foreground hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
