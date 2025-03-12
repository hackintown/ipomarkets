import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface LogoProps {
  data: {
    url: string;
    alt: string;
  };
  onChange: (data: any) => void;
}

export default function CompanyLogo({ data, onChange }: LogoProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // This would be replaced with actual upload functionality
  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      // This would be the URL returned from your upload service
      handleChange("url", "https://placehold.co/400x200/00913e/FFFFFF/png?text=Company+Logo");
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Company Logo</h2>
      <p className="text-sm text-muted-foreground">
        Upload or provide a URL for the company logo
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Logo URL</label>
            <Input
              value={data.url}
              onChange={(e) => handleChange("url", e.target.value)}
              placeholder="Enter logo URL"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Alt Text</label>
            <Input
              value={data.alt}
              onChange={(e) => handleChange("alt", e.target.value)}
              placeholder="Descriptive text for the logo"
            />
          </div>

          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleUpload}
              disabled={isUploading}
              leftIcon={<Upload className="w-4 h-4" />}
            >
              {isUploading ? "Uploading..." : "Upload New Logo"}
            </Button>
          </div>
        </div>

        <Card className="p-4 flex items-center justify-center">
          {data.url ? (
            <div className="relative">
              <Image
                src={data.url}
                alt={data.alt || "Company logo"}
                width={200}
                height={100}
                className="object-contain"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 rounded-full p-1 h-auto"
                onClick={() => handleChange("url", "")}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No logo uploaded</p>
              <p className="text-sm">Upload a logo or provide a URL</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
} 