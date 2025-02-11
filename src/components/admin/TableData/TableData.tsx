"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Save } from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// Dynamic import of the rich text editor to avoid SSR issues
const RichTextEditor = dynamic(() => import("@/components/ui/RichTextEditor"), {
  ssr: false,
});

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

interface ApiResponse {
  success: boolean;
  data: Table[];
  count: number;
}

// Add type for form data
type FormData = Record<string, string | number | boolean>;

export default function TableData() {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTables();
  }, []);

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

  // Dynamic form validation schema based on selected table
  const createValidationSchema = (table: Table | null) => {
    if (!table) return z.object({});

    const columnValidations = table.columns.reduce<
      Record<string, z.ZodTypeAny>
    >((acc, column) => {
      if (
        column.type === "select" &&
        (!column.options || column.options.length === 0)
      ) {
        throw new Error(`Select field "${column.name}" must have options`);
      }

      let validation: z.ZodTypeAny;

      switch (column.type) {
        case "number":
          validation = column.required
            ? z.coerce.number({ required_error: "This field is required" })
            : z.coerce.number().optional();
          break;

        case "email":
          validation = column.required
            ? z.string().email("Invalid email address")
            : z.string().email("Invalid email address").optional();
          break;

        case "url":
          validation = column.required
            ? z.string().url("Invalid URL")
            : z.string().url("Invalid URL").optional();
          break;

        case "date":
          validation = column.required
            ? z.string().min(1, "This field is required")
            : z.string().optional();
          break;

        case "boolean":
          validation = z.boolean().optional();
          if (column.required) {
            validation = z.boolean();
          }
          break;

        case "select":
          validation = column.required
            ? z.string({ required_error: "Please select an option" })
            : z.string().optional();
          if (column.options) {
            validation = column.required
              ? z.enum(column.options as [string, ...string[]], {
                required_error: "Please select an option",
              })
              : z.enum(column.options as [string, ...string[]]).optional();
          }
          break;

        case "richtext":
          validation = column.required
            ? z
              .string()
              .min(1, "This field is required")
              .or(z.literal("<p></p>").transform(() => ""))
            : z
              .string()
              .optional()
              .or(z.literal("<p></p>").transform(() => ""));
          break;

        case "textarea":
          validation = column.required
            ? z.string().min(1, "This field is required")
            : z.string().optional();
          break;

        default: // text and other types
          validation = column.required
            ? z.string().min(1, "This field is required")
            : z.string().optional();
      }

      return { ...acc, [column.name]: validation };
    }, {});

    return z.object(columnValidations);
  };

  // Update form setup with proper typing
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createValidationSchema(selectedTable)),
  });

  // Handle table selection
  const handleTableSelect = (tableId: string) => {
    const table = tables.find((t) => t._id === tableId);
    setSelectedTable(table || null);
    reset(); // Reset form when table changes
  };

  // Update onSubmit type
  const onSubmit = async (data: FormData) => {
    if (!selectedTable) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/table-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableId: selectedTable._id,
          data: data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add table data");
      }

      toast.success("Data added successfully");
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add table data"
      );
      console.error("Error adding table data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6 bg-background/50">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Add Table Data
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and manage your table records efficiently
          </p>
        </div>
      </div>

      {/* Enhanced Table Selection Card */}
      <Card className="p-4 md:p-6 bg-card border border-border/50 shadow-sm">
        <div className="space-y-4">
          <label className="text-sm font-medium text-card-foreground">
            Select Table
          </label>
          <Select
            onValueChange={handleTableSelect}
            value={selectedTable?._id || "default"}
          >
            <SelectTrigger className="w-full bg-input border-border/50 focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <SelectValue placeholder="Select a table" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/50">
              <SelectItem value="default" disabled className="text-muted-foreground">
                Select a table
              </SelectItem>
              {Array.isArray(tables) && tables.length > 0 ? (
                tables.map((table) => (
                  <SelectItem
                    key={table._id}
                    value={table._id}
                    className="hover:bg-accent hover:text-accent-foreground"
                  >
                    {table.tableName}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-tables" disabled className="text-muted-foreground">
                  No tables available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Enhanced Dynamic Form */}
      {selectedTable && (
        <Card className="p-4 md:p-6 bg-card border border-border/50 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {selectedTable.columns.map((column, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium text-card-foreground">
                    {column.name}
                    {column.required && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </label>

                  <div className="relative">
                    {renderFormField(column, register)}
                    {errors[column.name] && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors[column.name]?.message as string}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6 border-t border-border/50">
              <Button
                type="submit"
                disabled={isLoading}
                leftIcon={<Save className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />}
              >
                Add Record
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}

// Update renderFormField styles
function renderFormField(
  column: Column,
  register: ReturnType<typeof useForm>["register"]
) {
  const baseInputStyles = "w-full rounded-md border border-border/50 bg-input text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none transition-colors";
  const fieldProps = register(column.name);

  switch (column.type) {
    case "richtext":
      return (
        <RichTextEditor
          {...fieldProps}
          onChange={(value: string) => {
            fieldProps.onChange({ target: { value: value || "" } });
          }}
          placeholder={`Enter ${column.name}`}
        />
      );

    case "select":
      return (
        <Select
          onValueChange={(value) => fieldProps.onChange({ target: { value } })}
        >
          <SelectTrigger className={baseInputStyles}>
            <SelectValue placeholder={`Select ${column.name}`} />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border/50">
            {column.options?.map((option) => (
              <SelectItem
                key={option}
                value={option}
                className="hover:bg-accent hover:text-accent-foreground"
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "boolean":
      return (
        <input
          type="checkbox"
          {...fieldProps}
          className="rounded border-border/50 text-primary focus:ring-ring"
        />
      );

    case "textarea":
      return (
        <textarea
          {...fieldProps}
          className={`${baseInputStyles} min-h-[100px] resize-y`}
          placeholder={`Enter ${column.name}`}
        />
      );

    // For all other input types (text, number, email, url, date)
    default:
      return (
        <input
          type={column.type}
          {...fieldProps}
          className={`${baseInputStyles} h-10 px-3`}
          placeholder={getPlaceholder(column)}
        />
      );
  }
}

// Helper function for input placeholders
function getPlaceholder(column: Column): string {
  switch (column.type) {
    case "url":
      return "https://example.com";
    case "email":
      return "email@example.com";
    default:
      return `Enter ${column.name}`;
  }
}
