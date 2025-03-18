import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Trash2, MoveUp, MoveDown, ExternalLink, Calendar, Clock } from "lucide-react";
import { Textarea } from "@/components/ui/Textarea";
import dynamic from "next/dynamic";

// Dynamically import the rich text editor to avoid SSR issues
const RichTextEditor = dynamic(() => import("@/components/ui/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 border rounded-md bg-gray-50 animate-pulse" />
  ),
});

interface NewsItem {
  title: string;
  url: string;
  date: string;
  time: string;
  description: string;
  content: string;
  source: string;
  order: number;
}

interface NewsProps {
  data: NewsItem[];
  onChange: (data: NewsItem[]) => void;
}

export default function CompanyNews({ data, onChange }: NewsProps) {
  const [activeNewsIndex, setActiveNewsIndex] = useState<number | null>(null);

  const addNews = () => {
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
    
    const newNews: NewsItem = {
      title: "",
      url: "",
      date: now.toISOString().split('T')[0],
      time: currentTime,
      description: "",
      content: "",
      source: "",
      order: data.length > 0 ? Math.max(...data.map(item => item.order)) + 1 : 0
    };
    
    onChange([...data, newNews]);
    setActiveNewsIndex(data.length);
  };

  const removeNews = (index: number) => {
    const newNewsItems = [...data];
    newNewsItems.splice(index, 1);
    onChange(newNewsItems);
    setActiveNewsIndex(null);
  };

  const updateNews = (
    index: number,
    field: keyof NewsItem,
    value: string | number
  ) => {
    const newNewsItems = [...data];
    newNewsItems[index] = { ...newNewsItems[index], [field]: value };
    onChange(newNewsItems);
  };

  const moveNews = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === data.length - 1)
    ) {
      return;
    }

    const newNewsItems = [...data];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    // Swap order values
    const tempOrder = newNewsItems[index].order;
    newNewsItems[index].order = newNewsItems[newIndex].order;
    newNewsItems[newIndex].order = tempOrder;

    // Swap positions in array
    [newNewsItems[index], newNewsItems[newIndex]] = [
      newNewsItems[newIndex],
      newNewsItems[index],
    ];
    
    onChange(newNewsItems);
    setActiveNewsIndex(newIndex);
  };

  // Sort news by order
  const sortedNews = [...data].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Company News</h2>
          <p className="text-sm text-muted-foreground">
            Add news articles and press releases related to the company
          </p>
        </div>
        <Button
          variant="outline"
          onClick={addNews}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add News
        </Button>
      </div>

      {data.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No news items added yet</p>
          <Button
            variant="outline"
            onClick={addNews}
            className="mt-4"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add First News Item
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedNews.map((newsItem, index) => (
            <Card key={index} className="p-4 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium truncate max-w-[200px] md:max-w-md">
                    {newsItem.title || "Untitled News"}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {newsItem.date || "No date"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {newsItem.time || "No time"}
                    </span>
                    {newsItem.source && (
                      <span>Source: {newsItem.source}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => 
                      setActiveNewsIndex(activeNewsIndex === index ? null : index)
                    }
                  >
                    {activeNewsIndex === index ? "Collapse" : "Expand"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveNews(index, "up")}
                    disabled={index === 0}
                    leftIcon={<MoveUp className="w-4 h-4" />}
                  >
                    Up
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveNews(index, "down")}
                    disabled={index === data.length - 1}
                    leftIcon={<MoveDown className="w-4 h-4" />}
                  >
                    Down
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeNews(index)}
                    leftIcon={<Trash2 className="w-4 h-4" />}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              {activeNewsIndex === index && (
                <div className="space-y-4 mt-4 border-t pt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">News Title</label>
                      <Input
                        value={newsItem.title}
                        onChange={(e) => 
                          updateNews(index, "title", e.target.value)
                        }
                        placeholder="Enter news title"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        URL <span className="text-muted-foreground">(optional)</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={newsItem.url}
                          onChange={(e) => 
                            updateNews(index, "url", e.target.value)
                          }
                          placeholder="Enter news URL"
                          type="url"
                        />
                        {newsItem.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(newsItem.url, "_blank")}
                            className="shrink-0"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Input
                        type="date"
                        value={newsItem.date}
                        onChange={(e) => 
                          updateNews(index, "date", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Time</label>
                      <Input
                        type="time"
                        value={newsItem.time}
                        onChange={(e) => 
                          updateNews(index, "time", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Source</label>
                      <Input
                        value={newsItem.source}
                        onChange={(e) => 
                          updateNews(index, "source", e.target.value)
                        }
                        placeholder="Enter news source (e.g., Reuters, Company Press Release)"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Short Description</label>
                    <Textarea
                      value={newsItem.description}
                      onChange={(e) => 
                        updateNews(index, "description", e.target.value)
                      }
                      placeholder="Enter a brief description of the news"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Content</label>
                    <RichTextEditor
                      value={newsItem.content}
                      onChange={(value) => updateNews(index, "content", value)}
                      placeholder="Enter the full news content..."
                    />
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