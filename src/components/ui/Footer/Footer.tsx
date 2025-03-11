import Link from "next/link";
import { Newspaper } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";
import { SocialLinks } from "./SocialLinks";
import { Separator } from "@/components/ui/separator";

const categories = [
  { label: "Politics", href: "#" },
  { label: "Technology", href: "#" },
  { label: "Business", href: "#" },
  { label: "Science", href: "#" },
  { label: "Health", href: "#" },
  { label: "Sports", href: "#" },
];

const company = [
  { label: "About Us", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Advertise", href: "#" },
];

const legal = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container px-4 py-16 mx-auto">
        {/* Top Section with Logo and Newsletter */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 mb-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <Newspaper className="h-10 w-10 text-primary" />
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  IPO Markets
                </span>
                <p className="text-sub-title text-sm">Your Daily Dose of Truth</p>
              </div>
            </div>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              Stay ahead with our premium journalism. Subscribe to our newsletter for exclusive insights and breaking news.
            </p>
            <NewsletterForm />
          </div>

          {/* Navigation Links with Category Colors */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* Categories with Hover Effects */}
              <div className="space-y-6">
                <h3 className="font-semibold text-lg relative after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-12 after:h-0.5 after:bg-primary">
                  Categories
                </h3>
                <ul className="space-y-3">
                  {categories.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="group flex items-center text-muted-foreground hover:text-primary transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground group-hover:bg-primary mr-2 transition-colors" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Links */}
              <div className="space-y-6">
                <h3 className="font-semibold text-lg relative after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-12 after:h-0.5 after:bg-accent">
                  Company
                </h3>
                <ul className="space-y-3">
                  {company.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="group flex items-center text-muted-foreground hover:text-accent transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground group-hover:bg-accent mr-2 transition-colors" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div className="space-y-6">
                <h3 className="font-semibold text-lg relative after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-12 after:h-0.5 after:bg-secondary">
                  Legal
                </h3>
                <ul className="space-y-3">
                  {legal.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="group flex items-center text-muted-foreground hover:text-secondary transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground group-hover:bg-secondary mr-2 transition-colors" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 opacity-30" />

        {/* Bottom Section with Modern Layout */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} IPO Markets. All rights reserved.
            </span>
            <span className="hidden sm:block text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              Made with passion in NYC
            </span>
          </div>
          <div className="flex items-center gap-6">
            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  );
}