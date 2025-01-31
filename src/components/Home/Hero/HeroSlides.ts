// src/components/Hero/HeroSlides.ts

export interface IHeroSlide {
    _id?: string;
    title: string;
    tagline: string;
    description: string;
    imageUrl: string;
    ctaLabel: string;
    ctaLink: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export const heroSlides: IHeroSlide[] = [
    {
      title: "Upcoming IPO: Tech Solutions",
      tagline: "Don't miss the next big tech wave!",
      description:
        "Tech Solutions is set to disrupt the industry with their innovative AI-driven platforms. Join the wave early and reap the benefits.",
      imageUrl: "https://picsum.photos/1200/600?random=10",
      ctaLabel: "Learn More",
      ctaLink: "/ipos/tech-solutions",
    },
    {
      title: "Current IPO: Green Energy Corp",
      tagline: "Invest in a sustainable future",
      description:
        "Green Energy Corp's IPO is live! A groundbreaking venture focusing on solar and wind energy solutions. Jump in and help shape a greener tomorrow.",
      imageUrl: "https://picsum.photos/1200/600?random=20",
      ctaLabel: "Invest Now",
      ctaLink: "/ipos/green-energy",
    },
    {
      title: "Hot IPO: FinTech Revolution",
      tagline: "Reinventing the modern banking experience",
      description:
        "FinTech Revolution is redefining online banking, making transactions faster, safer, and more inclusive. Be part of the change.",
      imageUrl: "https://picsum.photos/1200/600?random=30",
      ctaLabel: "View Details",
      ctaLink: "/ipos/fintech-revolution",
    },
  ];
  