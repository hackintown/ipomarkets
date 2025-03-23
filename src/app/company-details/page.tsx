"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Info,
  MessageSquare,
  Share2,
  Clock,
  DollarSign,
  BarChart2,
  Bookmark,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";

export default function CompanyDetailsPage() {
  // For demo purposes, using the provided data directly
  // In a real application, this would come from props or API call
  const company = {
    _id: {
      $oid: "67d961859c085be9b5ae131d",
    },
    companyId: "67aecec7ba8189880580d8a1",
    tableId: "67aecd77ba8189880580d892",
    companyName: "Muthoot Fincorp Limited",
    basicInfo: {
      description:
        "Hexaware Technologies IPO is a book built issue of Rs 8,750.00 crores. The issue is entirely an offer for sale of 12.36 crore shares.\n\nHexaware Technologies IPO bidding started from February 12, 2025 and ended on February 14, 2025. The allotment for Hexaware Technologies IPO was finalized on Monday, February 17, 2025. The shares got listed on BSE, NSE on February 19, 2025.\n\nHexaware Technologies IPO price band is set at ₹708 per share. The minimum lot size for an application is 21. The minimum amount of investment required by retail investors is ₹14,154. But it is suggested to the investor to bid at the cutoff price to avoid the oversubscription senerio, which is about to ₹14,868. The minimum lot size investment for sNII is 14 lots (294 shares), amounting to ₹2,08,152, and for bNII, it is 68 lots (1,428 shares), amounting to ₹10,11,024.\n\nThe issue includes a reservation of up to 1404056 shares for employees offered at a discount of Rs 67.00 to the issue price.\n\nKotak Mahindra Capital Company Limited, Citigroup Global Markets India Private Limited, J.P. Morgan India Private Limited, Hsbc Securities & Capital Markets Pvt Ltd, Iifl Securities Ltd are the book running lead managers of the Hexaware Technologies IPO, while Kfin Technologies Limited is the registrar for the issue.\n\nRefer to  Hexaware Technologies IPO RHP for detailed information.",
      industry: "Finance",
      founded: "2000",
      headquarters: "New Delhi",
      ceo: "Manoj Kumar",
      employees: "100",
      website: "https://www.chittorgarh.com/ipo/arisinfra-solutions-ipo/1971/",
    },
    logo: {
      url: "https://www.chittorgarh.net/images/ipo/hexaware-ipo-logo.jpg",
      alt: "Logo",
    },
    images: [
      {
        url: "https://main.icharts.in/ShowChart.php?symbol=HEXT&period=Daily&chart_type=LINE&period_type=P&pr_period=3M&chart_size=300",
        caption: "Logos",
      },
    ],
    tables: [
      {
        title: "New Table",
        data: [
          {
            "Investor Category": "Anchor Investor Shares Offered",
            "Shares Offered": "3,66,94,914 (29.66%)",
            "Maximum Allottees": "NA",
          },
          {
            "Investor Category": "QIB Shares Offered",
            "Shares Offered": "2,44,63,278 (19.77%)",
            "Maximum Allottees": "NA",
          },
          {
            "Investor Category": "NII (HNI) Shares Offered",
            "Shares Offered": "1,83,47,458 (14.83%)",
            "Maximum Allottees": "NA",
          },
          {
            "Investor Category": "bNII > ₹10L",
            "Shares Offered": "1,22,31,638 (9.89%)",
            "Maximum Allottees": "NA",
          },
        ],
      },
    ],
    links: [
      {
        title: "Official Website",
        url: "https://www.chittorgarh.com/ipo/arisinfra-solutions-ipo/1971/",
        type: "website",
      },
      {
        title: "Telegram",
        url: "https://t.me/hackintown",
        type: "social",
      },
    ],
    content: [
      {
        title: "About Hexaware Technologies Limited",
        body: "Incorporated in 1992, Hexaware Technologies Limited is engaged in the business of global digital and technology services with artificial intelligence.\n\nThe company uses technology to offer innovative solutions, integrating AI to help customers adapt, innovate, and improve in the AI-driven world.\n\nThe company has major offshore delivery centers in India (Chennai, Pune, Bengaluru, Noida, etc.) and Sri Lanka. It plans expansion into Tier 2 cities and aims to open new centers in Ahmedabad.\n\nAs of September 30, 2024, the company has a global delivery presence with 39 centers and 16 offices across the Americas, Europe, and APAC.\n\nBusiness Segment: The company provides services in its operating segments across six industries Financial Services, Healthcare & Insurance, Manufacturing & Consumer, Hi-Tech & Professional Services, Banking, and Travel & Transportation.",
        order: 0,
      },
      {
        title: "Hexaware Technologies IPO Review (Apply)",
        body: "[Dilip Davda]  HTL is one of the leading players in AI-enabled digital solutions provider from India. It marked steady growth in its top and bottom lines for the reported periods. It has evolved growing set of offerings in the last decade and is thus enjoying prime place in innovative solutions globally. Based on recent financial performance, the issue appears fully priced. Well-informed investors may park funds for medium to long term, in this dividend paying company. Read detail review...",
        order: 1,
      },
    ],
    reviews: [
      {
        title: "Hexaware Technologies IPO Analysis By Brokers/Analysts",
        content: "",
        rating: 4,
        author: "MK",
        date: "2025-03-18",
        type: "content",
        listItems: [
          "The recommendations or analysis of public issues posted above expresses the views of its author and does not represent the views of Chittorgarh.com or its staff.",
          "We reserve the right to remove any objectionable post without providing a reason.",
        ],
        tableData: [
          {
            Reviewer: "Anand Rathi",
            Recommendation: "Apply",
            "Past Reviews": "5/5",
          },
          {
            Reviewer: "Manoj Kumar",
            Recommendation: "Apply",
            "Past Reviews": "5/5",
          },
          {
            Reviewer: "Akki Chaudhary",
            Recommendation: "Apply",
            "Past Reviews": "5/5",
          },
        ],
      },
    ],
    news: [
      {
        title:
          "Mobikwik, IKS, Ola, Hexaware from IPO index tank up to 15%, record new lows",
        url: "https://www.business-standard.com/markets/news/mobikwik-iks-ola-hexaware-from-ipo-index-tank-up-to-15-record-new-lows-125031700196_1.html",
        date: "2025-03-18",
        time: "17:38",
        description:
          "Thus far in the calendar year 2025, BSE IPO index has underperformed the market by falling 22 per cent, as compared to 5.4 per cent decline in the BSE Sensex.",
        content:
          "Shares of One Mobikwik Systems (Mobikwik), Inventurus Knowledge Solutions (IKS), Ola Electric Mobility (Ola), Hexaware Technologies and Awfis Space Solutions tanked up to 15 per cent on the BSE in Monday's intra-day trade amid heavy volumes in an otherwise firm market.\n \nBesides IKS, Mobikwik, Ola, Hexaware Technologies, a total of 9 stocks from the BSE IPO index hit their respective new lows in intra-day trade today. The list includes Ceigall India, Emcure Pharmaceuticals, Gopal Snacks, Quality Power Electrical Equipments (QPower), Saraswati Saree Depot and Western Carriers (India).\n \nAt 10:01 AM; the BSE IPO index was down 0.6 per cent at 12,921.79, as compared to 0.63 per cent rise in the BSE Sensex. The IPO index has corrected 25 per cent from its 52-week high of 17,281 touched on September 29, 2024. Thus far in the calendar year 2025, the BSE IPO index has underperformed the market by falling 22 per cent. In comparison, the BSE Sensex was down 5.4 per cent during the same period.",
        source:
          "https://www.zeebiz.com/markets/ipo/news-upcoming-ipo-this-week-arisinfra-solutions-issue-set-to-hit-dalal-street-on-thursday-351368",
        order: 0,
      },
    ],
    createdAt: "2025-03-18T12:05:25.232Z",
    updatedAt: "2025-03-18T12:05:25.232Z",
  };

  // Format content body paragraphs
  const formatContentBody = (body: string) => {
    return body.split("\n\n").map((paragraph: string, index: number) => (
      <p key={index} className="mb-4 last:mb-0">
        {paragraph}
      </p>
    ));
  };

  // Stock price data (mock data for demonstration)
  const [stockPrice] = useState({
    current: 799.2,
    change: 20.25,
    changePercent: 2.6,
    isUp: true,
    open: 770.0,
    high: 801.65,
    low: 765.0,
    previousClose: 778.95,
    tradedValue: "7,04,708.00",
    weekHigh: 847.0,
    weekHighDate: "Feb 27, 2025",
    weekLow: 708.0,
    weekLowDate: "Feb 19, 2025",
    lastUpdated: "Mar 18, 2025 4:00 PM",
  });

  // IPO timeline data (mock data for demonstration)
  const ipoTimeline = [
    { event: "IPO Opening Date", date: "February 12, 2025" },
    { event: "IPO Closing Date", date: "February 14, 2025" },
    { event: "Basis of Allotment", date: "February 17, 2025" },
    { event: "Initiation of Refunds", date: "February 18, 2025" },
    { event: "Credit of Shares to Demat", date: "February 18, 2025" },
    { event: "Listing Date", date: "February 19, 2025" },
  ];

  // IPO lot size data (mock data for demonstration)
  const ipoLotSize = [
    {
      category: "Retail Individual Investors (RII)",
      minLots: 1,
      maxLots: 13,
      minShares: 21,
      maxShares: 273,
      minAmount: "₹14,868",
      maxAmount: "₹1,93,284",
    },
    {
      category: "Non-Institutional Investors (NII)",
      minLots: 14,
      maxLots: 67,
      minShares: 294,
      maxShares: 1407,
      minAmount: "₹2,08,152",
      maxAmount: "₹9,96,156",
    },
    {
      category: "Big Non-Institutional Investors (bNII)",
      minLots: 68,
      maxLots: "No Limit",
      minShares: 1428,
      maxShares: "No Limit",
      minAmount: "₹10,11,024",
      maxAmount: "No Limit",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sticky Header with Company Name and Actions */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {company.companyName}{" "}
                <span className="text-gray-500 dark:text-gray-400 text-lg">
                  IPO
                </span>
              </h1>
              <Badge
                variant="outline"
                className="ml-3 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
              >
                Listed
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Website
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Link
              href="#"
              className="hover:text-primary dark:hover:text-primary"
            >
              IPO Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link
              href="#"
              className="hover:text-primary dark:hover:text-primary"
            >
              MainBoard IPO List
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-gray-900 dark:text-white font-medium">
              Company Details
            </span>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="h-auto p-0 bg-transparent border-b w-full justify-start">
              <TabsTrigger
                value="overview"
                className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="ipo-details"
                className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                IPO Details
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="news"
                className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                News
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                Documents
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content - Left and Center */}
              <div className="lg:col-span-2 space-y-6">
                {/* Company Header with Logo */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg inline-block">
                          {company.logo?.url ? (
                            <Image
                              src={company.logo.url || "/placeholder.svg"}
                              alt={company.logo.alt || company.companyName}
                              width={100}
                              height={100}
                              className="object-contain"
                            />
                          ) : (
                            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                              {company.companyName
                                .substring(0, 3)
                                .toUpperCase()}
                            </h2>
                          )}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {company.companyName}
                          </h2>
                          <p className="text-gray-500 dark:text-gray-400">
                            {company.basicInfo.industry} • Est.{" "}
                            {company.basicInfo.founded}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center">
                            <Badge variant="secondary" className="mr-2">
                              IPO Price
                            </Badge>
                            <span className="font-semibold">₹708</span>
                          </div>
                          <div className="flex items-center">
                            <Badge variant="secondary" className="mr-2">
                              Issue Size
                            </Badge>
                            <span className="font-semibold">₹8,750 Cr</span>
                          </div>
                          <div className="flex items-center">
                            <Badge variant="secondary" className="mr-2">
                              Lot Size
                            </Badge>
                            <span className="font-semibold">21 Shares</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {company.links?.map((link, index) => (
                            <Link
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-primary hover:underline"
                            >
                              <ExternalLink className="h-3.5 w-3.5 mr-1" />
                              {link.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stock Price Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">
                      Current Stock Price
                    </CardTitle>
                    <CardDescription>
                      Last updated: {stockPrice.lastUpdated}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-3xl font-bold">
                            ₹{stockPrice.current.toFixed(2)}
                          </h3>
                          <div
                            className={`flex items-center ml-3 ${
                              stockPrice.isUp
                                ? "text-green-600 dark:text-green-500"
                                : "text-red-600 dark:text-red-500"
                            }`}
                          >
                            {stockPrice.isUp ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : (
                              <ArrowDown className="h-4 w-4" />
                            )}
                            <span className="font-medium">
                              {stockPrice.change.toFixed(2)}
                            </span>
                            <span className="ml-1">
                              ({stockPrice.changePercent.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <Badge
                          className={
                            stockPrice.isUp
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }
                        >
                          {stockPrice.isUp
                            ? "Outperforming Market"
                            : "Underperforming Market"}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Open
                        </p>
                        <p className="font-medium">
                          ₹{stockPrice.open.toFixed(2)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Previous Close
                        </p>
                        <p className="font-medium">
                          ₹{stockPrice.previousClose.toFixed(2)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Day Range
                        </p>
                        <p className="font-medium">
                          ₹{stockPrice.low.toFixed(2)} - ₹
                          {stockPrice.high.toFixed(2)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          52-Week High
                        </p>
                        <p className="font-medium">
                          ₹{stockPrice.weekHigh.toFixed(2)}{" "}
                          <span className="text-xs text-gray-500">
                            ({stockPrice.weekHighDate})
                          </span>
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          52-Week Low
                        </p>
                        <p className="font-medium">
                          ₹{stockPrice.weekLow.toFixed(2)}{" "}
                          <span className="text-xs text-gray-500">
                            ({stockPrice.weekLowDate})
                          </span>
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Total Traded Value
                        </p>
                        <p className="font-medium">₹{stockPrice.tradedValue}</p>
                      </div>
                    </div>

                    {/* Placeholder for stock chart */}
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart2 className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Stock price chart will appear here
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Full Chart
                    </Button>
                    <Button size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Discuss This Stock
                    </Button>
                  </CardFooter>
                </Card>

                {/* Company Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>About {company.companyName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {company.content?.map((contentItem, index) => (
                      <div key={index} className="space-y-3">
                        <h3 className="text-lg font-semibold">
                          {contentItem.title}
                        </h3>
                        <div className="text-gray-700 dark:text-gray-300">
                          {formatContentBody(contentItem.body)}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Latest News */}
                <Card>
                  <CardHeader>
                    <CardTitle>Latest News</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {company.news?.length > 0 ? (
                      <div className="space-y-6">
                        {company.news.map((newsItem, index) => (
                          <div
                            key={index}
                            className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0"
                          >
                            <Link
                              href={newsItem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                                {newsItem.title}
                              </h3>
                            </Link>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 mb-2">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>
                                {newsItem.date} • {newsItem.time}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                              {newsItem.description}
                            </p>
                            <Link
                              href={newsItem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center mt-3 text-sm text-primary hover:underline"
                            >
                              Read full article
                              <ChevronRight className="h-3.5 w-3.5 ml-1" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Info className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No news available at this time
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All News
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Sidebar - Right */}
              <div className="space-y-6">
                {/* Key Information Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Key Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Industry
                        </p>
                        <p className="font-medium">
                          {company.basicInfo.industry}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Founded
                        </p>
                        <p className="font-medium">
                          {company.basicInfo.founded}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Headquarters
                        </p>
                        <p className="font-medium">
                          {company.basicInfo.headquarters}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          CEO
                        </p>
                        <p className="font-medium">{company.basicInfo.ceo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Employees
                        </p>
                        <p className="font-medium">
                          {company.basicInfo.employees}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          IPO Date
                        </p>
                        <p className="font-medium">Feb 19, 2025</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">IPO Price Band</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Price per share
                        </span>
                        <span className="font-semibold">₹708</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Issue Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Issue Size
                          </span>
                          <span className="font-semibold">₹8,750 Cr</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Fresh Issue
                          </span>
                          <span className="font-semibold">₹0 Cr</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Offer for Sale
                          </span>
                          <span className="font-semibold">₹8,750 Cr</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Face Value
                          </span>
                          <span className="font-semibold">₹2</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* IPO Timeline Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>IPO Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {ipoTimeline.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.event}
                          </span>
                          <span className="font-medium">{item.date}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Analyst Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Analyst Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {company.reviews?.length > 0 &&
                    company.reviews[0].tableData ? (
                      <div className="space-y-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Analyst</TableHead>
                              <TableHead>Rating</TableHead>
                              <TableHead>Accuracy</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {company.reviews[0].tableData.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {row.Reviewer}
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                    {row.Recommendation}
                                  </Badge>
                                </TableCell>
                                <TableCell>{row["Past Reviews"]}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        {company.reviews[0].listItems && (
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Disclaimer</AlertTitle>
                            <AlertDescription>
                              <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                                {company.reviews[0].listItems.map(
                                  (item, index) => (
                                    <li key={index}>{item}</li>
                                  )
                                )}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Info className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No analyst recommendations available
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Important Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle>Important Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Red Herring Prospectus (RHP)
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Draft Red Herring Prospectus (DRHP)
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Annual Report 2024
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Investor Presentation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* IPO Details Tab */}
          <TabsContent value="ipo-details" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>IPO Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Issue Structure
                        </h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Investor Category</TableHead>
                              <TableHead>Shares Offered</TableHead>
                              <TableHead>Maximum Allottees</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {company.tables &&
                              company.tables[0]?.data.map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">
                                    {row["Investor Category"]}
                                  </TableCell>
                                  <TableCell>{row["Shares Offered"]}</TableCell>
                                  <TableCell>
                                    {row["Maximum Allottees"]}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          IPO Lot Size
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Investors can bid for a minimum of 21 shares and in
                          multiples thereof. The below table depicts the minimum
                          and maximum investment by retail investors and HNI in
                          terms of shares and amount.
                        </p>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Category</TableHead>
                              <TableHead>Min Lots</TableHead>
                              <TableHead>Max Lots</TableHead>
                              <TableHead>Min Shares</TableHead>
                              <TableHead>Max Shares</TableHead>
                              <TableHead>Min Amount</TableHead>
                              <TableHead>Max Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {ipoLotSize.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {row.category}
                                </TableCell>
                                <TableCell>{row.minLots}</TableCell>
                                <TableCell>{row.maxLots}</TableCell>
                                <TableCell>{row.minShares}</TableCell>
                                <TableCell>{row.maxShares}</TableCell>
                                <TableCell>{row.minAmount}</TableCell>
                                <TableCell>{row.maxAmount}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Book Running Lead Managers
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-1">
                              Kotak Mahindra Capital Company Limited
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Lead Manager
                            </p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-1">
                              Citigroup Global Markets India Private Limited
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Lead Manager
                            </p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-1">
                              J.P. Morgan India Private Limited
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Lead Manager
                            </p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-1">
                              HSBC Securities & Capital Markets Pvt Ltd
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Lead Manager
                            </p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-1">
                              IIFL Securities Ltd
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Lead Manager
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Registrar
                        </h3>
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-1">
                            Kfin Technologies Limited
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Registrar to the Issue
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>IPO Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {ipoTimeline.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.event}
                          </span>
                          <span className="font-medium">{item.date}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>IPO Subscription Status</CardTitle>
                    <CardDescription>
                      As of closing date (Feb 14, 2025)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">
                            Qualified Institutional Buyers (QIBs)
                          </span>
                          <span className="font-medium">7.85x</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: "78.5%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">
                            Non-Institutional Investors (NIIs)
                          </span>
                          <span className="font-medium">3.42x</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: "34.2%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">
                            Retail Individual Investors (RIIs)
                          </span>
                          <span className="font-medium">1.28x</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: "12.8%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Employee Reservation</span>
                          <span className="font-medium">2.15x</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: "21.5%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Overall</span>
                          <span className="font-medium">4.75x</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: "47.5%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Placeholder content for other tabs */}
          <TabsContent value="financials" className="mt-6">
            <div className="py-12 text-center">
              <DollarSign className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
              <h3 className="mt-4 text-lg font-medium">
                Financial Information
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Detailed financial information will appear here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="py-12 text-center">
              <BarChart2 className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
              <h3 className="mt-4 text-lg font-medium">Reviews</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Expert analysis and reports will appear here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="news" className="mt-6">
            <div className="py-12 text-center">
              <Info className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
              <h3 className="mt-4 text-lg font-medium">Latest News</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                News and updates related to this company will appear here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
              <h3 className="mt-4 text-lg font-medium">Documents</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Company documents and filings will appear here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="discussion" className="mt-6">
            <div className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
              <h3 className="mt-4 text-lg font-medium">Discussion Forum</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Join the discussion about this company.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} IPO Information Portal. All
                rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link
                href="#"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
