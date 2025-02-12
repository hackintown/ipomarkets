"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Trash2, Save, Eye, Edit, Settings2, Database, Table as TableIcon, Info, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { Tooltip } from "@/components/ui/Tooltip/Tooltip";

// Validation schema for the form
const tableSchema = z.object({
  tableName: z.string().min(3, "Table name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  columns: z.array(z.object({
    name: z.string().min(2, "Column name must be at least 2 characters"),
    type: z.enum(["text", "number", "date", "select", "boolean", "email", "url", "phone", "textarea", "richtext"]),
    required: z.boolean(),
    unique: z.boolean().optional(),
    defaultValue: z.string().optional(),
    placeholder: z.string().optional(),
    options: z.union([z.string(), z.array(z.string())]).optional(),
    validation: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
    }).optional(),
  })).min(1, "At least one column is required"),
  settings: z.object({
    sortable: z.boolean(),
    filterable: z.boolean(),
    searchable: z.boolean(),
    pagination: z.boolean(),
    itemsPerPage: z.number().min(1),
    exportable: z.boolean(),
  }),
});

type TableFormData = z.infer<typeof tableSchema>;

interface Table extends TableFormData {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse {
  success: boolean;
  data: Table[];
  count: number;
}

/**
 * CreateTable Component
 * Provides an interface for creating and managing dynamic data tables
 * Features:
 * - Dynamic column creation with multiple data types
 * - Table settings configuration
 * - Preview mode
 * - Mobile-responsive design
 */
export default function CreateTable() {
  const [previewMode, setPreviewMode] = useState(false);
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTable, setEditingTable] = useState<Table | null>(null);

  const { register, control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<TableFormData>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      tableName: "",
      description: "",
      columns: [{ name: "", type: "text", required: true }],
      settings: {
        sortable: true,
        filterable: true,
        searchable: true,
        pagination: true,
        itemsPerPage: 10,
        exportable: true,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  const watchFieldArray = watch("columns");
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray[index],
  }));

  // Add useEffect for initial table fetch
  useEffect(() => {
    fetchTables();
  }, []);

  // Fetch existing tables
  const fetchTables = async () => {
    try {
      setIsLoading(true);
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

  // Handle form submission
  const onSubmit = async (data: TableFormData) => {
    try {
      const transformedData = {
        ...data,
        columns: data.columns.map(column => {
          if (column.type === "select" && column.options) {
            return {
              ...column,
              options: typeof column.options === "string"
                ? (column.options as string).split(",").map((opt: string) => opt.trim())
                : column.options
            };
          }
          return column;
        })
      };

      const url = editingTable
        ? `/api/tables/${editingTable._id}`
        : "/api/tables";

      const response = await fetch(url, {
        method: editingTable ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save table");
      }

      await fetchTables();
      toast.success(editingTable ? "Table updated successfully" : "Table created successfully");
      reset();
      setEditingTable(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save table");
      console.error("Error saving table:", error);
    }
  };

  // Handle table deletion
  const handleDeleteTable = async (id: string) => {
    if (!confirm("Are you sure you want to delete this table?")) return;

    try {
      const response = await fetch(`/api/tables/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete table");

      toast.success("Table deleted successfully!");
      fetchTables();
    } catch (error) {
      toast.error("Failed to delete table");
      console.error(error);
    }
  };

  // Edit table handler
  const handleEditTable = (table: Table) => {
    setEditingTable(table);
    setValue("tableName", table.tableName);
    setValue("description", table.description);
    setValue("columns", table.columns);
    setValue("settings", table.settings);
  };

  // Enhanced validation schema with common field types
  const columnTypes = [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "select", label: "Select" },
    { value: "boolean", label: "Boolean" },
    { value: "email", label: "Email" },
    { value: "url", label: "URL" },
    { value: "phone", label: "Phone" },
    { value: "textarea", label: "Text Area" },
    { value: "richtext", label: "Rich Text" }
  ];

  // Add this preview component
  const TablePreview = ({ data }: { data: TableFormData }) => {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">{data.tableName}</h3>
            <p className="text-sm text-muted-foreground">{data.description}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  {data.columns.map((column, index) => (
                    <th key={index} className="p-2 text-left border">
                      {column.name}
                      {column.required && <span className="text-destructive">*</span>}
                      <div className="text-xs text-muted-foreground">
                        {column.type}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {data.columns.map((column, index) => (
                    <td key={index} className="p-2 border">
                      <div className="text-sm text-muted-foreground">
                        {column.placeholder || `Sample ${column.type} data`}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            {Object.entries(data.settings)
              .filter(([, value]) => value === true)
              .map(([key]) => (
                <span key={key} className="bg-primary/10 text-primary px-2 py-1 rounded">
                  {key}
                </span>
              ))}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            {editingTable ? "Edit Table" : "Create New Table"}
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Define your table structure with custom fields
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            leftIcon={<Eye className="w-4 h-4 mx-1" />}
          >
            {previewMode ? "Edit Mode" : "Preview"}
          </Button>
        </div>
      </div>

      {previewMode ? (
        <TablePreview data={watch()} />
      ) : (
        <Card className="p-3 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Basic Info Section */}
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  Table Name
                  <Tooltip content="Unique identifier for your table">
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </Tooltip>
                </label>
                <input
                  {...register("tableName")}
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., customers, orders, products"
                />
                {errors.tableName && (
                  <p className="text-sm text-red-500">{errors.tableName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  {...register("description")}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter table description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* Column Builder Section */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Database className="w-4 h-4 sm:w-5 sm:h-5" />
                  Table Columns
                </h3>
                <Button
                  type="button"
                  onClick={() => append({
                    name: "",
                    type: "text",
                    required: true,
                    unique: false,
                    defaultValue: "",
                    placeholder: "",
                    validation: {}
                  })}
                  variant="outline"
                  className="w-full sm:w-auto"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Column
                </Button>
              </div>

              {/* Column List */}
              <div className="space-y-3 sm:space-y-4">
                {controlledFields.map((field, index) => (
                  <div key={field.id} className="relative p-3 sm:p-4 border rounded-lg bg-background">
                    {/* Column Header */}
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Column {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-destructive"
                        leftIcon={<Trash2 className="w-4 h-4 mx-1" />}
                      >
                        Remove
                      </Button>
                    </div>

                    {/* Column Fields Grid */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <input
                          {...register(`columns.${index}.name`)}
                          placeholder="Column name"
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <select
                          {...register(`columns.${index}.type`)}
                          className="w-full p-2 border rounded-md"
                        >
                          {columnTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          {...register(`columns.${index}.required`)}
                          className="rounded border-gray-300"
                        />
                        <label className="text-sm">Required</label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Settings Section */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                Table Settings
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register("settings.sortable")}
                      className="rounded border-gray-300"
                    />
                    <span>Sortable Columns</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register("settings.filterable")}
                      className="rounded border-gray-300"
                    />
                    <span>Filterable</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register("settings.searchable")}
                      className="rounded border-gray-300"
                    />
                    <span>Searchable</span>
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register("settings.pagination")}
                      className="rounded border-gray-300"
                    />
                    <span>Enable Pagination</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="number"
                      {...register("settings.itemsPerPage")}
                      className="w-20 p-1 border rounded"
                    />
                    <span>Items per page</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register("settings.exportable")}
                      className="rounded border-gray-300"
                    />
                    <span>Enable Export</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                className="w-full sm:w-auto"
                leftIcon={<RefreshCw className="w-4 h-4 mx-1" />}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="primary"
                leftIcon={<Save className="w-4 h-4 mx-1" />}
              >
                {editingTable ? "Update Table" : "Create Table"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Existing Tables Grid */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
          <TableIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          Existing Tables
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : Array.isArray(tables) && tables.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tables.map((table) => (
              <Card key={table._id} className="p-3 sm:p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{table.tableName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {table.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTable(table)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteTable(table._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Columns:</span>{" "}
                    {table.columns.length}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {table.settings.sortable && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Sortable
                      </span>
                    )}
                    {table.settings.filterable && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Filterable
                      </span>
                    )}
                    {table.settings.searchable && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Searchable
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 sm:p-8 text-center">
            <Database className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Tables Found</h3>
            <p className="text-muted-foreground">
              Create your first table using the form above
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}