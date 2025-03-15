import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

interface LinkItem {
  title: string;
  url: string;
  type: string;
}

interface LinksProps {
  data: LinkItem[];
  onChange: (data: LinkItem[]) => void;
}

export default function CompanyLinks({ data, onChange }: LinksProps) {
  const linkTypes = [
    { value: "website", label: "Website" },
    { value: "social", label: "Social Media" },
    { value: "document", label: "Document" },
    { value: "news", label: "News Article" },
    { value: "investor", label: "Investor Relations" },
    { value: "other", label: "Other" },
  ];

  const addLink = () => {
    onChange([...data, { title: "", url: "", type: "website" }]);
  };

  const removeLink = (index: number) => {
    const newLinks = [...data];
    newLinks.splice(index, 1);
    onChange(newLinks);
  };

  const updateLink = (index: number, field: keyof LinkItem, value: string) => {
    const newLinks = [...data];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange(newLinks);
  };

  const moveLink = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === data.length - 1)
    ) {
      return;
    }

    const newLinks = [...data];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    [newLinks[index], newLinks[newIndex]] = [
      newLinks[newIndex],
      newLinks[index],
    ];
    onChange(newLinks);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Company Links</h2>
          <p className="text-sm text-muted-foreground">
            Add important links related to the company
          </p>
        </div>
        <Button
          variant="outline"
          onClick={addLink}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Link
        </Button>
      </div>

      {data.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No links added yet</p>
          <Button
            variant="outline"
            onClick={addLink}
            className="mt-4"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add First Link
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((link, index) => (
            <Card key={index} className="p-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Link Title</label>
                  <Input
                    value={link.title}
                    onChange={(e) => updateLink(index, "title", e.target.value)}
                    placeholder="e.g., Official Website"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">URL</label>
                  <Input
                    value={link.url}
                    onChange={(e) => updateLink(index, "url", e.target.value)}
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Link Type</label>
                  <Select
                    value={link.type}
                    onValueChange={(value) => updateLink(index, "type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select link type" />
                    </SelectTrigger>
                    <SelectContent>
                      {linkTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => moveLink(index, "up")}
                  disabled={index === 0}
                  leftIcon={<MoveUp className="w-4 h-4" />}
                >
                  Move Up
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => moveLink(index, "down")}
                  disabled={index === data.length - 1}
                  leftIcon={<MoveDown className="w-4 h-4" />}
                >
                  Move Down
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeLink(index)}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
