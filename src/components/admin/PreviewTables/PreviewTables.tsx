"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Download,
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import Loader from "@/components/ui/Loader";
import Link from "next/link";

// Types for table structure and data
interface Column {
  name: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface TableSettings {
  sortable: boolean;
  filterable: boolean;
  searchable: boolean;
  pagination: boolean;
  itemsPerPage: number;
  exportable: boolean;
}

interface Table {
  _id: string;
  tableName: string;
  description: string;
  columns: Column[];
  settings: TableSettings;
  createdAt: Date;
  updatedAt: Date;
}
interface TableRow {
  _id: string;
  [key: string]: string | number | boolean | Date;
}

interface ApiResponse {
  success: boolean;
  data: Table[];
  count: number;
}
interface TableDataResponse {
  success: boolean;
  data: TableRow[];
  count: number;
}

// First, let's define an interface for company details
interface CompanyDetail {
  companyId: string;
  _id: string;
}

export default function PreviewTables() {
  // State management
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [companyDetailsMap, setCompanyDetailsMap] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Fetch tables on component mount
  useEffect(() => {
    fetchTables();
    fetchCompanyDetailsMapping();
  }, []);

  // Fetch table data when a table is selected
  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable._id);
    }
  }, [selectedTable]);

  // Fetch available tables
  const fetchTables = async () => {
    try {
      const response = await fetch("/api/tables");
      if (!response.ok) throw new Error("Failed to fetch tables");

      const result: ApiResponse = await response.json();

      // Ensure we're setting an array of tables
      if (Array.isArray(result.data)) {
        setTables(result.data);
      } else {
        console.error("Invalid data format received:", result);
        setTables([]);
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
      toast.error("Failed to fetch tables");
      setTables([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data for selected table
  const fetchTableData = async (tableId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/table-data?tableId=${tableId}`);
      if (!response.ok) throw new Error("Failed to fetch table data");
      const result: TableDataResponse = await response.json();
      setTableData(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Error fetching table data:", error);
      toast.error("Failed to fetch table data");
      setTableData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle table selection
  const handleTableSelect = (tableId: string) => {
    const table = tables.find((t) => t._id === tableId);
    setSelectedTable(table || null);
    setCurrentPage(1);
    setSearchQuery("");
    setFilters({});
    setSortConfig(null);
    if (table) {
      fetchTableData(table._id);
    }
  };

  // Filter and sort data
  const processedData = useMemo(() => {
    if (!selectedTable || !tableData.length) return [];

    let processed = [...tableData];

    // Apply search if enabled
    if (selectedTable.settings.searchable && searchQuery) {
      processed = processed.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply filters if enabled
    if (selectedTable.settings.filterable && Object.keys(filters).length) {
      processed = processed.filter((item) =>
        Object.entries(filters).every(
          ([key, value]) =>
            !value || String(item[key]).toLowerCase() === value.toLowerCase()
        )
      );
    }

    // Apply sorting if enabled
    if (selectedTable.settings.sortable && sortConfig) {
      processed.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return processed;
  }, [tableData, searchQuery, sortConfig, filters, selectedTable]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    if (!selectedTable?.settings.pagination) return processedData;

    const startIndex = (currentPage - 1) * selectedTable.settings.itemsPerPage;
    return processedData.slice(
      startIndex,
      startIndex + selectedTable.settings.itemsPerPage
    );
  }, [processedData, currentPage, selectedTable]);

  // Export data to CSV
  const exportToCSV = () => {
    if (!selectedTable || !processedData.length) return;

    const headers = selectedTable.columns.map((col) => col.name).join(",");
    const rows = processedData
      .map((item) =>
        selectedTable.columns
          .map((col) => `"${String(item[col.name] || "")}"`)
          .join(",")
      )
      .join("\n");

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTable.tableName}_export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Add this function to fetch company details mapping
  const fetchCompanyDetailsMapping = async () => {
    try {
      const response = await fetch('/api/company-details');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const mapping: Record<string, string> = {};
          data.companyDetails.forEach((detail: CompanyDetail) => {
            mapping[detail.companyId] = detail._id;
          });
          setCompanyDetailsMap(mapping);
        }
      }
    } catch (error) {
      console.error("Error fetching company details mapping:", error);
    }
  };

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (
      !selectedTable ||
      !processedData.length ||
      !selectedTable.settings.pagination
    )
      return 1;
    return Math.ceil(
      processedData.length / selectedTable.settings.itemsPerPage
    );
  }, [processedData, selectedTable]);

  if (isLoading) {
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
          <h1 className="text-2xl font-bold text-foreground">Preview Tables</h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            View and manage your dynamic table data
          </p>
        </div>

        {/* Table Selection */}
        <Select value={selectedTable?._id || "default"} onValueChange={handleTableSelect}>
          <SelectTrigger className="w-full md:w-[200px] bg-input border border-border"> 
            <SelectValue placeholder="Select a table" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default" disabled>
              Select a table
            </SelectItem>
            {Array.isArray(tables) && tables.length > 0 ? (
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

      {selectedTable ? (
        <Card className="overflow-hidden">
          {/* Table Controls */}
          <div className="border-b p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {selectedTable.settings.searchable && (
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              {selectedTable.settings.filterable && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 flex items-center" leftIcon={<Filter className="h-4 w-4" />}>
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Filter Data</h3>
                      {selectedTable.columns.map((column) => (
                        <div key={column.name} className="space-y-2">
                          <label className="text-sm font-medium">
                            {column.name}
                          </label>
                          <Input
                            value={filters[column.name] || ""}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                [column.name]: e.target.value,
                              })
                            }
                            placeholder={`Filter by ${column.name}`}
                          />
                        </div>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              )}

              {selectedTable.settings.exportable && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={exportToCSV}
                  leftIcon={<Download className="h-4 w-4" />}
                >
                  Export
                </Button>
              )}
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {selectedTable.columns.map((column) => (
                    <TableHead key={column.name}>
                      <div className="flex items-center gap-2">
                        {column.name}
                        {selectedTable.settings.sortable && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-4 hover:bg-transparent"
                            onClick={() =>
                              setSortConfig({
                                key: column.name,
                                direction:
                                  sortConfig?.key === column.name &&
                                    sortConfig.direction === "asc"
                                    ? "desc"
                                    : "asc",
                              })
                            }
                          >
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={selectedTable.columns.length}
                      className="h-24 text-center"
                    >
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={selectedTable.columns.length}
                      className="h-24 text-center"
                    >
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row) => (
                    <TableRow key={row._id}>
                      {selectedTable.columns.map((column, colIndex) => {
                        // Check if this is the first column (usually company name) and if it has company details
                        const isCompanyNameColumn = colIndex === 0;
                        const hasCompanyDetails = isCompanyNameColumn && companyDetailsMap[row._id];
                        const formattedValue = formatCellValue(row[column.name], column.type);
                        
                        return (
                          <TableCell key={column.name}>
                            {isCompanyNameColumn && hasCompanyDetails ? (
                              <Link 
                                href={`/admin/company/${companyDetailsMap[row._id]}`}
                                className="text-primary hover:underline font-medium"
                              >
                                {formattedValue}
                              </Link>
                            ) : (
                              formattedValue
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {selectedTable.settings.pagination && (
            <div className="border-t p-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    currentPage ===
                    Math.ceil(
                      processedData.length / selectedTable.settings.itemsPerPage
                    )
                  }
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <SlidersHorizontal className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">No Table Selected</h2>
          <p className="text-muted-foreground">
            Please select a table from the dropdown above to view its data
          </p>
        </Card>
      )}
    </div>
  );
}

// Helper function to format cell values based on column type
function formatCellValue(value: string | number | boolean | Date | undefined | null, type: string): string {
  if (value === undefined || value === null) return "";

  switch (type) {
    case "date":
      return value instanceof Date ? value.toLocaleDateString() : new Date(String(value)).toLocaleDateString();
    case "boolean":
      return Boolean(value) ? "Yes" : "No";
    default:
      return String(value);
  }
}
