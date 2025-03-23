"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import NextImage from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  Loader2,
  X,
  Upload,
  Tag,
  Pencil,
  Trash2,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  UnderlineIcon,
} from "lucide-react";
import { BlogPost } from "@/lib/blog/type";
import toast from "react-hot-toast";

interface CreateBlogPostProps {
  onPostCreatedAction?: (post: BlogPost) => Promise<void>;
  onPostUpdatedAction?: (post: BlogPost) => Promise<void>;
  onPostDeletedAction?: (postId: string) => Promise<void>;
}

interface EditorProps {
  editor: ReturnType<typeof useEditor> | null;
}

const MenuBar = ({ editor }: EditorProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 mb-2 border-b border-gray-200 bg-white rounded-t-lg">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("bold") ? "bg-gray-100" : ""
        }`}
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("italic") ? "bg-gray-100" : ""
        }`}
      >
        <Italic size={18} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleUnderline().run();
        }}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("underline") ? "bg-gray-100" : ""
        }`}
      >
        <UnderlineIcon size={18} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          const url = window.prompt("Enter the URL:");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("link") ? "bg-gray-100" : ""
        }`}
      >
        <LinkIcon size={18} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("bulletList") ? "bg-gray-100" : ""
        }`}
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("orderedList") ? "bg-gray-100" : ""
        }`}
      >
        <ListOrdered size={18} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("blockquote") ? "bg-gray-100" : ""
        }`}
      >
        <Quote size={18} />
      </button>
    </div>
  );
};

export default function CreateBlogPost({
  onPostCreatedAction = async () => {},
  onPostUpdatedAction = async () => {},
  onPostDeletedAction = async () => {},
}: CreateBlogPostProps) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_PRODUCTION_URL || "http://localhost:3000";

  const fetchBlogPosts = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/blogposts`);
      if (!response.ok) {
        throw new Error(`Failed to fetch blog posts: ${response.status}`);
      }
      const posts = await response.json();
      toast.success("Blog posts fetched successfully");
      setBlogPosts(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast.error("Failed to fetch blog posts. Please try again.");
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  const editorConfig = useMemo(
    () => ({
      extensions: [
        StarterKit,
        Image,
        Link.configure({
          openOnClick: false,
        }),
        Underline,
        Placeholder.configure({
          placeholder: "Write your blog post content here...",
        }),
      ],
      content: "",
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none",
        },
      },
    }),
    []
  );

  const editor = useEditor(editorConfig);

  useEffect(() => {
    if (editor && editingPost) {
      editor.commands.setContent(editingPost.content);
    }
  }, [editingPost, editor]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setImage(acceptedFiles[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!title.trim()) {
      setError("Title is required");
      setIsSubmitting(false);
      return;
    }

    if (!editor?.getHTML() || editor.getHTML() === "<p></p>") {
      setError("Content is required");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", editor?.getHTML() || "");
    formData.append("tags", JSON.stringify(tags));
    if (image) {
      formData.append("image", image);
    }

    try {
      let response;
      const headers = new Headers();
      headers.append("Accept", "application/json");

      if (editingPost) {
        response = await fetch(`${baseUrl}/api/blogposts/${editingPost._id}`, {
          method: "PUT",
          body: formData,
          headers,
        });
      } else {
        response = await fetch(`${baseUrl}/api/blogposts`, {
          method: "POST",
          body: formData,
          headers,
        });
      }

      if (response.ok) {
        const result = await response.json();
        console.log("Blog post operation successful:", result);

        if (editingPost) {
          toast.success("Blog post updated successfully!");
        } else {
          toast.success("Blog post created successfully!");
        }

        resetForm();
        if (editingPost) {
          if (typeof onPostUpdatedAction === "function") {
            await onPostUpdatedAction(result);
          }
        } else {
          if (typeof onPostCreatedAction === "function") {
            await onPostCreatedAction(result);
          }
        }
        fetchBlogPosts();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process blog post");
      }
    } catch (error) {
      console.error("Error processing blog post:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to process blog post. Please try again."
      );
      toast.error("Failed to process blog post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    editor?.commands.setContent("");
    setImage(null);
    setPreviewImage(null);
    setTags([]);
    setEditingPost(null);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    editor?.commands.setContent(post.content);
    setTags(post.tags);
    setPreviewImage(post.image || null);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`${baseUrl}/api/blogposts/${postId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          toast.success("Blog post deleted successfully!");

          if (typeof onPostDeletedAction === "function") {
            await onPostDeletedAction(postId);
          }
          fetchBlogPosts();
        } else {
          throw new Error("Failed to delete blog post");
        }
      } catch (error) {
        console.error("Error deleting blog post:", error);
        setError("Failed to delete blog post. Please try again.");
        toast.error("Failed to delete blog post. Please try again.");
      }
    }
  };

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const renderTagList = () => (
    <div className="mt-2 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <motion.span
          key={tag}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="inline-flex items-center bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-sm"
        >
          <Tag size={14} className="mr-1" />
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="ml-1 text-purple-600 hover:text-purple-800"
            aria-label={`Remove tag ${tag}`}
          >
            <X size={14} />
          </button>
        </motion.span>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-8 rounded-lg shadow-lg"
    >
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
      </h1>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 mb-4 p-3 bg-red-100 rounded-md"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
          />
        </div>
        <div className="prose-editor">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <div className="border rounded-lg overflow-hidden">
            <MenuBar editor={editor} />
            <EditorContent
              editor={editor}
              className="min-h-[300px] p-4 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image
          </label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors duration-200 ${
              isDragActive
                ? "border-purple-500 bg-purple-50"
                : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {previewImage ? (
              <div className="relative">
                <NextImage
                  src={previewImage}
                  alt="Preview"
                  width={384}
                  height={256}
                  className="mx-auto max-w-full h-auto rounded-md"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(null);
                    setPreviewImage(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="text-gray-500">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p>Drag & drop an image here, or click to select one</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tags
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="tags"
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              Add
            </button>
          </div>
          {renderTagList()}
        </div>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors duration-300 flex items-center justify-center"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin mr-2" size={20} />
          ) : editingPost ? (
            "Update Post"
          ) : (
            "Create Post"
          )}
        </motion.button>
        {editingPost && (
          <button
            type="button"
            onClick={resetForm}
            className="mt-4 w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-300"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
        Existing Blog Posts
      </h2>
      <div className="space-y-4">
        {blogPosts.map((post) => (
          <div key={post._id} className="border p-4 rounded-md">
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-gray-600 mt-2">
              {post.content.substring(0, 100)}...
            </p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEdit(post)}
                className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center"
              >
                <Pencil size={16} className="mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(post._id)}
                className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center"
              >
                <Trash2 size={16} className="mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
