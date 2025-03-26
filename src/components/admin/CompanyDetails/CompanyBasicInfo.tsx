import { Input } from "@/components/ui/Input";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Button } from "@/components/ui/Button";
import { 
  Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, 
  Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Heading1, Heading2, Heading3 
} from 'lucide-react';

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

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: data.description,
    onUpdate: ({ editor }) => {
      handleChange('description', editor.getHTML());
    },
  });

  const addImage = () => {
    const url = window.prompt('URL');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    if (editor) {
      const previousUrl = editor.getAttributes('link').href;
      const url = window.prompt('URL', previousUrl);
      
      if (url === null) {
        return;
      }
      
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }
      
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
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
          
          {editor && (
            <div className="border rounded-md mb-2">
              <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={editor?.isActive('bold') ? 'bg-gray-200' : ''}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={editor?.isActive('italic') ? 'bg-gray-200' : ''}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className={editor?.isActive('underline') ? 'bg-gray-200' : ''}
                >
                  <UnderlineIcon className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={setLink}
                  className={editor.isActive('link') ? 'bg-gray-200' : ''}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={addImage}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                  className={editor?.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                  className={editor?.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                  className={editor?.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={editor?.isActive('bulletList') ? 'bg-gray-200' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={editor?.isActive('orderedList') ? 'bg-gray-200' : ''}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={editor?.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
                >
                  <Heading1 className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}
                >
                  <Heading3 className="h-4 w-4" />
                </Button>
              </div>
              <EditorContent editor={editor} className="p-3 min-h-[150px]" />
            </div>
          )}
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
