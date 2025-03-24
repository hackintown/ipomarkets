"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

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
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Admin Actions */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tables
        </Button>
        
        <div className="flex gap-2">
          <Link href={`/company/${params.id}`} target="_blank">
            <Button variant="outline" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              View Public Page
            </Button>
          </Link>
          
          <Link href={`/admin/company-details?edit=${params.id}`}>
            <Button variant="primary">Edit Company Details</Button>
          </Link>
        </div>
      </div>

      {/* Company Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {companyDetails.logo && companyDetails.logo.url && (
            <div className="flex-shrink-0">
              <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
                <Image
                  src={companyDetails.logo.url}
                  alt={companyDetails.logo.alt || companyDetails.companyName}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
          
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{companyDetails.companyName}</h1>
            <p className="text-lg text-muted-foreground mb-4">
              {companyDetails.basicInfo.industry}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {companyDetails.basicInfo.website && (
                <a
                  href={companyDetails.basicInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  Visit Website
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              )}
              
              {companyDetails.links && companyDetails.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  {link.title}
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Company Overview */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Company Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {companyDetails.basicInfo.founded && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Founded</h3>
              <p>{companyDetails.basicInfo.founded}</p>
            </div>
          )}
          
          {companyDetails.basicInfo.headquarters && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Headquarters</h3>
              <p>{companyDetails.basicInfo.headquarters}</p>
            </div>
          )}
          
          {companyDetails.basicInfo.ceo && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">CEO</h3>
              <p>{companyDetails.basicInfo.ceo}</p>
            </div>
          )}
          
          {companyDetails.basicInfo.employees && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Employees</h3>
              <p>{companyDetails.basicInfo.employees}</p>
            </div>
          )}
        </div>
        
        {companyDetails.basicInfo.description && (
          <div className="whitespace-pre-line">
            {companyDetails.basicInfo.description}
          </div>
        )}
      </Card>

      {/* Key Information Tables */}
      {companyDetails.tables && companyDetails.tables.length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Key Information</h2>
          
          <div className="space-y-8">
            {companyDetails.tables.map((table, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-xl font-medium">{table.title}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <tbody className="divide-y divide-border">
                      {table.data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {Object.entries(row).map(([, value], cellIndex) => (
                            <td 
                              key={cellIndex} 
                              className={`py-3 px-4 ${cellIndex === 0 ? 'font-medium bg-muted' : ''}`}
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
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Additional Information</h2>
          
          <div className="space-y-8">
            {sortedContent.map((section, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-xl font-medium">{section.title}</h3>
                <div className="whitespace-pre-line">
                  {section.body}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reviews */}
      {companyDetails.reviews && companyDetails.reviews.length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Reviews & Ratings</h2>
          
          <div className="space-y-6">
            {companyDetails.reviews.map((review, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">{review.title}</h3>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-3">
                  By {review.author} on {review.date}
                </div>
                
                {review.content && (
                  <div className="mb-4">{review.content}</div>
                )}
                
                {review.type === 'list' && review.listItems && (
                  <ul className="list-disc pl-5 space-y-1">
                    {review.listItems.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                )}
                
                {review.type === 'table' && review.tableData && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                      <tbody className="divide-y divide-border">
                        {review.tableData.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {Object.entries(row).map(([, value], cellIndex) => (
                              <td 
                                key={cellIndex} 
                                className={`py-2 px-3 ${cellIndex === 0 ? 'font-medium bg-muted' : ''}`}
                              >
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* News */}
      {sortedNews.length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Latest News</h2>
          
          <div className="space-y-6">
            {sortedNews.map((news, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">{news.title}</h3>
                
                <div className="text-sm text-muted-foreground mb-3">
                  {news.date}
                  {news.time && ` • ${news.time}`}
                  {news.source && ` • Source: ${news.source}`}
                </div>
                
                <p className="mb-3">{news.description}</p>
                
                {news.content && (
                  <div className="mb-4 whitespace-pre-line">
                    {news.content}
                  </div>
                )}
                
                {news.url && (
                  <a 
                    href={news.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    Read full article
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
} 
