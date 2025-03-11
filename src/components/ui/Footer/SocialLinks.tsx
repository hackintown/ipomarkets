import { Twitter, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter", hoverColor: "hover:text-[#1DA1F2]" },
  { icon: Facebook, href: "#", label: "Facebook", hoverColor: "hover:text-[#4267B2]" },
  { icon: Instagram, href: "#", label: "Instagram", hoverColor: "hover:text-[#E4405F]" },
  { icon: Linkedin, href: "#", label: "LinkedIn", hoverColor: "hover:text-[#0077B5]" },
  { icon: Youtube, href: "#", label: "YouTube", hoverColor: "hover:text-[#FF0000]" },
];

export function SocialLinks() {
  return (
    <div className="flex gap-6">
      {socialLinks.map(({ icon: Icon, href, label, hoverColor }) => (
        <Link
          key={label}
          href={href}
          className={`text-muted-foreground ${hoverColor} transition-colors duration-300 hover:scale-110 transform`}
          aria-label={label}
        >
          <Icon className="h-5 w-5" />
        </Link>
      ))}
    </div>
  );
}