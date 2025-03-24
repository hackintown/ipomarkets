import type { MenuItem } from "./types";

export const NAVIGATION_MENUS = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "IPOs",
    subMenuHeading: ["Current IPOs", "Upcoming IPOs", "SME IPOs"],
    subMenu: [
      {
        name: "Active IPOs",
        desc: "Currently open for subscription",
        href: "/active-ipos",
        iconName: "Activity",
        group: "Current IPOs",
      },
      {
        name: "Recently Listed",
        desc: "IPOs listed in last 30 days",
        href: "/recently-listed",
        iconName: "LineChart",
        group: "Current IPOs",
      },
      {
        name: "Upcoming IPOs",
        desc: "IPOs opening soon",
        href: "/upcoming-ipos",
        iconName: "Calendar",
        group: "Upcoming IPOs",
      },
      {
        name: "IPO Calendar",
        desc: "Schedule of upcoming listings",
        href: "/ipo-calendar",
        iconName: "CalendarDays",
        group: "SME IPOs",
      },
    ],
    gridCols: 2,
    layout: "grouped",
  },

  {
    name: "News",
    href: "/news",
  },
  {
    name: "Blog",
    href: "/blog",
  },
  {
    name: "FAQs",
    href: "/faqs",
  },
  // {
  //   name: "Polls",
  //   href: "/polls",
  // },
  // {
  //   name: "Community Forum",
  //   href: "/community",
  // },
] as const satisfies MenuItem[];

export type NavigationMenu = (typeof NAVIGATION_MENUS)[number];
