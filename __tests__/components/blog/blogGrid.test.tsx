import { render, screen } from "@testing-library/react";
import { BlogGrid } from "@/components/blog/blogGrid";

// Mock BlogCard so we can verify it receives each post
jest.mock("@/components/blog/blogCard", () => ({
  BlogCard: ({ slug, title }: { slug: string; title: string }) => (
    <article data-testid={`card-${slug}`}>{title}</article>
  ),
}));

const makePosts = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    slug: `post-${i}`,
    title: `Post ${i}`,
    title_hy: `Հոդված ${i}`,
    cover_image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    author: "Author",
    author_id: `author-${i}`,
    content: "content",
    content_hy: "բովանդակություն",
    created_at: "2024-01-01T00:00:00.000Z",
    id: `id-${i}`,
    meta_description: "desc",
    meta_description_hy: "նկ",
    published: true,
    tags: ["tag"],
    updated_at: "2024-01-01T00:00:00.000Z",
  }));

describe("BlogGrid", () => {
  it("renders a card for each post", () => {
    const posts = makePosts(3);
    render(<BlogGrid posts={posts} />);
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("passes the correct title to each BlogCard", () => {
    const posts = makePosts(2);
    render(<BlogGrid posts={posts} />);
    expect(screen.getByText("Post 0")).toBeInTheDocument();
    expect(screen.getByText("Post 1")).toBeInTheDocument();
  });

  it("renders nothing (empty grid) when posts array is empty", () => {
    const { container } = render(<BlogGrid posts={[]} />);
    const grid = container.firstChild as HTMLElement;
    expect(grid.children).toHaveLength(0);
  });

  it("uses a responsive grid container", () => {
    const { container } = render(<BlogGrid posts={makePosts(1)} />);
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain("grid");
  });
});
