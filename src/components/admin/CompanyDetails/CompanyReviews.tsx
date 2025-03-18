import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Trash2, MoveUp, MoveDown, Star, List, Table, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import dynamic from "next/dynamic";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

// Dynamically import the rich text editor to avoid SSR issues
const RichTextEditor = dynamic(() => import("@/components/ui/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 border rounded-md bg-gray-50 animate-pulse" />
  ),
});

// Define a type for table data
interface TableData {
  [key: string]: string | number | boolean | null;
}

interface ReviewItem {
  title: string;
  content: string;
  rating: number;
  author: string;
  date: string;
  type: "table" | "list" | "content";
  listItems?: string[];
  tableData?: TableData[];
}

interface ReviewsProps {
  data: ReviewItem[];
  onChange: (data: ReviewItem[]) => void;
}

export default function CompanyReviews({ data, onChange }: ReviewsProps) {
  const [activeReviewIndex, setActiveReviewIndex] = useState<number | null>(null);
  const [newListItem, setNewListItem] = useState("");
  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: string;
  } | null>(null);

  const addReview = () => {
    const newReview: ReviewItem = {
      title: "",
      content: "",
      rating: 5,
      author: "",
      date: new Date().toISOString().split("T")[0],
      type: "content",
      listItems: [],
      tableData: [{}],
    };

    onChange([...data, newReview]);
    setActiveReviewIndex(data.length);
  };

  const removeReview = (index: number) => {
    const newReviews = [...data];
    newReviews.splice(index, 1);
    onChange(newReviews);
    setActiveReviewIndex(null);
  };

  const updateReview = (
    index: number,
    field: keyof ReviewItem,
    value: ReviewItem[keyof ReviewItem]
  ) => {
    const newReviews = [...data];
    newReviews[index][field] = value as never;
    onChange(newReviews);
  };

  const moveReview = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === data.length - 1)
    ) {
      return;
    }

    const newReviews = [...data];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    [newReviews[index], newReviews[newIndex]] = [
      newReviews[newIndex],
      newReviews[index],
    ];

    onChange(newReviews);
    setActiveReviewIndex(newIndex);
  };

  // List item management
  const addListItem = (index: number) => {
    if (!newListItem.trim()) return;

    const review = data[index];
    const listItems = [...(review.listItems || []), newListItem];

    updateReview(index, "listItems", listItems);
    setNewListItem("");
  };

  const removeListItem = (reviewIndex: number, itemIndex: number) => {
    const review = data[reviewIndex];
    const listItems = [...(review.listItems || [])];
    listItems.splice(itemIndex, 1);

    updateReview(reviewIndex, "listItems", listItems);
  };

  // Table management
  const addTableColumn = (reviewIndex: number) => {
    const columnName = prompt("Enter column name:");
    if (!columnName) return;

    const review = data[reviewIndex];
    const tableData = [...(review.tableData || [{}])];

    const newData = tableData.map((row) => ({
      ...row,
      [columnName]: "",
    }));

    updateReview(reviewIndex, "tableData", newData);
  };

  const addTableRow = (reviewIndex: number) => {
    const review = data[reviewIndex];
    const tableData = [...(review.tableData || [{}])];

    if (tableData.length === 0 || Object.keys(tableData[0]).length === 0) {
      updateReview(reviewIndex, "tableData", [{ "Column 1": "" }]);
      return;
    }

    const newRow: TableData = {};
    Object.keys(tableData[0]).forEach((key) => {
      newRow[key] = "";
    });

    updateReview(reviewIndex, "tableData", [...tableData, newRow]);
  };

  const removeTableRow = (reviewIndex: number, rowIndex: number) => {
    const review = data[reviewIndex];
    const tableData = [...(review.tableData || [])];
    tableData.splice(rowIndex, 1);

    updateReview(reviewIndex, "tableData", tableData);
  };

  const removeTableColumn = (reviewIndex: number, columnName: string) => {
    const review = data[reviewIndex];
    const tableData = [...(review.tableData || [])];

    const newData = tableData.map((row) => {
      const newRow = { ...row };
      delete newRow[columnName];
      return newRow;
    });

    updateReview(reviewIndex, "tableData", newData);
  };

  const updateTableCell = (
    reviewIndex: number,
    rowIndex: number,
    columnName: string,
    value: string
  ) => {
    const review = data[reviewIndex];
    const tableData = [...(review.tableData || [])];

    tableData[rowIndex] = {
      ...tableData[rowIndex],
      [columnName]: value,
    };

    updateReview(reviewIndex, "tableData", tableData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Company Reviews</h2>
          <p className="text-sm text-muted-foreground">
            Add reviews with different content formats (text, lists, tables)
          </p>
        </div>
        <Button
          variant="outline"
          onClick={addReview}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Review
        </Button>
      </div>

      {data.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No reviews added yet</p>
          <Button
            variant="outline"
            onClick={addReview}
            className="mt-4"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add First Review
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {data.map((review, index) => (
            <Card key={index} className="p-4 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium truncate max-w-[200px] md:max-w-md">
                    {review.title || "Untitled Review"}
                  </h3>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setActiveReviewIndex(activeReviewIndex === index ? null : index)
                    }
                  >
                    {activeReviewIndex === index ? "Collapse" : "Expand"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveReview(index, "up")}
                    disabled={index === 0}
                    leftIcon={<MoveUp className="w-4 h-4" />}
                  >
                    Up
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveReview(index, "down")}
                    disabled={index === data.length - 1}
                    leftIcon={<MoveDown className="w-4 h-4" />}
                  >
                    Down
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeReview(index)}
                    leftIcon={<Trash2 className="w-4 h-4" />}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              {activeReviewIndex === index && (
                <div className="space-y-4 mt-4 border-t pt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Review Title</label>
                      <Input
                        value={review.title}
                        onChange={(e) =>
                          updateReview(index, "title", e.target.value)
                        }
                        placeholder="Enter review title"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Author</label>
                      <Input
                        value={review.author}
                        onChange={(e) =>
                          updateReview(index, "author", e.target.value)
                        }
                        placeholder="Enter author name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Input
                        type="date"
                        value={review.date}
                        onChange={(e) =>
                          updateReview(index, "date", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rating (1-5)</label>
                      <Select
                        value={review.rating.toString()}
                        onValueChange={(value) =>
                          updateReview(index, "rating", parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <SelectItem key={rating} value={rating.toString()}>
                              {rating} {rating === 1 ? "Star" : "Stars"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Content Type</label>
                      <div className="flex gap-2">
                        <Button
                          variant={review.type === "content" ? "primary" : "outline"}
                          size="sm"
                          onClick={() => updateReview(index, "type", "content")}
                          leftIcon={<FileText className="w-4 h-4" />}
                        >
                          Text
                        </Button>
                        <Button
                          variant={review.type === "list" ? "primary" : "outline"}
                          size="sm"
                          onClick={() => updateReview(index, "type", "list")}
                          leftIcon={<List className="w-4 h-4" />}
                        >
                          List
                        </Button>
                        <Button
                          variant={review.type === "table" ? "primary" : "outline"}
                          size="sm"
                          onClick={() => updateReview(index, "type", "table")}
                          leftIcon={<Table className="w-4 h-4" />}
                        >
                          Table
                        </Button>
                      </div>
                    </div>

                    {/* Content based on type */}
                    {review.type === "content" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Review Content</label>
                        <RichTextEditor
                          value={review.content}
                          onChange={(value) => updateReview(index, "content", value)}
                          placeholder="Enter review content..."
                        />
                      </div>
                    )}

                    {review.type === "list" && (
                      <div className="space-y-4">
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="text-sm font-medium">Add List Item</label>
                            <Input
                              value={newListItem}
                              onChange={(e) => setNewListItem(e.target.value)}
                              placeholder="Enter list item"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addListItem(index);
                                }
                              }}
                            />
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => addListItem(index)}
                            leftIcon={<Plus className="w-4 h-4" />}
                          >
                            Add
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">List Items</label>
                          {review.listItems && review.listItems.length > 0 ? (
                            <ul className="space-y-2 list-disc pl-5">
                              {review.listItems.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-center justify-between group">
                                  <span>{item}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeListItem(index, itemIndex)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">No items added yet</p>
                          )}
                        </div>
                      </div>
                    )}

                    {review.type === "table" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium">Table Data</label>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addTableRow(index)}
                              leftIcon={<Plus className="w-4 h-4" />}
                            >
                              Add Row
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addTableColumn(index)}
                              leftIcon={<Plus className="w-4 h-4" />}
                            >
                              Add Column
                            </Button>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          {review.tableData &&
                            review.tableData.length > 0 &&
                            Object.keys(review.tableData[0]).length > 0 ? (
                            <UITable>
                              <TableHeader>
                                <TableRow>
                                  {Object.keys(review.tableData[0]).map((column) => (
                                    <TableHead key={column}>
                                      <div className="flex items-center gap-2">
                                        {column}
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="p-0 h-4 hover:bg-transparent"
                                          onClick={() => removeTableColumn(index, column)}
                                        >
                                          <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                      </div>
                                    </TableHead>
                                  ))}
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {review.tableData.map((row, rowIndex) => (
                                  <TableRow key={rowIndex}>
                                    {Object.entries(row).map(([column, value]) => (
                                      <TableCell key={`${rowIndex}-${column}`}>
                                        {editingCell?.row === rowIndex &&
                                          editingCell?.col === column ? (
                                          <Input
                                            value={String(value || "")}
                                            onChange={(e) =>
                                              updateTableCell(
                                                index,
                                                rowIndex,
                                                column,
                                                e.target.value
                                              )
                                            }
                                            onBlur={() => setEditingCell(null)}
                                            autoFocus
                                          />
                                        ) : (
                                          <div
                                            className="cursor-pointer p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                                            onClick={() =>
                                              setEditingCell({
                                                row: rowIndex,
                                                col: column,
                                              })
                                            }
                                          >
                                            {String(value) || "-"}
                                          </div>
                                        )}
                                      </TableCell>
                                    ))}
                                    <TableCell>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeTableRow(index, rowIndex)}
                                        className="text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </UITable>
                          ) : (
                            <div className="text-center p-4 border rounded-md">
                              <p className="text-muted-foreground">No table data</p>
                              <div className="flex justify-center gap-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addTableRow(index)}
                                >
                                  Add Row
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addTableColumn(index)}
                                >
                                  Add Column
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 