import BlogSection from "@/components/Home/BlogSection";
import Hero from "@/components/Home/Hero/Hero";
import IPOListing from "@/components/IPO/IPOListing";
import { getBlogPosts } from "@/lib/blog/api";
import { BlogPost } from "@/lib/blog/type";
import FAQ from "@/components/ui/FAQ";
export default async function Home() {
  let blogPosts: BlogPost[] = [];
  try {
    blogPosts = await getBlogPosts();
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
  }
  return (
    <section>
      <Hero />
      <IPOListing />
      <BlogSection posts={blogPosts} />
      <FAQ />
    </section>
  );
}
