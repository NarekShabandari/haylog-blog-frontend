import { BlogPostClient } from "@/components/blog/blogPostClient";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  return <BlogPostClient slug={slug} locale={locale} />;
}
