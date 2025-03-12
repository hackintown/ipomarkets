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
import { PlusCircle, Save, Image, Table, Link, FileText, Trash2 } from "lucide-react";
import Loader from "@/components/ui/Loader";
import CompanyBasicInfo from "./CompanyBasicInfo";
import CompanyLogo from "./CompanyLogo";
import CompanyImages from "./CompanyImages";
import CompanyTables from "./CompanyTables";
import CompanyLinks from "./CompanyLinks";
import CompanyContent from "./CompanyContent";

// Types for table structure and company data
interface Column {
  name: string;
  type: string;
  required: boolean;
}

interface Table {
  _id: string;
  tableName: string;
  description: string;
  columns: Column[];
}

interface CompanyOption {
  _id: string;
  name: string;
  tableId: string;
}

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
    data: any[];
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
}

export default function CompanyDetails() {
  // State management
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic-info");

  // Fetch tables on component mount
  useEffect(() => {
    fetchTables();
  }, []);

  // Fetch companies when a table is selected
  useEffect(() => {
    if (selectedTable) {
      fetchCompanies(selectedTable);
    } else {
      setCompanies([]);
      setSelectedCompany("");
    }
  }, [selectedTable]);

  // Fetch company details when a company is selected
  useEffect(() => {
    if (selectedCompany) {
      fetchCompanyDetails(selectedCompany);
    } else {
      setCompanyDetails(null);
    }
  }, [selectedCompany]);

  // Fetch available tables
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

  // Fetch companies from a specific table
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

  // Fetch company details
  const fetchCompanyDetails = async (companyId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/company-details/${companyId}`);
      
      if (response.status === 404) {
        // Create new empty company details structure
        const selectedCompanyData = companies.find(c => c._id === companyId);
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
          });
        }
        setIsLoading(false);
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch company details");

      const result = await response.json();
      setCompanyDetails(result.data);
    } catch (error) {
      console.error("Error fetching company details:", error);
      toast.error("Failed to fetch company details");
    } finally {
      setIsLoading(false);
    }
  };

  // Save company details
  const saveCompanyDetails = async () => {
    if (!companyDetails) return;

    try {
      setIsSaving(true);
      const url = companyDetails._id 
        ? `/api/company-details/${companyDetails._id}` 
        : "/api/company-details";
      
      const method = companyDetails._id ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyDetails),
      });

      if (!response.ok) throw new Error("Failed to save company details");

      const result = await response.json();
      
      // Update the state with the returned data (including _id for new entries)
      setCompanyDetails(result.data);
      
      toast.success("Company details saved successfully");
    } catch (error) {
      console.error("Error saving company details:", error);
      toast.error("Failed to save company details");
    } finally {
      setIsSaving(false);
    }
  };

  // Update specific section of company details
  const updateCompanyDetails = (section: string, data: any) => {
    if (!companyDetails) return;
    
    setCompanyDetails({
      ...companyDetails,
      [section]: data,
    });
  };

  if (isLoading && !companyDetails) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Company Details</h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Manage detailed information for companies
          </p>
        </div>

        {companyDetails && (
          <Button 
            variant="primary" 
            onClick={saveCompanyDetails}
            disabled={isSaving}
            leftIcon={isSaving ? <Loader className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>

      {/* Selection Controls */}
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
                    {selectedTable ? "No companies available" : "Select a table first"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Company Details Editor */}
      {companyDetails ? (
        <Card className="p-0 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start border-b rounded-none px-4">
              <TabsTrigger value="basic-info" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="logo" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Logo
              </TabsTrigger>
              <TabsTrigger value="images" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Images
              </TabsTrigger>
              <TabsTrigger value="tables" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Tables
              </TabsTrigger>
              <TabsTrigger value="links" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Links
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Content
              </TabsTrigger>
            </TabsList>
            
            <div className="p-4 md:p-6">
              <TabsContent value="basic-info">
                <CompanyBasicInfo 
                  data={companyDetails.basicInfo} 
                  onChange={(data) => updateCompanyDetails('basicInfo', data)} 
                />
              </TabsContent>
              
              <TabsContent value="logo">
                <CompanyLogo 
                  data={companyDetails.logo} 
                  onChange={(data) => updateCompanyDetails('logo', data)} 
                />
              </TabsContent>
              
              <TabsContent value="images">
                <CompanyImages 
                  data={companyDetails.images} 
                  onChange={(data) => updateCompanyDetails('images', data)} 
                />
              </TabsContent>
              
              <TabsContent value="tables">
                <CompanyTables 
                  data={companyDetails.tables} 
                  onChange={(data) => updateCompanyDetails('tables', data)} 
                />
              </TabsContent>
              
              <TabsContent value="links">
                <CompanyLinks 
                  data={companyDetails.links} 
                  onChange={(data) => updateCompanyDetails('links', data)} 
                />
              </TabsContent>
              
              <TabsContent value="content">
                <CompanyContent 
                  data={companyDetails.content} 
                  onChange={(data) => updateCompanyDetails('content', data)} 
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