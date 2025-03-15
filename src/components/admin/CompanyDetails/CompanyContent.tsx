import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the rich text editor to avoid SSR issues
const RichTextEditor = dynamic(() => import("@/components/ui/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 border rounded-md bg-gray-50 animate-pulse" />
  ),
});

interface ContentItem {
  title: string;
  body: string;
  order: number;
}

interface ContentProps {
  data: ContentItem[];
  onChange: (data: ContentItem[]) => void;
}

export default function CompanyContent({ data, onChange }: ContentProps) {
  const addContent = () => {
    const newOrder =
      data.length > 0 ? Math.max(...data.map((item) => item.order)) + 1 : 0;

    onChange([...data, { title: "", body: "", order: newOrder }]);
  };

  const removeContent = (index: number) => {
    const newContent = [...data];
    newContent.splice(index, 1);
    onChange(newContent);
  };

  const updateContent = (
    index: number,
    field: keyof ContentItem,
    value: string | number
  ) => {
    const newContent = [...data];
    newContent[index] = { ...newContent[index], [field]: value };
    onChange(newContent);
  };

  const moveContent = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === data.length - 1)
    ) {
      return;
    }

    const newContent = [...data];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    // Swap order values
    const tempOrder = newContent[index].order;
    newContent[index].order = newContent[newIndex].order;
    newContent[newIndex].order = tempOrder;

    // Swap positions in array
    [newContent[index], newContent[newIndex]] = [
      newContent[newIndex],
      newContent[index],
    ];

    onChange(newContent);
  };

  // Sort content by order
  const sortedContent = [...data].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Company Content</h2>
          <p className="text-sm text-muted-foreground">
            Add detailed content sections about the company
          </p>
        </div>
        <Button
          variant="outline"
          onClick={addContent}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Content
        </Button>
      </div>

      {sortedContent.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No content sections added yet</p>
          <Button
            variant="outline"
            onClick={addContent}
            className="mt-4"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add First Section
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedContent.map((content, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-2 w-full">
                    <label className="text-sm font-medium">Section Title</label>
                    <Input
                      value={content.title}
                      onChange={(e) =>
                        updateContent(index, "title", e.target.value)
                      }
                      placeholder="e.g., About Us, Our Mission, etc."
                    />
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveContent(index, "up")}
                      disabled={index === 0}
                      leftIcon={<MoveUp className="w-4 h-4" />}
                    >
                      Up
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveContent(index, "down")}
                      disabled={index === sortedContent.length - 1}
                      leftIcon={<MoveDown className="w-4 h-4" />}
                    >
                      Down
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeContent(index)}
                      leftIcon={<Trash2 className="w-4 h-4" />}
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <RichTextEditor
                    value={content.body}
                    onChange={(value) => updateContent(index, "body", value)}
                    placeholder="Enter rich text content here..."
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
