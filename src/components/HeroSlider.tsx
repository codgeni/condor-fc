"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

const DEFAULT_SLIDES = [
  '/slides/slide_1.jpg',
  '/slides/slide_2.jpg',
  '/slides/slide_3.jpg',
  '/slides/slide_4.jpg',
  '/slides/slide_5.jpg',
  '/slides/slide_6.jpg',
  '/slides/slide_7.jpg'
];

export default function HeroSlider() {
  const [slides, setSlides] = useState<string[]>(DEFAULT_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 1. Check local cache first for instant load
    try {
      const cached = localStorage.getItem('condor_home_slides');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSlides(parsed);
        }
      }
    } catch {}

    // 2. Fetch slides from Supabase, filtering out any unwanted random AI images
    const fetchSlides = async () => {
      try {
        const { data } = await supabase
          .from('slides')
          .select('url')
          .order('created_at', { ascending: true });
        if (data && data.length > 0) {
          const validUrls = data
            .map(s => s.url)
            .filter(url => 
              url && 
              !url.includes('universe_bg') && 
              !url.includes('soccer.png') && 
              !url.includes('trophy_moment') && 
              !url.includes('stadium_hero')
            );

          if (validUrls.length > 0) {
            setSlides(validUrls);
            try {
              localStorage.setItem('condor_home_slides', JSON.stringify(validUrls));
            } catch {}
          } else {
            setSlides(DEFAULT_SLIDES);
          }
        } else {
          setSlides(DEFAULT_SLIDES);
        }
      } catch (err) {
        setSlides(DEFAULT_SLIDES);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, slides]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  };

  if (slides.length === 0) return null;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, overflow: 'hidden' }}>
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={currentIndex}
          src={slides[currentIndex]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          alt={`Equipe slide ${currentIndex + 1}`}
        />
      </AnimatePresence>

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 10
        }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: index === currentIndex ? 'var(--clr-primary)' : 'rgba(255,255,255,0.5)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'background 0.3s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
