"use client";

import { Button } from "@/components/ui/Button";
import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { IHeroSlide } from "@/components/Home/Hero/HeroSlides";
import HeroSlideModal from "@/components/admin/HeroSlideModal";
import { toast } from "react-hot-toast";

// Extended type for slide with MongoDB ID
type HeroSlideWithId = IHeroSlide & { _id: string };

export default function HeroManagement() {
  // State management with proper typing
  const [slides, setSlides] = useState<HeroSlideWithId[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlideWithId | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized fetch function to prevent unnecessary recreations
  const fetchSlides = useCallback(async () => {
    try {
      const response = await fetch("/api/hero-slides");
      if (!response.ok) throw new Error("Failed to fetch slides");
      const data = await response.json();
      setSlides(data);
    } catch (error) {
      toast.error("Failed to fetch slides");
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  // Handler for creating new slides
  const handleCreateSlide = async (slideData: IHeroSlide) => {
    try {
      const response = await fetch("/api/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slideData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create slide");
      }

      await fetchSlides();
      toast.success("Slide created successfully");
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create slide");
    }
  };

  // Handler for updating existing slides
  const handleUpdateSlide = async (slideData: IHeroSlide) => {
    if (!editingSlide?._id) {
      toast.error("No slide selected for update");
      return;
    }

    try {
      const response = await fetch(`/api/hero-slides/${editingSlide._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...slideData, _id: undefined }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update slide");

      // Optimistic update
      setSlides(prevSlides =>
        prevSlides.map(slide =>
          slide._id === editingSlide._id
            ? { ...data, _id: editingSlide._id }
            : slide
        )
      );

      toast.success("Slide updated successfully");
      setIsModalOpen(false);
      setEditingSlide(null);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update slide");
    }
  };

  // Handler for deleting slides with confirmation
  const handleDeleteSlide = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;

    try {
      const response = await fetch(`/api/hero-slides/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete slide");

      // Optimistic update
      setSlides(prevSlides => prevSlides.filter(slide => slide._id !== id));
      toast.success("Slide deleted successfully");
    } catch (error) {
      toast.error("Failed to delete slide");
      // Refetch slides in case of error to ensure UI consistency
      fetchSlides();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Hero Section Management</h1>
        <Button
          variant="primary"
          className="flex items-center gap-2"
          onClick={() => {
            setEditingSlide(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Add New Slide
        </Button>
      </div>

      {/* Slides Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {slides.map((slide) => (
          <div
            key={slide._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden 
                       transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="relative h-48">
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{slide.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {slide.tagline}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {slide.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-primary">{slide.ctaLabel}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingSlide(slide);
                      setIsModalOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteSlide(slide._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Component */}
      <HeroSlideModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSlide(null);
        }}
        onSubmit={editingSlide ? handleUpdateSlide : handleCreateSlide}
        initialData={editingSlide || undefined}
      />
    </div>
  );
} 