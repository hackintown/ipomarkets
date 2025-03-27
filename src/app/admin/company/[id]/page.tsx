"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardTitle, CardHeader, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bookmark, ChevronRight, ExternalLink, FileText, Info, MessageSquare, Share2, DollarSign, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface CompanyDetails {
  _id: string;
  companyId: string;
  tableId: string;
  companyName: string;
  basicInfo: {
    description: string;
    industry: string;
    founded: string;
    headquarters: string;
    ceo: string;
    employees: string;
    website: string;
  };
  logo: {
    url: string;
    alt: string;
  };
  images: Array<{
    url: string;
    caption: string;
  }>;
  tables: Array<{
    title: string;
    data: Array<Record<string, string>>;
  }>;
  links: Array<{
    title: string;
    url: string;
    type: string;
  }>;
  content: Array<{
    title: string;
    body: string;
    order: number;
  }>;
  reviews: Array<{
    title: string;
    content: string;
    rating: number;
    author: string;
    date: string;
    type: "table" | "list" | "content";
    listItems?: string[];
    tableData?: Record<string, string>[];
  }>;
  news: Array<{
    title: string;
    url: string;
    date: string;
    time: string;
    description: string;
    content: string;
    source: string;
    order: number;
  }>;
}

export default function AdminCompanyPage() {
  const params = useParams();
  const router = useRouter();
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await fetch(`/api/company-details/${params.id}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setCompanyDetails(result.data);
          } else {
            toast.error(result.error || "Failed to fetch company details");
          }
        } else {
          toast.error("Failed to fetch company details");
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
        toast.error("An error occurred while fetching company details");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchCompanyDetails();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!companyDetails) {
    return (
      <div className="container mx-auto py-12">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Company Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The company details you&apos;re looking for could not be found.
          </p>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  // Sort content by order
  const sortedContent = [...(companyDetails.content || [])].sort(
    (a, b) => a.order - b.order
  );

  // Sort news by order
  const sortedNews = [...(companyDetails.news || [])].sort(
    (a, b) => a.order - b.order
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {companyDetails.companyName}
              </h1>
              <Badge
                variant="outline"
                className="ml-3 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
              >
                Details
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" leftIcon={<Share2 className="size-5" />} className="hidden md:flex">
                Share
              </Button>
              <Button variant="outline" size="sm"
                leftIcon={<Bookmark className="size-5" />}
                className="hidden md:flex">
                Save
              </Button>
              <Button size="sm" variant="primary" leftIcon={<ExternalLink className="size-5" />}>
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
              href="/admin/dashboard"
              className="hover:text-primary dark:hover:text-primary"
            >
              Admin Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link
              href="/admin/dashboard/preview-tables"
              className="hover:text-primary dark:hover:text-primary"
            >
              Companies
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-gray-900 dark:text-white font-medium">
              {companyDetails?.companyName || "Company Details"}
            </span>
          </div>
        </div>
      </div>


      {/* Main Content with Tabs */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="ipo-details" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="h-auto p-0 bg-transparent border-b w-full justify-start">
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
          <TabsContent value="ipo-details" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content - Left and Center */}
              <div className="lg:col-span-2 space-y-6">
                {/* Company Header with Logo */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg inline-block">
                          {companyDetails.logo?.url ? (
                            <Image
                              src={companyDetails.logo.url || "/placeholder.svg"}
                              alt={companyDetails.logo.alt || companyDetails.companyName}
                              width={100}
                              height={100}
                              className="object-contain"
                            />
                          ) : (
                            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                              {companyDetails.companyName
                                .substring(0, 3)
                                .toUpperCase()}
                            </h2>
                          )}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {companyDetails.companyName}
                          </h2>
                          <p className="text-gray-500 dark:text-gray-400">
                            {companyDetails.basicInfo.industry} • Est.{" "}
                            {companyDetails.basicInfo.founded}
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
                          {companyDetails.links?.map((link, index) => (
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

                <Card className="p-4">
                  {companyDetails.basicInfo.description && (
                    <div className="whitespace-pre-line text-foreground text-sm md:text-base">
                      {companyDetails.basicInfo.description}
                    </div>
                  )}
                </Card>

                {companyDetails.tables && companyDetails.tables.length > 0 && (
                  <Card className="p-4">
                    <h2 className="text-2xl font-semibold mb-6">Key Information</h2>
                    <div className="space-y-8">
                      {companyDetails.tables.map((table, index) => (
                        <div key={index} className="space-y-4">
                          <h3 className="text-xl font-medium text-gray-900">{table.title}</h3>
                          <div className="overflow-x-auto rounded-lg shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {table.data.map((row, rowIndex) => (
                                  <tr
                                    key={rowIndex}
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                  >
                                    {Object.entries(row).map(([, value], cellIndex) => (
                                      <td
                                        key={cellIndex}
                                        className={`py-4 px-6 whitespace-nowrap ${cellIndex === 0
                                          ? 'font-medium text-gray-900 bg-gray-50 w-1/3'
                                          : 'text-gray-700'
                                          }`}
                                      >
                                        {value}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Content Sections */}
                {sortedContent.length > 0 && (
                  <Card className="p-4">
                    <h2 className="text-2xl font-semibold mb-6 text-foreground">Additional Information</h2>

                    <div className="space-y-8">
                      {sortedContent.map((section, index) => (
                        <div key={index} className="space-y-4">
                          <h3 className="text-xl font-medium text-foreground border-b border-gray-200 pb-2">
                            {section.title}
                          </h3>
                          <div className="text-foreground leading-relaxed whitespace-pre-line bg-background shadow-sm p-4 rounded-lg">
                            {section.body}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
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
                        <p className="text-sm text-foreground">
                          Industry
                        </p>
                        <p className="font-medium">
                          {companyDetails.basicInfo.industry}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground">
                          Founded
                        </p>
                        <p className="font-medium">
                          {companyDetails.basicInfo.founded}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground">
                          Headquarters
                        </p>
                        <p className="font-medium">
                          {companyDetails.basicInfo.headquarters}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground">
                          CEO
                        </p>
                        <p className="font-medium">{companyDetails.basicInfo.ceo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Employees
                        </p>
                        <p className="font-medium">
                          {companyDetails.basicInfo.employees}
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
            {companyDetails.reviews && companyDetails.reviews.length > 0 ? (
              <div className="space-y-6">
                {companyDetails.reviews.map((review, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-muted/50">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>{review.title}</CardTitle>
                          <CardDescription>
                            By {review.author} • {review.date}
                          </CardDescription>
                        </div>
                        {review.rating > 0 && (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {review.content && <p className="mb-4 whitespace-pre-line">{review.content}</p>}

                      {review.type === "list" && review.listItems && review.listItems.length > 0 && (
                        <ul className="list-disc pl-5 space-y-2">
                          {review.listItems.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      )}

                      {review.type === "table" && review.tableData && review.tableData.length > 0 && (
                        <div className="overflow-x-auto rounded-lg border">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                {Object.keys(review.tableData[0]).map((header, headerIndex) => (
                                  <th
                                    key={headerIndex}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {review.tableData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                  {Object.values(row).map((cell, cellIndex) => (
                                    <td
                                      key={cellIndex}
                                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
                <h3 className="mt-4 text-lg font-medium">No Reviews Available</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  There are no reviews available for this company yet.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="news" className="mt-6">
            {sortedNews && sortedNews.length > 0 ? (
              <div className="space-y-6">
                {sortedNews.map((newsItem, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{newsItem.title}</CardTitle>
                          <CardDescription className="mt-2 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {newsItem.date} • {newsItem.time} • Source: {newsItem.source ?
                              <Link href={newsItem.url} target="_blank" className="text-primary hover:underline">
                                {new URL(newsItem.url).hostname.replace('www.', '')}
                              </Link> : 'Unknown'}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium text-foreground mb-4">{newsItem.description}</p>
                      <div className="text-muted-foreground whitespace-pre-line">
                        {newsItem.content}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/30 flex justify-end">
                      <Button variant="outline" size="sm" leftIcon={<ExternalLink className="size-5" />}>
                        <Link href={newsItem.url} target="_blank" rel="noopener noreferrer">
                          Read Full Article
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Info className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
                <h3 className="mt-4 text-lg font-medium">No News Available</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  There are no news articles available for this company yet.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Documents</CardTitle>
                  <CardDescription>Important documents related to the company</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {companyDetails.links && companyDetails.links
                      .filter(link => link.type === "document" || link.title.toLowerCase().includes("prospectus") || link.title.toLowerCase().includes("report"))
                      .map((link, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start"
                    
                        >
                          <Link href={link.url} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-2" />
                            {link.title}
                          </Link>
                        </Button>
                      ))}

                    {(!companyDetails.links || !companyDetails.links.some(link =>
                      link.type === "document" || link.title.toLowerCase().includes("prospectus") || link.title.toLowerCase().includes("report")
                    )) && (
                        <div className="py-8 text-center">
                          <p className="text-muted-foreground">No company documents available</p>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>IPO Documents</CardTitle>
                  <CardDescription>Documents related to the IPO process</CardDescription>
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
                      Investor Presentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
} 
