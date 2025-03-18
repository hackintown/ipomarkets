"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { toast } from "react-hot-toast";
import { PlusCircle, Save, Trash2 } from "lucide-react";
import Loader from "@/components/ui/Loader";
import CompanyBasicInfo from "./CompanyBasicInfo";
import CompanyLogo from "./CompanyLogo";
import CompanyImages from "./CompanyImages";
import CompanyTables from "./CompanyTables";
import CompanyLinks from "./CompanyLinks";
import CompanyContent from "./CompanyContent";
import CompanyReviews from "./CompanyReviews";
import CompanyNews from "./CompanyNews";

/**
 * Type Definitions
 * Structured interfaces for data models used throughout the component
 */

// Column definition for table structure
interface Column {
  name: string;
  type: string;
  required: boolean;
}

// Table structure definition
interface Table {
  _id: string;
  tableName: string;
  description: string;
  columns: Column[];
}

// Company option for dropdown selection
interface CompanyOption {
  _id: string;
  name: string;
  tableId: string;
}

// Generic table data type for dynamic table content
interface TableData {
  [key: string]: string | number | boolean | null;
}

/**
 * CompanyDetails interface - Main data model for company information
 * Contains all sections of company information that can be edited
 */
interface CompanyDetails {
  _id?: string;
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
    data: TableData[];
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
    tableData?: TableData[];
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

/**
 * CompanyDetails Component
 *
 * A comprehensive admin interface for managing detailed company information.
 * Supports creating, updating, and deleting company details with multiple
 * content sections organized in tabs.
 */
export default function CompanyDetails() {
  // =========================================================================
  // State Management
  // =========================================================================
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic-info");

  // =========================================================================
  // Data Fetching & Lifecycle Hooks
  // =========================================================================

  /**
   * Initialize component by fetching available tables
   */
  useEffect(() => {
    fetchTables();
  }, []);

  /**
   * Fetch companies when a table is selected
   * Reset companies and selection when table changes
   */
  useEffect(() => {
    if (selectedTable) {
      fetchCompanies(selectedTable);
    } else {
      setCompanies([]);
      setSelectedCompany("");
    }
  }, [selectedTable]);

  /**
   * Fetch or initialize company details when a company is selected
   */
  useEffect(() => {
    if (selectedCompany) {
      fetchCompanyDetails(selectedCompany);
    } else {
      setCompanyDetails(null);
    }
  }, [selectedCompany, companies, selectedTable]);  

  // =========================================================================
  // API Interaction Methods
  // =========================================================================

  /**
   * Fetch all available tables from the API
   */
  const fetchTables = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tables");

      if (!response.ok) throw new Error("Failed to fetch tables");

      const result = await response.json();
      setTables(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Error fetching tables:", error);
      toast.error("Failed to fetch tables");
      setTables([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch companies associated with a specific table
   *
   * @param tableId - The ID of the table to fetch companies for
   */
  const fetchCompanies = async (tableId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/companies?tableId=${tableId}`);

      if (!response.ok) throw new Error("Failed to fetch companies");

      const result = await response.json();
      setCompanies(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to fetch companies");
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch company details for a specific company
   * If no details exist, initialize a new empty structure
   *
   * @param companyId - The ID of the company to fetch details for
   */
  const fetchCompanyDetails = async (companyId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/company-details?companyId=${companyId}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          // Initialize new empty company details structure
          initializeNewCompanyDetails(companyId);
          return;
        }
        throw new Error("Failed to fetch company details");
      }

      const result = await response.json();
      setCompanyDetails(result.data);
    } catch (error) {
      console.error("Error fetching company details:", error);
      toast.error("Failed to fetch company details");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Initialize a new empty company details structure
   *
   * @param companyId - The ID of the company to create details for
   */
  const initializeNewCompanyDetails = (companyId: string) => {
    const selectedCompanyData = companies.find((c) => c._id === companyId);

    if (selectedCompanyData) {
      setCompanyDetails({
        companyId,
        tableId: selectedTable,
        companyName: selectedCompanyData.name,
        basicInfo: {
          description: "",
          industry: "",
          founded: "",
          headquarters: "",
          ceo: "",
          employees: "",
          website: "",
        },
        logo: {
          url: "",
          alt: "",
        },
        images: [],
        tables: [],
        links: [],
        content: [],
        reviews: [],
        news: [],
      });
    }
  };

  /**
   * Save company details - handles both creation and updates
   * Uses different endpoints based on whether the record exists
   */
  const saveCompanyDetails = async () => {
    try {
      setIsSaving(true);

      // Validate required selections
      if (!companyDetails || !selectedTable || !selectedCompany) {
        toast.error("Please select a company and table first");
        return;
      }

      // Prepare payload with latest data
      const payload = {
        ...companyDetails,
        companyId: selectedCompany,
        tableId: selectedTable,
        companyName:
          companies.find((c) => c._id === selectedCompany)?.name || "",
      };

      // Determine if this is an update or create operation
      const isUpdate = companyDetails._id !== undefined;
      const url = isUpdate
        ? `/api/company-details/${companyDetails._id}`
        : "/api/company-details";
      const method = isUpdate ? "PUT" : "POST";

      // Send request to API
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save company details");
      }

      // Update state with returned data
      setCompanyDetails(result.data);
      toast.success("Company details saved successfully");
    } catch (error: unknown) {
      console.error("Error saving company details:", error);

      // Extract error message with type safety
      let errorMessage = "Failed to save company details";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Delete company details after confirmation
   */
  const deleteCompanyDetails = async () => {
    // Validate and confirm deletion
    if (
      !companyDetails ||
      !window.confirm("Are you sure you want to delete these company details?")
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/company-details?companyId=${companyDetails.companyId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete company details");
      }

      toast.success("Company details deleted successfully");
      setCompanyDetails(null);
      setSelectedCompany("");
    } catch (error) {
      console.error("Error deleting company details:", error);
      toast.error("Failed to delete company details");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update a specific section of company details
   *
   * @param section - The section key to update
   * @param data - The new data for the section
   */
  const updateCompanyDetails = (
    section: keyof CompanyDetails,
    data: unknown
  ) => {
    if (!companyDetails) return;

    setCompanyDetails({
      ...companyDetails,
      [section]: data,
    });
  };

  // =========================================================================
  // Render Loading State
  // =========================================================================
  if (isLoading && !companyDetails) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  // =========================================================================
  // Main Component Render
  // =========================================================================
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Section with Title and Action Buttons */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Company Details
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Manage detailed information for companies
          </p>
        </div>

        {companyDetails && (
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={saveCompanyDetails}
              disabled={isSaving || isLoading}
              leftIcon={
                isSaving ? (
                  <div className="w-4 h-4">
                    <Loader />
                  </div>
                ) : (
                  <Save className="w-4 h-4" />
                )
              }
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="danger"
              onClick={deleteCompanyDetails}
              disabled={isLoading || isSaving}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Selection Controls for Table and Company */}
      <Card className="p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Table</label>
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a table" />
              </SelectTrigger>
              <SelectContent>
                {tables.length > 0 ? (
                  tables.map((table) => (
                    <SelectItem key={table._id} value={table._id}>
                      {table.tableName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-tables" disabled>
                    No tables available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Company</label>
            <Select
              value={selectedCompany}
              onValueChange={setSelectedCompany}
              disabled={!selectedTable || companies.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {companies.length > 0 ? (
                  companies.map((company) => (
                    <SelectItem key={company._id} value={company._id}>
                      {company.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-companies" disabled>
                    {selectedTable
                      ? "No companies available"
                      : "Select a table first"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Company Details Editor with Tabs */}
      {companyDetails ? (
        <Card className="p-0 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start border-b rounded-none px-4">
              <TabsTrigger
                value="basic-info"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Basic Info
              </TabsTrigger>
              <TabsTrigger
                value="logo"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Logo
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Images
              </TabsTrigger>
              <TabsTrigger
                value="tables"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Tables
              </TabsTrigger>
              <TabsTrigger
                value="links"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Links
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Content
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="news"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                News
              </TabsTrigger>
            </TabsList>

            <div className="p-4 md:p-6">
              <TabsContent value="basic-info">
                <CompanyBasicInfo
                  data={companyDetails.basicInfo}
                  onChange={(data) => updateCompanyDetails("basicInfo", data)}
                />
              </TabsContent>

              <TabsContent value="logo">
                <CompanyLogo
                  data={companyDetails.logo}
                  onChange={(data) => updateCompanyDetails("logo", data)}
                />
              </TabsContent>

              <TabsContent value="images">
                <CompanyImages
                  data={companyDetails.images}
                  onChange={(data) => updateCompanyDetails("images", data)}
                />
              </TabsContent>

              <TabsContent value="tables">
                <CompanyTables
                  data={companyDetails.tables}
                  onChange={(data) => updateCompanyDetails("tables", data)}
                />
              </TabsContent>

              <TabsContent value="links">
                <CompanyLinks
                  data={companyDetails.links}
                  onChange={(data) => updateCompanyDetails("links", data)}
                />
              </TabsContent>

              <TabsContent value="content">
                <CompanyContent
                  data={companyDetails.content}
                  onChange={(data) => updateCompanyDetails("content", data)}
                />
              </TabsContent>

              <TabsContent value="reviews">
                <CompanyReviews
                  data={companyDetails.reviews || []}
                  onChange={(data) => updateCompanyDetails("reviews", data)}
                />
              </TabsContent>

              <TabsContent value="news">
                <CompanyNews
                  data={companyDetails.news || []}
                  onChange={(data) => updateCompanyDetails("news", data)}
                />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <PlusCircle className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">No Company Selected</h2>
          <p className="text-muted-foreground">
            Please select a table and company to manage details
          </p>
        </Card>
      )}
    </div>
  );
}
