import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Upload, Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import Image from "next/image";

interface ImageItem {
  url: string;
  caption: string;
}

interface ImagesProps {
  data: ImageItem[];
  onChange: (data: ImageItem[]) => void;
}

export default function CompanyImages({ data, onChange }: ImagesProps) {
  const [isUploading, setIsUploading] = useState(false);

  const addImage = () => {
    onChange([...data, { url: "", caption: "" }]);
  };

  const removeImage = (index: number) => {
    const newImages = [...data];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const updateImage = (
    index: number,
    field: keyof ImageItem,
    value: string
  ) => {
    const newImages = [...data];
    newImages[index] = { ...newImages[index], [field]: value };
    onChange(newImages);
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === data.length - 1)
    ) {
      return;
    }

    const newImages = [...data];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    [newImages[index], newImages[newIndex]] = [
      newImages[newIndex],
      newImages[index],
    ];
    onChange(newImages);
  };

  // This would be replaced with actual upload functionality
  const handleUpload = (index: number) => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      // This would be the URL returned from your upload service
      updateImage(
        index,
        "url",
        `https://placehold.co/600x400/00913e/FFFFFF/png?text=Image+${index + 1}`
      );
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Company Images</h2>
          <p className="text-sm text-muted-foreground">
            Add images related to the company
          </p>
        </div>
        <Button
          variant="outline"
          onClick={addImage}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Image
        </Button>
      </div>

      {data.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No images added yet</p>
          <Button
            variant="outline"
            onClick={addImage}
            className="mt-4"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add First Image
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {data.map((image, index) => (
            <Card key={index} className="p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image URL</label>
                    <Input
                      value={image.url}
                      onChange={(e) =>
                        updateImage(index, "url", e.target.value)
                      }
                      placeholder="Enter image URL"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Caption</label>
                    <Input
                      value={image.caption}
                      onChange={(e) =>
                        updateImage(index, "caption", e.target.value)
                      }
                      placeholder="Image description"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpload(index)}
                      disabled={isUploading}
                      leftIcon={<Upload className="w-4 h-4" />}
                    >
                      Upload
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveImage(index, "up")}
                      disabled={index === 0}
                      leftIcon={<MoveUp className="w-4 h-4" />}
                    >
                      Move Up
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => moveImage(index, "down")}
                      disabled={index === data.length - 1}
                      leftIcon={<MoveDown className="w-4 h-4" />}
                    >
                      Move Down
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeImage(index)}
                      leftIcon={<Trash2 className="w-4 h-4" />}
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md p-4">
                  {image.url ? (
                    <div className="relative">
                      <Image
                        src={image.url}
                        alt={image.caption || `Company image ${index + 1}`}
                        width={300}
                        height={200}
                        className="object-contain max-h-[200px]"
                      />
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <p>No image</p>
                      <p className="text-sm">
                        Upload an image or provide a URL
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
