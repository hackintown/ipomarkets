"use client";
// If you're using Next.js App Router with client-side components

import React, { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
// Import the CSS needed for slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IHeroSlide } from "./HeroSlides";
import { cn } from "@/lib/utils";
// Import the CustomArrowProps type from react-slick
import { CustomArrowProps } from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Custom arrow components for the slider
 * Implements accessible navigation controls
 */
function PrevArrow({ onClick }: CustomArrowProps) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="icon"
      className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
      leftIcon={<ChevronLeft className="h-6 w-6" />}
      aria-label="Previous Slide"
    />
  );
}

function NextArrow({ onClick }: CustomArrowProps) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="icon"
      className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
      leftIcon={<ChevronRight className="h-6 w-6" />}
      aria-label="Next Slide"
    />
  );
}

/**
 * Hero Component
 * Displays a responsive hero section with image slider
 */
export default function Hero() {
  const [slides, setSlides] = useState<IHeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch slides data
  const fetchSlides = useCallback(async () => {
    try {
      const response = await fetch("/api/hero-slides");
      if (!response.ok) throw new Error("Failed to fetch slides");
      const data = await response.json();
      setSlides(data);
    } catch (error) {
      console.error("Failed to fetch slides:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-[70vh] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // No slides available
  if (!slides || slides.length === 0) {
    return (
      <div className="h-[70vh] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-500">No slides available</p>
      </div>
    );
  }

  // Single slide layout
  if (slides.length === 1) {
    return <SingleSlide slide={slides[0]} />;
  }

  // Slider settings for multiple slides
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots custom-dots",
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute bottom-4">
        <ul className="flex gap-2"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <button className="h-2 w-2 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-300" />
    ),
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* Gradient overlay for navbar */}
      <div className="absolute inset-x-0 top-0 h-32 z-10 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

      <div className="relative">
        <Slider {...settings} className="hero-slider">
          {slides.map((slide, idx) => (
            <SlideContent key={idx} slide={slide} />
          ))}
        </Slider>
      </div>
    </section>
  );
}

/**
 * Single Slide Component
 * Renders a single slide when only one is available
 */
function SingleSlide({ slide }: { slide: IHeroSlide }) {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-32 z-10 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
      <SlideContent slide={slide} />
    </section>
  );
}

/**
 * Slide Content Component
 * Renders the content for each slide
 */
function SlideContent({ slide }: { slide: IHeroSlide }) {
  return (
    <div className="relative h-[70vh] w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat transition-opacity duration-500"
        style={{ backgroundImage: `url(${slide.imageUrl})` }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />

      {/* Content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center text-white md:px-8">
        <h2 className={cn(
          "mb-2 text-3xl font-bold uppercase tracking-wider md:text-5xl",
          "animate-fadeIn"
        )}>
          {slide.title}
        </h2>
        <p className={cn(
          "mb-2 text-lg font-semibold text-primary",
          "animate-fadeIn animation-delay-200"
        )}>
          {slide.tagline}
        </p>
        <p className={cn(
          "mx-auto mb-6 max-w-2xl text-base md:text-lg opacity-90",
          "animate-fadeIn animation-delay-400"
        )}>
          {slide.description}
        </p>

        <Button
          variant="primary"
          size="lg"
          className="animate-fadeIn animation-delay-600"
          onClick={() => window.location.href = slide.ctaLink}
        >
          {slide.ctaLabel}
        </Button>
      </div>
    </div>
  );
}
