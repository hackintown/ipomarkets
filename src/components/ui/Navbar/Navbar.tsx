"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useCallback, useState, memo } from "react";
import DesktopMenu from "./DesktopMenu";
import MobMenu from "./MobMenu";
import { NAVIGATION_MENUS } from "./constants";
import Image from "next/image";
import { throttle } from "lodash";
import { cn } from "@/lib/utils";
import DarkModeToggle from "../DarkModeToggle";
import { IoSearch } from "react-icons/io5";
import { Button } from "../Button";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(
    throttle(() => {
      setIsScrolled(window.scrollY > 20);
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-sm",
        isScrolled ? "bg-background shadow-sm" : "bg-background",
        "py-1"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex h-16 items-center justify-between max-w-full">
          <Logo />

          <DesktopNavigation />

          <div className="flex items-center gap-2">
            <MobMenu Menus={NAVIGATION_MENUS} />
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex w-10 h-10  items-center justify-center rounded-full bg-background shadow-sm ">
                <IoSearch className="size-4 sm:size-5" />
              </div>
              <DarkModeToggle />
              <Link href="/signup" passHref>
                <Button variant="primary" size="lg" className="rounded-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

const Logo = memo(() => (
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
));
Logo.displayName = 'Logo';

const DesktopNavigation = memo(() => (
  <nav className="hidden lg:flex items-center gap-2">
    <ul className="flex items-center gap-2 text-base">
      {NAVIGATION_MENUS.map((menu) => (
        <DesktopMenu key={menu.name} menu={menu} />
      ))}
    </ul>
  </nav>
));
DesktopNavigation.displayName = 'DesktopNavigation';
