import { BlogCard } from "./blogCard";

interface Post {
  slug: string;
  title: string;
  cover_image: string;
  author: string;
  author_id: string;
  content: string;
  content_hy: string;
  created_at: string;
  id: string;
  meta_description: string;
  meta_description_hy: string;
  published: boolean;
  tags: string[];
  title_hy: string;
  updated_at: string;
}

export function BlogGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts?.map((post) => (
        <BlogCard key={post.slug} {...post} />
      ))}
    </div>
  );
}
