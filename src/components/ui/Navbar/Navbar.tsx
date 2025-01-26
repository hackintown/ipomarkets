"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import DesktopMenu from "./DesktopMenu";
import MobMenu from "./MobMenu";
import { NAVIGATION_MENUS } from "./constants";
import Image from "next/image";
import { throttle } from "lodash";
import { cn } from "@/lib/utils";
import DarkModeToggle from "../DarkModeToggle";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const throttledHandleScroll = throttle(handleScroll, 100);
    window.addEventListener("scroll", throttledHandleScroll);

    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, []);

  return (
    <motion.header
      className={cn(
        "nav-container",
        isScrolled && "nav-scrolled",
        "bg-background border-b border-border"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex h-16 items-center justify-between max-w-full">
          <Logo />

          <DesktopNavigation />

          <MobMenu Menus={NAVIGATION_MENUS} />
          <DarkModeToggle />
        </div>
      </div>
    </motion.header>
  );
}

const Logo = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="relative flex-shrink-0 cursor-pointer lg:max-w-[110px] xl:max-w-[150px]"
  >
    <Link href="/" className="block">
      <Image
        src="/images/logo.png"
        alt="IPO Market Logo"
        width={150}
        height={60}
        className="w-auto h-8 sm:h-10 cursor-pointer object-contain"
        priority
        sizes="(max-width: 640px) 100px, (max-width: 1024px) 110px, 150px"
        quality={90}
      />
    </Link>
  </motion.div>
);

const DesktopNavigation = () => (
  <nav className="hidden lg:flex items-center gap-2">
    <ul className="flex items-center gap-2 text-base">
      {NAVIGATION_MENUS.map((menu) => (
        <DesktopMenu key={menu.name} menu={menu} />
      ))}
    </ul>
  </nav>
);
