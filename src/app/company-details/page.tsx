"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, ArrowUp, Info, Download, Calendar, DollarSign, Users, BarChart3 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import StockChart from "@/components/ui/DummyData/stock-chart"
import IpoDetailsTable from "@/components/ui/DummyData/ipo-details-table"
import IpoTimelineTable from "@/components/ui/DummyData/ipo-timeline-table"
import IpoLotSizeTable from "@/components/ui/DummyData/ipo-lot-size-table"

export default function CompanyDetailsPage() {
  const [selectedIpo, setSelectedIpo] = useState("hexaware")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="#" className="hover:text-primary">
              IPO Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link href="#" className="hover:text-primary">
              MainBoard IPO List
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-gray-900 font-medium">Company Details</span>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Hexaware Technologies Limited IPO</h1>
              <p className="text-gray-500 mt-1">(Hexaware Technologies IPO) Detail</p>
            </div>
            <div className="flex items-center">
              <Badge className="bg-red-500 text-white font-medium py-1.5">February 12, 2025 - February 14, 2025</Badge>
              <div className="ml-4">
                <Select value={selectedIpo} onValueChange={setSelectedIpo}>
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Choose current IPO" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hexaware">Hexaware Technologies IPO</SelectItem>
                    <SelectItem value="other1">Other IPO 1</SelectItem>
                    <SelectItem value="other2">Other IPO 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Company Logo and Summary */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="bg-blue-50 p-4 rounded-lg inline-block">
                <h2 className="text-3xl font-bold text-blue-600">HEXAWARE</h2>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-gray-700">
                Hexaware Technologies IPO is a book built issue of Rs 8,750.00 crores. The issue is entirely an offer
                for sale of 12.36 crore shares.
              </p>
              <p className="text-gray-700">
                Hexaware Technologies IPO bidding started from February 12, 2025 and ended on February 14, 2025. The
                allotment for Hexaware Technologies IPO was finalized on Monday, February 17, 2025. The shares got
                listed on BSE, NSE on February 19, 2025.
              </p>
              <p className="text-gray-700">
                Hexaware Technologies IPO price band is set at ₹708 per share. The minimum lot size for an application
                is 21. The minimum amount of investment required by retail investors is ₹14,154. But it is suggested to
                the investor to bid at the cutoff price to avoid the oversubscription scenario, which is about to
                ₹14,868. The minimum lot size investment for HNI is 14 lots (294 shares), amounting to ₹2,08,152, and
                for NHIL it is 68 lots (1,428 shares), amounting to ₹10,11,024.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="ipo-detail" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="h-auto p-0 bg-transparent border-b w-full justify-start">
              <TabsTrigger
                value="ipo-detail"
                className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                IPO Detail
              </TabsTrigger>
              <TabsTrigger
                value="stock-price"
                className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                Stock Price
              </TabsTrigger>
              <TabsTrigger
                value="docs"
                className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                Docs
              </TabsTrigger>
              <TabsTrigger
                value="review"
                className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                Review
              </TabsTrigger>
              <TabsTrigger
                value="subscription"
                className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                Subscription
              </TabsTrigger>
              <TabsTrigger
                value="calculator"
                className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                Calculator
              </TabsTrigger>
              <TabsTrigger
                value="news"
                className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                News
              </TabsTrigger>
              <TabsTrigger
                value="gmp"
                className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                GMP
              </TabsTrigger>
              <TabsTrigger
                value="allotment"
                className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                Allotment
              </TabsTrigger>
              <TabsTrigger
                value="basis-of-allotment"
                className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                Basis of Allotment
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                Messages
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="ipo-detail" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <p className="text-gray-700 mb-4">
                    The issue includes a reservation of up to 1404056 shares for employees offered at a discount of Rs
                    67.00 to the issue price.
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="text-gray-700">
                      <span className="font-medium">Kotak Mahindra Capital Company Limited</span>,
                    </span>
                    <span className="text-gray-700">
                      <span className="font-medium">Citigroup Global Markets India Private Limited</span>,
                    </span>
                    <span className="text-gray-700">
                      <span className="font-medium">J.P. Morgan India Private Limited</span>,
                    </span>
                    <span className="text-gray-700">
                      <span className="font-medium">HSBC Securities & Capital Markets Pvt Ltd</span>,
                    </span>
                    <span className="text-gray-700">
                      <span className="font-medium">I-Sec Securities Ltd</span>
                    </span>
                    <span className="text-gray-700">
                      are the book running lead managers of the Hexaware Technologies IPO, while
                    </span>
                    <span className="text-gray-700">
                      <span className="font-medium">Kfin Technologies Limited</span>
                    </span>
                    <span className="text-gray-700">is the registrar for the issue.</span>
                  </div>
                  <div className="mt-4">
                    <Link href="#" className="text-primary flex items-center hover:underline">
                      <Download className="h-4 w-4 mr-1" />
                      Hexaware Technologies IPO RHP for detailed information.
                    </Link>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Hexaware Technologies Limited Stock Quote & Charts
                  </h2>
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-2xl font-bold">₹799.20</h3>
                          <div className="flex items-center ml-3 text-green-600">
                            <ArrowUp className="h-4 w-4" />
                            <span className="font-medium">20.25</span>
                            <span className="ml-1">(2.60%)</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Updated On: Mar 11, 2025 4:00 PM</div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2 md:mt-0">
                        Discuss this stock
                      </Button>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Open:</span>
                        <span className="font-medium">₹770.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">High - Low:</span>
                        <span className="font-medium">₹801.65 - ₹765.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Previous Close:</span>
                        <span className="font-medium">₹778.95</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Traded Value:</span>
                        <span className="font-medium">₹7,04,708.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">52 Weeks High:</span>
                        <span className="font-medium">₹847.00 (Feb 27, 2025)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">52 Weeks Low:</span>
                        <span className="font-medium">₹708.00 (Feb 19, 2025)</span>
                      </div>
                    </div>

                    <div className="h-64 w-full">
                      <StockChart />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Hexaware Technologies IPO Details</h2>
                  <IpoDetailsTable />
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Hexaware Technologies IPO Timeline (Tentative Schedule)
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Hexaware Technologies IPO opens on February 12, 2025, and closes on February 14, 2025.
                  </p>
                  <IpoTimelineTable />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Hexaware Technologies IPO Lot Size</h2>
                  <p className="text-gray-700 mb-4">
                    Investors can bid for a minimum of 21 shares and in multiples thereof. The below table depicts the
                    minimum and maximum investment by retail investors and HNI in terms of shares and amount.
                  </p>
                  <IpoLotSizeTable />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stock-price">
            <div className="py-12 text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Stock Price Information</h3>
              <p className="mt-2 text-gray-500">Detailed stock price information and charts will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="docs">
            <div className="py-12 text-center">
              <Download className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Documents</h3>
              <p className="mt-2 text-gray-500">IPO related documents and filings will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="review">
            <div className="py-12 text-center">
              <Info className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Reviews</h3>
              <p className="mt-2 text-gray-500">Expert reviews and analysis will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="subscription">
            <div className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Subscription Details</h3>
              <p className="mt-2 text-gray-500">Subscription statistics and information will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="calculator">
            <div className="py-12 text-center">
              <DollarSign className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">IPO Calculator</h3>
              <p className="mt-2 text-gray-500">Calculate your potential investment returns here.</p>
            </div>
          </TabsContent>

          <TabsContent value="news">
            <div className="py-12 text-center">
              <Info className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Latest News</h3>
              <p className="mt-2 text-gray-500">News and updates related to this IPO will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="gmp">
            <div className="py-12 text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Grey Market Premium</h3>
              <p className="mt-2 text-gray-500">Grey market premium information will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="allotment">
            <div className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Allotment Information</h3>
              <p className="mt-2 text-gray-500">Allotment details and status will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="basis-of-allotment">
            <div className="py-12 text-center">
              <Info className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Basis of Allotment</h3>
              <p className="mt-2 text-gray-500">Information about how shares are allotted will appear here.</p>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="py-12 text-center">
              <Info className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Messages</h3>
              <p className="mt-2 text-gray-500">Important messages and announcements will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

