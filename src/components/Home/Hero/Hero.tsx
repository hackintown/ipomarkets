"use client";

import { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { IoArrowForwardOutline } from "react-icons/io5";

interface IHeroSlide {
  _id: string;
  title: string;
  tagline: string;
  description: string;
  imageUrl: string;
  ctaLabel: string;
  ctaLink: string;
  createdAt: string;
  updatedAt: string;
}

export default function HeroSection() {
  const [slides, setSlides] = useState<IHeroSlide[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mainSlider, setMainSlider] = useState<Slider | null>(null);
  const [thumbnailSlider, setThumbnailSlider] = useState<Slider | null>(null);

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

  // Main slider settings
  const mainSliderSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    beforeChange: (_: number, next: number) => setActiveSlide(next),
    // Sync with thumbnail slider
    asNavFor: thumbnailSlider || undefined,
  };

  // Updated thumbnail slider settings
  const thumbnailSliderSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    vertical: false,
    focusOnSelect: true,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 5000,
    asNavFor: mainSlider || undefined,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="relative w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] bg-background overflow-hidden">
      {/* Main Content */}
      <div className="relative h-full">
        <Slider
          ref={(slider) => setMainSlider(slider)}
          {...mainSliderSettings}
          className="h-full"
        >
          {slides.map((slide) => (
            <div
              key={slide._id}
              className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh]"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/80 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full container mx-auto px-4 lg:px-6">
                <div className="flex flex-col justify-center h-full max-w-2xl py-4">
                  {/* Category Tag */}
                  <span className="inline-block w-fit rounded-sm px-2 py-1 mb-3 bg-primary text-primary-foreground text-xs md:text-sm font-medium uppercase tracking-wider">
                    {slide.tagline}
                  </span>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h1>

                  {/* Description */}
                  <p className="text-base text-white/90 mb-4 line-clamp-3 font-poppins">
                    {slide.description}
                  </p>

                  {/* CTA Button */}
                  <Button
                    variant={"primary"}
                    size="lg"
                    className="w-fit"
                    rightIcon={<IoArrowForwardOutline />}
                  >
                    <Link
                      href={slide.ctaLink}
                      className="flex items-center gap-2"
                    >
                      {slide.ctaLabel}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        {/* Thumbnail Slider Container */}
        <div
          className="hidden sm:block absolute -bottom-4 md:-bottom-8 right-0 w-full max-w-64 md:max-w-96 lg:max-w-lg xl:max-w-2xl z-10 shadow-sm backdrop-blur-sm rounded-tl-lg px-4
        py-2 bg-gradient-to-r from-black/20 via-black/10 to-transparent"
        >
          <Slider
            ref={(slider) => setThumbnailSlider(slider)}
            {...thumbnailSliderSettings}
            className="absolute -top-10"
          >
            {slides.map((slide, idx) => (
              <div key={`thumb-${slide._id}`} className="px-2">
                <div
                  className={cn(
                    "relative overflow-hidden cursor-pointer group",
                    "transition-all duration-500 ease-in-out",
                    activeSlide === idx ? "scale-105" : "scale-100"
                  )}
                >
                  {/* Thumbnail Image */}
                  <div className="relative aspect-[4/3] rounded-md overflow-hidden">
                    <Image
                      src={slide.imageUrl}
                      alt={slide.title}
                      fill
                      className={cn(
                        "object-cover transform transition-transform duration-500",
                        "group-hover:scale-105"
                      )}
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  </div>

                  {/* Thumbnail Content */}
                  <div className="p-2 md:p-4 text-white">
                    <span className="inline-block px-2 py-1 mb-2 text-xs font-medium uppercase tracking-wider bg-background text-foreground rounded-sm">
                      {slide.tagline}
                    </span>
                    <h3 className="text-xs md:text-sm lg:text-base font-semibold mb-1 line-clamp-2">
                      {slide.title}
                    </h3>
                    <p className="text-xs lg:text-sm text-white/70 font-poppins">
                      {new Date(slide.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Progress Indicator */}
                  <div
                    className={cn(
                      "absolute top-0 left-0 w-full h-1 bg-primary transform -translate-x-full transition-transform duration-[5000ms] ease-linear",
                      activeSlide === idx && "translate-x-0"
                    )}
                  />
                </div>
              </div>
            ))}
          </Slider>

          {/* Navigation Arrows */}
          {/* <div className="absolute right-4 md:right-16 top-16 -translate-y-1/2 flex gap-2 md:flex-col md:gap-1">
            <button
              onClick={() => thumbnailSlider?.slickPrev()}
              className="p-1 bg-background hover:bg-background/90 rounded-sm transition-colors"
            >
              <span className="sr-only">Previous</span>
              <IoArrowBackOutline className="w-4 h-4 md:w-6 md:h-6 text-primary" />
            </button>
            <button
              onClick={() => thumbnailSlider?.slickNext()}
              className="p-1 bg-background hover:bg-background/90 rounded-sm transition-colors"
            >
              <span className="sr-only">Next</span>
              <IoArrowForwardOutline className="w-4 h-4 md:w-6 md:h-6 text-primary" />
            </button>
          </div> */}
        </div>
      </div>
    </section>
  );
}
