// app/[locale]/page.tsx

import { BlogGrid } from "@/components/blog/blogGrid";
import { MainSection } from "@/components/layout/mainSection";

export default function HomePage() {
  return (
    <MainSection>
      <BlogGrid posts={posts} />
    </MainSection>
  );
}

// Single post page — narrow layout
<MainSection narrow>
  <article>...</article>
</MainSection>;
