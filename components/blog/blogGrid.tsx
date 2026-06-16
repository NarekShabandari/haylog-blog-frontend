import { BlogCard } from "./blogCard";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  readTime: number;
  date: string;
}

export function BlogGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.slug} {...post} />
      ))}
    </div>
  );
}
