import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Users, Globe, Award } from 'lucide-react';

interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  backgroundImage: string;
}
const slides: CarouselSlide[] = [
  {
    id: '1',
    title: 'Qatar Charity Bangladesh',
    subtitle: 'Empowering Communities',
    description: 'Supporting orphans and vulnerable families across Bangladesh through comprehensive charity programs.',
    icon: Heart,
    backgroundImage: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
  },
  {
    id: '2',
    title: 'Community Support',
    subtitle: 'Building Stronger Futures',
    description: 'Connecting beneficiaries with life-changing programs through our network of dedicated agents and authenticators.',
    icon: Users,
    backgroundImage: 'https://images.pexels.com/photos/6646971/pexels-photo-6646971.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
  },
  {
    id: '3',
    title: 'Global Impact',
    subtitle: 'Worldwide Mission',
    description: 'Part of Qatar Charity\'s international humanitarian efforts, bringing hope and support to communities in need.',
    icon: Globe,
    backgroundImage: 'https://images.pexels.com/photos/6647003/pexels-photo-6647003.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
  },
  {
    id: '4',
    title: 'Transparent Process',
    subtitle: 'Trust & Accountability',
    description: 'Our secure and transparent application system ensures every beneficiary receives the support they deserve.',
    icon: Award,
    backgroundImage: 'https://images.pexels.com/photos/6646942/pexels-photo-6646942.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
  }
];

export const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <div className="relative w-full h-[27rem] overflow-hidden z-10">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => {
          const SlideIcon = slide.icon;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-800 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.backgroundImage})` }}
              >
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
              </div>
              
              {/* Content */}
              <div className="relative h-full flex items-center justify-center text-center text-white px-4 z-10">
                <div className="max-w-4xl mx-auto">
                  {/* Animated Icon */}
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full animate-pulse">
                      <SlideIcon className="h-10 w-10 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                      {slide.title}
                    </h1>
                    <h2 className="text-xl md:text-2xl font-medium text-white/90 tracking-wide">
                      {slide.subtitle}
                    </h2>
                    <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125 shadow-lg'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};