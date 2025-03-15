import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

// Define a type for table data to replace 'any'
interface TableData {
  [key: string]: string | number | boolean | null;
}

interface TableItem {
  title: string;
  data: TableData[];
}

interface TablesProps {
  data: TableItem[];
  onChange: (data: TableItem[]) => void;
}

export default function CompanyTables({ data, onChange }: TablesProps) {
  const [editingTable, setEditingTable] = useState<number | null>(null);
  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [tempTableData, setTempTableData] = useState<TableData[]>([]);
  const [tempTitle, setTempTitle] = useState("");

  const addTable = () => {
    onChange([...data, { title: "New Table", data: [{}] as TableData[] }]);
  };

  const removeTable = (index: number) => {
    const newTables = [...data];
    newTables.splice(index, 1);
    onChange(newTables);
  };

  const startEditingTable = (index: number) => {
    setEditingTable(index);
    setTempTableData([...data[index].data]);
    setTempTitle(data[index].title);
  };

  const saveTableChanges = () => {
    if (editingTable === null) return;

    const newTables = [...data];
    newTables[editingTable] = {
      title: tempTitle,
      data: tempTableData,
    };

    onChange(newTables);
    setEditingTable(null);
    setEditingCell(null);
  };

  const cancelEditing = () => {
    setEditingTable(null);
    setEditingCell(null);
  };

  const addRow = () => {
    if (editingTable === null) return;

    const newRow: TableData = {};
    // Copy structure from first row if it exists
    if (tempTableData.length > 0) {
      Object.keys(tempTableData[0]).forEach((key) => {
        newRow[key] = ""; // Now TypeScript knows newRow can be indexed with string
      });
    }

    setTempTableData([...tempTableData, newRow]);
  };

  const addColumn = () => {
    if (editingTable === null) return;

    const columnName = prompt("Enter column name:");
    if (!columnName) return;

    const newData = tempTableData.map((row) => ({
      ...row,
      [columnName]: "",
    }));

    setTempTableData(newData);
  };

  const removeColumn = (columnName: string) => {
    if (editingTable === null) return;

    const newData = tempTableData.map((row) => {
      const newRow = { ...row };
      delete newRow[columnName];
      return newRow;
    });

    setTempTableData(newData);
  };

  const removeRow = (rowIndex: number) => {
    if (editingTable === null) return;

    const newData = [...tempTableData];
    newData.splice(rowIndex, 1);
    setTempTableData(newData);
  };

  const updateCellValue = (
    rowIndex: number,
    columnName: string,
    value: string
  ) => {
    if (editingTable === null) return;

    const newData = [...tempTableData];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [columnName]: value,
    };

    setTempTableData(newData);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Company Tables</h2>
          <p className="text-sm text-muted-foreground">
            Add custom tables with company data
          </p>
        </div>
        <Button
          variant="outline"
          onClick={addTable}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Table
        </Button>
      </div>

      {data.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No tables added yet</p>
          <Button
            variant="outline"
            onClick={addTable}
            className="mt-4"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add First Table
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {data.map((table, index) => (
            <Card key={index} className="p-4">
              {editingTable === index ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Input
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      placeholder="Table title"
                      className="max-w-md"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addRow}
                        leftIcon={<Plus className="w-4 h-4" />}
                      >
                        Add Row
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addColumn}
                        leftIcon={<Plus className="w-4 h-4" />}
                      >
                        Add Column
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={saveTableChanges}
                        leftIcon={<Save className="w-4 h-4" />}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelEditing}
                        leftIcon={<X className="w-4 h-4" />}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {tempTableData.length > 0 &&
                    Object.keys(tempTableData[0]).length > 0 ? (
                      <UITable>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(tempTableData[0]).map((column) => (
                              <TableHead key={column}>
                                <div className="flex items-center gap-2">
                                  {column}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 h-4 hover:bg-transparent"
                                    onClick={() => removeColumn(column)}
                                  >
                                    <X className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableHead>
                            ))}
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tempTableData.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {Object.entries(row).map(
                                ([column, value], cellIndex) => (
                                  <TableCell key={`${rowIndex}-${column}`}>
                                    {editingCell?.row === rowIndex &&
                                    editingCell?.col === cellIndex ? (
                                      <Input
                                        value={String(value)}
                                        onChange={(e) =>
                                          updateCellValue(
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
                                            col: cellIndex,
                                          })
                                        }
                                      >
                                        {String(value) || "-"}
                                      </div>
                                    )}
                                  </TableCell>
                                )
                              )}
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeRow(rowIndex)}
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
                      <div className="text-center p-4">
                        <p className="text-muted-foreground">
                          No data in table
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addColumn}
                          className="mt-2"
                        >
                          Add Column
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{table.title}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditingTable(index)}
                        leftIcon={<Edit className="w-4 h-4" />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeTable(index)}
                        leftIcon={<Trash2 className="w-4 h-4" />}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {table.data.length > 0 &&
                    Object.keys(table.data[0]).length > 0 ? (
                      <UITable>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(table.data[0]).map((column) => (
                              <TableHead key={column}>{column}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {table.data.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {Object.values(row).map((value, cellIndex) => (
                                <TableCell key={`${rowIndex}-${cellIndex}`}>
                                  {String(value) || "-"}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </UITable>
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-muted-foreground">
                          No data in table
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditingTable(index)}
                          className="mt-2"
                        >
                          Edit Table
                        </Button>
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
