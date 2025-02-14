"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/Card";
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
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import { toast } from "react-hot-toast";

// Types from PreviewTables
interface Table {
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

type TableRow = Record<string, string | number | boolean>;

export default function IPOListing() {
    // State management
    const [tables, setTables] = useState<Table[]>([]);
    const [tableData, setTableData] = useState<Record<string, TableRow[]>>({});
    const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
    const [currentPages, setCurrentPages] = useState<Record<string, number>>({});
    const [sortConfigs, setSortConfigs] = useState<
        Record<string, { key: string; direction: "asc" | "desc" } | null>
    >({});
    const [filters, setFilters] = useState<Record<string, Record<string, string>>>({});

    const fetchTables = useCallback(async () => {
        try {
            const response = await fetch("/api/tables");
            if (!response.ok) throw new Error("Failed to fetch tables");
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

                result.data.forEach((table: Table) => {
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
            }
        } catch (error) {
            console.error("Error fetching tables:", error);
            toast.error("Failed to fetch tables");
        }
    }, []);

    useEffect(() => {
        fetchTables();
    }, [fetchTables]);

    const fetchTableData = async (tableId: string) => {
        try {
            const response = await fetch(`/api/table-data?tableId=${tableId}`);
            if (!response.ok) throw new Error("Failed to fetch table data");
            const result = await response.json();
            setTableData(prev => ({
                ...prev,
                [tableId]: Array.isArray(result.data) ? result.data : []
            }));
        } catch (error) {
            console.error("Error fetching table data:", error);
            toast.error("Failed to fetch table data");
            setTableData(prev => ({ ...prev, [tableId]: [] }));
        }
    };

    // Process data with search, sort, and filters
    const processedData = useMemo(() => {
        const processed: Record<string, TableRow[]> = {};

        tables.forEach(table => {
            let data = [...(tableData[table._id] || [])];
            const searchQuery = searchQueries[table._id] || "";
            const tableFilters = filters[table._id] || {};
            const sortConfig = sortConfigs[table._id];

            // Apply search
            if (searchQuery && table.settings.searchable) {
                data = data.filter(row =>
                    Object.entries(row).some(([, value]) =>
                        String(value).toLowerCase().includes(searchQuery.toLowerCase())
                    )
                );
            }

            // Apply filters
            if (Object.keys(tableFilters).length > 0 && table.settings.filterable) {
                data = data.filter(row =>
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
        const paginated: Record<string, TableRow[]> = {};

        tables.forEach(table => {
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

    return (
        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {tables.map(table => (
                <Card key={table._id} className="p-6">
                    <div className="space-y-4">
                        {/* Table Header */}
                        <div>
                            <h2 className="text-2xl font-bold">{table.tableName}</h2>
                            <p className="text-muted-foreground mt-1">{table.description}</p>
                        </div>

                        {/* Search and Filter Controls */}
                        <div className="flex flex-wrap items-center gap-4">
                            {table.settings.searchable && (
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search..."
                                        className="pl-9"
                                        value={searchQueries[table._id] || ""}
                                        onChange={e =>
                                            setSearchQueries(prev => ({
                                                ...prev,
                                                [table._id]: e.target.value
                                            }))
                                        }
                                    />
                                </div>
                            )}

                            {table.settings.filterable && (
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            leftIcon={<Filter className="h-4 w-4" />}
                                        >
                                            Filters
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent>
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Filter Data</h3>
                                            {table.columns.map(column => (
                                                <div key={column.name} className="space-y-2">
                                                    <label className="text-sm font-medium">
                                                        {column.name}
                                                    </label>
                                                    <Input
                                                        placeholder={`Filter by ${column.name}`}
                                                        value={
                                                            (filters[table._id] || {})[column.name] || ""
                                                        }
                                                        onChange={e =>
                                                            setFilters(prev => ({
                                                                ...prev,
                                                                [table._id]: {
                                                                    ...(prev[table._id] || {}),
                                                                    [column.name]: e.target.value
                                                                }
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            )}
                        </div>

                        {/* Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {table.columns.map(column => (
                                            <TableHead key={column.name}>
                                                <div className="flex items-center gap-2">
                                                    {column.name}
                                                    {table.settings.sortable && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="p-0 h-4 hover:bg-transparent"
                                                            onClick={() => {
                                                                const currentSort = sortConfigs[table._id];
                                                                setSortConfigs(prev => ({
                                                                    ...prev,
                                                                    [table._id]: {
                                                                        key: column.name,
                                                                        direction:
                                                                            currentSort?.key === column.name &&
                                                                                currentSort.direction === "asc"
                                                                                ? "desc"
                                                                                : "asc"
                                                                    }
                                                                }));
                                                            }}
                                                        >
                                                            <ArrowUpDown className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(paginatedData[table._id] || []).map((row, rowIdx) => (
                                        <TableRow key={rowIdx}>
                                            {table.columns.map(column => (
                                                <TableCell key={column.name}>
                                                    {String(row[column.name] || "")}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {table.settings.pagination && (
                            <div className="flex items-center justify-between border-t pt-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing{" "}
                                    {Math.min(
                                        ((currentPages[table._id] || 1) - 1) *
                                        table.settings.itemsPerPage +
                                        1,
                                        (processedData[table._id] || []).length
                                    )}{" "}
                                    to{" "}
                                    {Math.min(
                                        (currentPages[table._id] || 1) * table.settings.itemsPerPage,
                                        (processedData[table._id] || []).length
                                    )}{" "}
                                    of {(processedData[table._id] || []).length} results
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPages(prev => ({
                                                ...prev,
                                                [table._id]: Math.max(1, (prev[table._id] || 1) - 1)
                                            }))
                                        }
                                        disabled={(currentPages[table._id] || 1) <= 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPages(prev => ({
                                                ...prev,
                                                [table._id]: (prev[table._id] || 1) + 1
                                            }))
                                        }
                                        disabled={
                                            ((currentPages[table._id] || 1) *
                                                table.settings.itemsPerPage) >=
                                            (processedData[table._id] || []).length
                                        }
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            ))}
        </div>
    );
} 