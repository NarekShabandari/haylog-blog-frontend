// app/[locale]/page.tsx

import { MainSection } from "@/components/layout/mainSection";

export default function HomePage() {
  return (
    <MainSection>
      <div></div>
      {/* <BlogGrid posts={posts} /> */}
    </MainSection>
  );
}

// Single post page — narrow layout
<MainSection narrow>
  <article>...</article>
</MainSection>;
