import { Input } from "@/components/ui/Input";
import RichTextEditor from "@/components/ui/RichTextEditor";

interface BasicInfoProps {
  data: {
    description: string;
    industry: string;
    founded: string;
    headquarters: string;
    ceo: string;
    employees: string;
    website: string;
  };
  onChange: (data: BasicInfoProps["data"]) => void;
}

export default function CompanyBasicInfo({ data, onChange }: BasicInfoProps) {
  const handleChange = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Basic Information</h2>
      <p className="text-sm text-muted-foreground">
        Enter general information about the company
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <RichTextEditor
            value={data.description}
            onChange={(value) => handleChange("description", value)}
            placeholder="Enter company description..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Industry</label>
          <Input
            value={data.industry}
            onChange={(e) => handleChange("industry", e.target.value)}
            placeholder="e.g., Technology, Finance, Healthcare"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Founded</label>
          <Input
            value={data.founded}
            onChange={(e) => handleChange("founded", e.target.value)}
            placeholder="e.g., 2010"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Headquarters</label>
          <Input
            value={data.headquarters}
            onChange={(e) => handleChange("headquarters", e.target.value)}
            placeholder="e.g., New York, USA"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">CEO</label>
          <Input
            value={data.ceo}
            onChange={(e) => handleChange("ceo", e.target.value)}
            placeholder="CEO name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Employees</label>
          <Input
            value={data.employees}
            onChange={(e) => handleChange("employees", e.target.value)}
            placeholder="e.g., 1,000-5,000"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Website</label>
          <Input
            value={data.website}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="e.g., https://example.com"
            type="url"
          />
        </div>
      </div>
    </div>
  );
}
