'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { ANIMATION_SPEED } from '@/lib/constants';

interface HeroCarouselProps {
  heroImages: string[];
}

export function HeroCarousel({ heroImages }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typingText, setTypingText] = useState('');
  const fullText = 'STEAMIFY';

  // Typing animation
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypingText(fullText.substring(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, ANIMATION_SPEED.TYPING);
    return () => clearInterval(timer);
  }, []);

  // Carousel auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, ANIMATION_SPEED.CAROUSEL);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      aria-label="Bosh sahifa"
    >
      {/* Background Carousel */}
      <div className="absolute inset-0" role="img" aria-label="Arxa fon carousel">
        {heroImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            aria-hidden={idx !== currentSlide}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#070b14]/90 via-[#070b14]/80 to-[#070b14]/95" />
          </div>
        ))}
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" aria-hidden="true" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" aria-hidden="true" />

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
            O&apos;zbekiston STEAM Platformasi
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
            {typingText}
            <span className="animate-pulse" aria-hidden="true">|</span>
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto font-light">
          STEAM Ta&apos;lim va Musobaqa Platformasi
        </p>

        <p className="text-sm text-slate-400 mb-8 max-w-2xl mx-auto">
          Science, Technology, Engineering, Arts, Mathematics sohalarida bilim va
          ko&apos;nikmalaringizni oshiring, tadbirlarda qatnashing va reyting tizimida
          o&apos;z o&apos;rningizni egallang
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/onboarding"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/30"
          >
            Boshlab Ko&apos;rish
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl text-sm uppercase tracking-wider transition-all"
          >
            Tizimga Kirish
          </Link>
        </div>

        {/* Slide Indicators */}
        <div className="flex gap-2 justify-center" role="tablist" aria-label="Carousel navigatsiyasi">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={idx === currentSlide}
              aria-label={`Slide ${idx + 1} ga o'tish`}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? 'bg-cyan-400 w-8' : 'bg-white/30 w-2'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <ChevronDown className="w-6 h-6 text-cyan-400" />
      </div>
    </section>
  );
}
