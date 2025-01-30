"use client";
// If you're using Next.js App Router with client-side components

import React from "react";
import Slider from "react-slick";
// Import the CSS needed for slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { heroSlides } from "./HeroSlides";
import { cn } from "@/lib/utils";
// Import the CustomArrowProps type from react-slick
import { CustomArrowProps } from "react-slick";

// Custom Arrow Components with proper typing
function PrevArrow({ onClick }: CustomArrowProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Previous Slide"
      className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 bg-black/30 p-2 text-white hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white md:block"
    >
      Prev
    </button>
  );
}

function NextArrow({ onClick }: CustomArrowProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Next Slide"
      className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 bg-black/30 p-2 text-white hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white md:block"
    >
      Next
    </button>
  );
}

// Your Hero settings for the slider
const settings = {
  dots: false,
  infinite: true,
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
};

const Hero: React.FC = () => {
  return (
    <section className="relative w-full">
      {/* Add a gradient overlay at the top for navbar */}
      <div className="absolute inset-x-0 top-0 h-32 z-10 bg-gradient-to-b from-black/50 to-transparent" />

      <Slider {...settings} className="relative">
        {heroSlides.map((slide, idx) => (
          <div key={idx} className="relative h-[70vh] w-full">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${slide.imageUrl})` }}
            />
            {/* Enhanced overlay for better text contrast and navbar visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/30" />


            {/* Slide Content */}
            <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center text-white md:px-8">
              <h2 className="mb-2 text-3xl font-bold uppercase md:text-4xl">
                {slide.title}
              </h2>
              <p className="mb-2 text-lg font-semibold">{slide.tagline}</p>
              <p className="mx-auto mb-4 max-w-2xl text-base md:text-lg">
                {slide.description}
              </p>

              <a
                href={slide.ctaLink}
                className={cn(
                  "inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-md",
                  "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                )}
              >
                {slide.ctaLabel}
              </a>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Hero;
