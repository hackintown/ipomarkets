"use client";
import React from "react";
import { motion } from "framer-motion";
import BlogPostCard from "@/components/Blogs/BlogPostCard";
import { Button } from "@/components/ui/Button";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import Link from "next/link";
import { BlogPost } from "@/lib/blog/type";

interface AllBlogPostsProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: AllBlogPostsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6 lg:space-y-12 lg:mt-16 py-10 bg-card"
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-center tracking-tight sm:text-4xl lg:text-5xl mb-4">
          Our Blog&nbsp;
          <span className="text-primary mt-2">Insights</span>
        </h2>
        <p className="mt-2 max-w-3xl mx-auto text-base font-light lg:text-lg text-muted-foreground text-center mb-8">
          Discover industry insights, technical deep-dives, and expert
          perspectives from our team.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No posts available at the moment.
        </p>
      ) : (
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {posts.slice(0, 3).map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <BlogPostCard post={post} />
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center">
            <Link href="/blogs">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<IoArrowForwardCircleOutline className="size-6" />}
              >
                View All Posts
              </Button>
            </Link>
          </div>
        </div>
      )}
    </motion.section>
  );
}
