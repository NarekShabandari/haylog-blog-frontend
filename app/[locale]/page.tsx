"use client";

import { BlogGrid } from "@/components/blog/blogGrid";
import { MainSection } from "@/components/layout/mainSection";
import { usePosts } from "@/hooks/queries/usePosts";

export default function HomePage() {
  const { data: posts } = usePosts();

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
