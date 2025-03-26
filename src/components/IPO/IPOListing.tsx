"use client";

import type React from "react";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Search, Filter, ArrowUpDown, Download, RefreshCw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// Types from PreviewTables
interface TableType {
  _id: string;
  tableName: string;
  description: string;
  columns: Column[];
  settings: TableSettings;
}

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

type TableRowType = Record<string, string | number | boolean>;

// Add this interface for company details
interface CompanyDetail {
  companyId: string;
  _id: string;
}

export default function IPOListing() {
  // State management
  const [tables, setTables] = useState<TableType[]>([]);
  const [tableData, setTableData] = useState<Record<string, TableRowType[]>>(
    {}
  );
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {}
  );
  const [currentPages, setCurrentPages] = useState<Record<string, number>>({});
  const [sortConfigs, setSortConfigs] = useState<
    Record<string, { key: string; direction: "asc" | "desc" } | null>
  >({});
  const [filters, setFilters] = useState<
    Record<string, Record<string, string>>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("");
  const [companyDetailsMap, setCompanyDetailsMap] = useState<Record<string, string>>({});

  const fetchTables = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tables");

      // Check if response is OK and is JSON
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Try to parse as JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API did not return JSON");
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setTables(result.data);
        // Initialize states for each table
        const initialPages: Record<string, number> = {};
        const initialSearches: Record<string, string> = {};
        const initialSortConfigs: Record<
          string,
          { key: string; direction: "asc" | "desc" } | null
        > = {};
        const initialFilters: Record<string, Record<string, string>> = {};

        result.data.forEach((table: TableType) => {
          initialPages[table._id] = 1;
          initialSearches[table._id] = "";
          initialSortConfigs[table._id] = null;
          initialFilters[table._id] = {};
          // Fetch data for each table
          fetchTableData(table._id);
        });

        setCurrentPages(initialPages);
        setSearchQueries(initialSearches);
        setSortConfigs(initialSortConfigs);
        setFilters(initialFilters);

        // Set the first table as active tab
        if (result.data.length > 0) {
          setActiveTab(result.data[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
      toast.error("Using mock data - API unavailable");

      // Initialize with mock data
      const initialPages: Record<string, number> = {};
      const initialSearches: Record<string, string> = {};
      const initialSortConfigs: Record<
        string,
        { key: string; direction: "asc" | "desc" } | null
      > = {};
      const initialFilters: Record<string, Record<string, string>> = {};

      setCurrentPages(initialPages);
      setSearchQueries(initialSearches);
      setSortConfigs(initialSortConfigs);
      setFilters(initialFilters);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add this function to fetch company details mapping
  const fetchCompanyDetailsMapping = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchTables();
    fetchCompanyDetailsMapping();
  }, [fetchTables, fetchCompanyDetailsMapping]);

  const fetchTableData = async (tableId: string) => {
    try {
      const response = await fetch(`/api/table-data?tableId=${tableId}`);

      // Check if response is OK and is JSON
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Try to parse as JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API did not return JSON");
      }

      const result = await response.json();

      setTableData((prev) => ({
        ...prev,
        [tableId]: Array.isArray(result.data) ? result.data : [],
      }));
    } catch (error) {
      console.error("Error fetching table data:", error);

      toast.error(`No mock data available for ${tableId}`);
      setTableData((prev) => ({ ...prev, [tableId]: [] }));
    }
  };

  const refreshData = (tableId: string) => {
    fetchTableData(tableId);
    toast.success("Data refreshed successfully");
  };

  const exportData = (tableId: string) => {
    const table = tables.find((t) => t._id === tableId);
    if (!table) return;

    const data = processedData[tableId] || [];
    const csvContent = [
      table.columns.map((col) => col.name).join(","),
      ...data.map((row) =>
        table.columns.map((col) => String(row[col.name] || "")).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${table.tableName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${table.tableName} successfully`);
  };

  // Process data with search, sort, and filters
  const processedData = useMemo(() => {
    const processed: Record<string, TableRowType[]> = {};

    tables.forEach((table) => {
      let data = [...(tableData[table._id] || [])];
      const searchQuery = searchQueries[table._id] || "";
      const tableFilters = filters[table._id] || {};
      const sortConfig = sortConfigs[table._id];

      // Apply search
      if (searchQuery && table.settings.searchable) {
        data = data.filter((row) =>
          Object.entries(row).some(([, value]) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }

      // Apply filters
      if (Object.keys(tableFilters).length > 0 && table.settings.filterable) {
        data = data.filter((row) =>
          Object.entries(tableFilters).every(
            ([key, value]) =>
              !value || String(row[key]).toLowerCase() === value.toLowerCase()
          )
        );
      }

      // Apply sorting
      if (sortConfig && table.settings.sortable) {
        data.sort((a, b) => {
          const aValue = a[sortConfig.key];
          const bValue = b[sortConfig.key];
          const direction = sortConfig.direction === "asc" ? 1 : -1;

          if (typeof aValue === "number" && typeof bValue === "number") {
            return (aValue - bValue) * direction;
          }
          return String(aValue).localeCompare(String(bValue)) * direction;
        });
      }

      processed[table._id] = data;
    });

    return processed;
  }, [tables, tableData, searchQueries, filters, sortConfigs]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    const paginated: Record<string, TableRowType[]> = {};

    tables.forEach((table) => {
      if (!table.settings.pagination) {
        paginated[table._id] = processedData[table._id] || [];
        return;
      }

      const currentPage = currentPages[table._id] || 1;
      const startIndex = (currentPage - 1) * table.settings.itemsPerPage;
      paginated[table._id] = (processedData[table._id] || []).slice(
        startIndex,
        startIndex + table.settings.itemsPerPage
      );
    });

    return paginated;
  }, [processedData, currentPages, tables]);

  // Loading state
  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <Skeleton className="h-12 w-48 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-6" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-6" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // No tables found
  if (tables.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-bold mb-2">No Tables Found</h2>
        <p className="text-muted-foreground mb-4">
          No data tables are currently available.
        </p>
        <Button onClick={() => fetchTables()}>Refresh</Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IPO Listings</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all available IPO data tables
          </p>
        </div>
        <Button
          onClick={() => fetchTables()}
          leftIcon={<RefreshCw className="h-4 w-4" />}
        >
          Refresh All
        </Button>
      </div>

      {tables.length > 1 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full sm:w-auto overflow-x-auto flex-nowrap">
            {tables.map((table) => (
              <TabsTrigger
                key={table._id}
                value={table._id}
                className="whitespace-nowrap"
              >
                {table.tableName}
              </TabsTrigger>
            ))}
          </TabsList>

          {tables.map((table) => (
            <TabsContent key={table._id} value={table._id} className="mt-0">
              <TableDisplay
                table={table}
                data={paginatedData[table._id] || []}
                processedData={processedData[table._id] || []}
                searchQuery={searchQueries[table._id] || ""}
                currentPage={currentPages[table._id] || 1}
                sortConfig={sortConfigs[table._id]}
                tableFilters={filters[table._id] || {}}
                onSearch={(value) =>
                  setSearchQueries((prev) => ({ ...prev, [table._id]: value }))
                }
                onSort={(key) => {
                  const currentSort = sortConfigs[table._id];
                  setSortConfigs((prev) => ({
                    ...prev,
                    [table._id]: {
                      key,
                      direction:
                        currentSort?.key === key &&
                          currentSort.direction === "asc"
                          ? "desc"
                          : "asc",
                    },
                  }));
                }}
                onFilter={(key, value) =>
                  setFilters((prev) => ({
                    ...prev,
                    [table._id]: { ...(prev[table._id] || {}), [key]: value },
                  }))
                }
                onPageChange={(page) =>
                  setCurrentPages((prev) => ({ ...prev, [table._id]: page }))
                }
                onRefresh={() => refreshData(table._id)}
                onExport={() => exportData(table._id)}
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        // Single table view
        tables.map((table) => (
          <TableDisplay
            key={table._id}
            table={table}
            data={paginatedData[table._id] || []}
            processedData={processedData[table._id] || []}
            searchQuery={searchQueries[table._id] || ""}
            currentPage={currentPages[table._id] || 1}
            sortConfig={sortConfigs[table._id]}
            tableFilters={filters[table._id] || {}}
            onSearch={(value) =>
              setSearchQueries((prev) => ({ ...prev, [table._id]: value }))
            }
            onSort={(key) => {
              const currentSort = sortConfigs[table._id];
              setSortConfigs((prev) => ({
                ...prev,
                [table._id]: {
                  key,
                  direction:
                    currentSort?.key === key && currentSort.direction === "asc"
                      ? "desc"
                      : "asc",
                },
              }));
            }}
            onFilter={(key, value) =>
              setFilters((prev) => ({
                ...prev,
                [table._id]: { ...(prev[table._id] || {}), [key]: value },
              }))
            }
            onPageChange={(page) =>
              setCurrentPages((prev) => ({ ...prev, [table._id]: page }))
            }
            onRefresh={() => refreshData(table._id)}
            onExport={() => exportData(table._id)}
          />
        ))
      )}
    </div>
  );
}

interface TableDisplayProps {
  table: TableType;
  data: TableRowType[];
  processedData: TableRowType[];
  searchQuery: string;
  currentPage: number;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  tableFilters: Record<string, string>;
  onSearch: (value: string) => void;
  onSort: (key: string) => void;
  onFilter: (key: string, value: string) => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  onExport: () => void;
}

function TableDisplay({
  table,
  data,
  processedData,
  searchQuery,
  currentPage,
  sortConfig,
  tableFilters,
  onSearch,
  onSort,
  onFilter,
  onPageChange,
  onRefresh,
  onExport,
}: TableDisplayProps) {
  const activeFiltersCount = Object.values(tableFilters).filter(Boolean).length;
  const [companyDetailsMap, setCompanyDetailsMap] = useState<Record<string, string>>({});

  // Fetch company details mapping when component mounts
  useEffect(() => {
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

    fetchCompanyDetailsMapping();
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-bold">
              {table.tableName}
            </CardTitle>
            <CardDescription className="mt-1">
              {table.description}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}

              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Refresh
            </Button>

            {table.settings.exportable && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}

                leftIcon={<Download className="h-4 w-4" />}
              >
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="p-4 border-b bg-card">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {table.settings.searchable && (
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search all columns..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              {table.settings.filterable && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" leftIcon={<Filter className="h-4 w-4" />}>
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filter Data</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      {table.columns.map((column) => (
                        <div key={column.name} className="space-y-2">
                          <label className="text-sm font-medium">
                            {column.name}
                          </label>
                          {column.options ? (
                            <Select
                              value={tableFilters[column.name] || ""}
                              onValueChange={(value) =>
                                onFilter(column.name, value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={`Filter by ${column.name}`}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {column.options.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              placeholder={`Filter by ${column.name}`}
                              value={tableFilters[column.name] || ""}
                              onChange={(e) =>
                                onFilter(column.name, e.target.value)
                              }
                            />
                          )}
                        </div>
                      ))}

                      {activeFiltersCount > 0 && (
                        <Button
                          variant="outline"
                          className="w-full mt-4"
                          onClick={() =>
                            table.columns.forEach((col) =>
                              onFilter(col.name, "")
                            )
                          }
                        >
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              )}

              {table.settings.pagination && (
                <Select
                  value={String(currentPage)}
                  onValueChange={(value) => onPageChange(Number(value))}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Page" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({
                      length:
                        Math.ceil(
                          processedData.length / table.settings.itemsPerPage
                        ) || 1,
                    }).map((_, i) => (
                      <SelectItem key={i} value={String(i + 1)}>
                        Page {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                {table.columns.map((column) => (
                  <TableHead key={column.name} className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {column.name}
                      {table.settings.sortable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-4 hover:bg-transparent"
                          onClick={() => onSort(column.name)}
                        >
                          <ArrowUpDown
                            className={`h-3 w-3 ${sortConfig?.key === column.name
                              ? "text-primary"
                              : "text-muted-foreground"
                              }`}
                          />
                        </Button>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((row, rowIdx) => (
                  <TableRow key={rowIdx} className="hover:bg-muted/30">
                    {table.columns.map((column, colIndex) => {
                      // Check if this is the first column (usually company name) and if it has company details
                      const isCompanyNameColumn = colIndex === 0;
                      const rowId = String(row._id); // Convert to string to use as index
                      const hasCompanyDetails = isCompanyNameColumn && rowId in companyDetailsMap;

                      return (
                        <TableCell key={column.name} className="py-3">
                          {isCompanyNameColumn && hasCompanyDetails ? (
                            <Link
                              href={`/company-details/${companyDetailsMap[rowId]}`}
                              className="text-primary hover:underline font-medium"
                            >
                              {formatCellValue(row[column.name], column.type)}
                            </Link>
                          ) : (
                            formatCellValue(row[column.name], column.type)
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.columns.length}
                    className="h-24 text-center"
                  >
                    {searchQuery || activeFiltersCount > 0 ? (
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-muted-foreground">
                          No results found
                        </p>
                        <Button
                          variant="link"
                          onClick={() => {
                            onSearch("");
                            table.columns.forEach((col) =>
                              onFilter(col.name, "")
                            );
                          }}
                          className="mt-2"
                        >
                          Clear all filters
                        </Button>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No data available</p>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {table.settings.pagination && processedData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t p-4 gap-4">
            <div className="text-sm text-muted-foreground order-2 sm:order-1">
              Showing{" "}
              {Math.min(
                (currentPage - 1) * table.settings.itemsPerPage + 1,
                processedData.length
              )}{" "}
              to{" "}
              {Math.min(
                currentPage * table.settings.itemsPerPage,
                processedData.length
              )}{" "}
              of {processedData.length} results
            </div>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={
                  currentPage * table.settings.itemsPerPage >=
                  processedData.length
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to format cell values based on type
function formatCellValue(
  value: string | number | boolean | undefined | null,
  type: string
): React.ReactNode {
  if (value === undefined || value === null) return "-";

  switch (type.toLowerCase()) {
    case "boolean":
      return value ? "Yes" : "No";
    case "date":
      return new Date(String(value)).toLocaleDateString();
    case "price":
    case "currency":
      return typeof value === "number"
        ? `$${value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
        : value;
    case "percentage":
      return typeof value === "number"
        ? `${value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}%`
        : value;
    case "status":
      return (
        <Badge variant={getStatusVariant(String(value))}>{String(value)}</Badge>
      );
    default:
      return String(value);
  }
}

// Helper function to determine badge variant based on status
function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  const lowercaseStatus = status.toLowerCase();
  if (
    lowercaseStatus.includes("active") ||
    lowercaseStatus.includes("success") ||
    lowercaseStatus.includes("approved")
  ) {
    return "default";
  } else if (
    lowercaseStatus.includes("pending") ||
    lowercaseStatus.includes("processing")
  ) {
    return "secondary";
  } else if (
    lowercaseStatus.includes("failed") ||
    lowercaseStatus.includes("error") ||
    lowercaseStatus.includes("rejected")
  ) {
    return "destructive";
  }
  return "outline";
}
