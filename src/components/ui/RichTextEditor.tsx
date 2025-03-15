"use client";

import { Textarea } from "@/components/ui/Textarea";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// This is a simple placeholder for a rich text editor
// In a real application, you would integrate a proper rich text editor like TipTap, Slate, or CKEditor
export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={8}
      className="min-h-[200px]"
    />
  );
}
