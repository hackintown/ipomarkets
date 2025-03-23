// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
import BlogCMS from "@/components/Blogs/BlogCMS";
import CommentManager from "@/components/Comments/CommentManager";
import { getBlogPosts } from "@/lib/blog/api";

export default async function Dashboard() {
  //   const cookieStore = await cookies();
  //   const adminToken = cookieStore.get("admin_token");

  //   if (!adminToken) {
  //     redirect("/admin");
  //   }

  const blogPosts = await getBlogPosts();

  return (
    <div className="container space-y-12 px-4">
      <BlogCMS initialBlogPosts={blogPosts} />
      <CommentManager />
    </div>
  );
}
