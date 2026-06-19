export interface Post {
  id: string;
  slug: string;
  title: string;
  title_hy: string;
  content: string;
  content_hy: string;
  cover_image: string;
  author: string;
  author_id: string;
  meta_description: string;
  meta_description_hy: string;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}
