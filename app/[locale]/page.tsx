"use client";

import { BlogGrid } from "@/components/blog/blogGrid";
import { MainSection } from "@/components/layout/mainSection";
import { usePosts } from "@/hooks/queries/usePosts";

export default function HomePage() {
  const { data: posts, isLoading, isError } = usePosts();

  if (isLoading) return <p>Loading...</p>;

  // if (isError)
  //   return (
  //     <div>
  //       <p>Failed to load posts</p>
  //       {/* Shows exact error in dev so you can debug */}
  //       <pre className="font-mono text-xs text-red-500">
  //         {(error as any)?.response?.status} —{" "}
  //         {JSON.stringify((error as any)?.response?.data, null, 2)}
  //       </pre>
  //     </div>
  //   );

  if (!posts?.length) return <p>No posts found.</p>;

  return (
    <MainSection>
      <div></div>
      <BlogGrid posts={posts} />
    </MainSection>
  );
}

// Single post page — narrow layout
<MainSection narrow>
  <article>...</article>
</MainSection>;
