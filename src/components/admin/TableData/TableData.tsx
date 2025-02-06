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

// Add type for form data
type FormData = Record<string, string | number | boolean>;

export default function TableData() {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch available tables on component mount
  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch("/api/tables");
      if (!response.ok) throw new Error("Failed to fetch tables");
      const data = await response.json();
      setTables(data);
    } catch (error) {
      toast.error("Failed to fetch tables");
      console.error(error);
    }
  };

  // Dynamic form validation schema based on selected table
  const createValidationSchema = (table: Table | null) => {
    if (!table) return z.object({});

    const columnValidations = table.columns.reduce<Record<string, z.ZodTypeAny>>((acc, column) => {
      if (column.type === 'select' && (!column.options || column.options.length === 0)) {
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
            ? z.string().min(1, "This field is required").or(z.literal("<p></p>").transform(() => ""))
            : z.string().optional().or(z.literal("<p></p>").transform(() => ""));
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
      toast.error(error instanceof Error ? error.message : "Failed to add table data");
      console.error("Error adding table data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Add Table Data</h1>
          <p className="text-muted-foreground">
            Select a table and add new records
          </p>
        </div>
      </div>

      {/* Table Selection */}
      <Card className="p-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium">Select Table</label>
          <Select
            onValueChange={handleTableSelect}
            value={selectedTable?._id || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a table" />
            </SelectTrigger>
            <SelectContent>
              {tables.map((table) => (
                <SelectItem key={table._id} value={table._id}>
                  {table.tableName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Dynamic Form */}
      {selectedTable && (
        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {selectedTable.columns.map((column, index) => (
              <div key={index} className="space-y-2">
                <label className="block text-sm font-medium">
                  {column.name}
                  {column.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {/* Render appropriate input based on column type */}
                {renderFormField(column, register)}

                {errors[column.name] && (
                  <p className="text-sm text-red-500">
                    {errors[column.name]?.message as string}
                  </p>
                )}
              </div>
            ))}

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                leftIcon={<Save className="w-4 h-4" />}
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

// Update renderFormField types
function renderFormField(
  column: Column,
  register: ReturnType<typeof useForm>['register']
) {
  const fieldProps = register(column.name);

  switch (column.type) {
    case "richtext":
      return (
        <RichTextEditor
          {...fieldProps}
          value={fieldProps.value || ""}
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
          value={fieldProps.value || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${column.name}`} />
          </SelectTrigger>
          <SelectContent>
            {column.options?.map((option) => (
              <SelectItem key={option} value={option}>
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
          className="rounded border-gray-300"
        />
      );

    case "date":
      return (
        <input
          type="datetime-local"
          {...fieldProps}
          className="w-full p-2 border rounded-md"
          onChange={(e) => {
            const value = e.target.value;
            fieldProps.onChange({ target: { value: value || "" } });
          }}
        />
      );

    case "number":
      return (
        <input
          type="number"
          {...fieldProps}
          className="w-full p-2 border rounded-md"
        />
      );

    case "textarea":
      return (
        <textarea
          {...fieldProps}
          className="w-full p-2 border rounded-md min-h-[100px]"
          placeholder={`Enter ${column.name}`}
        />
      );

    case "url":
      return (
        <input
          type="url"
          {...fieldProps}
          className="w-full p-2 border rounded-md"
          placeholder="https://example.com"
        />
      );

    case "email":
      return (
        <input
          type="email"
          {...fieldProps}
          className="w-full p-2 border rounded-md"
          placeholder="email@example.com"
        />
      );

    default:
      return (
        <input
          type="text"
          {...fieldProps}
          className="w-full p-2 border rounded-md"
          placeholder={`Enter ${column.name}`}
        />
      );
  }
}   
