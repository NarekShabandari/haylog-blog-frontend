import { render, screen } from "@testing-library/react";
import { BlogCard } from "@/components/blog/blogCard";

// next/image → plain <img>, stripping Next.js-only boolean props
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    fill: _fill,
    priority: _priority,
    ...rest
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...rest} />
  ),
}));

// next/link → plain <a>
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

// useParams — English locale by default
const mockUseParams = jest.fn(() => ({ locale: "en" }));
jest.mock("next/navigation", () => ({
  useParams: () => mockUseParams(),
}));

const basePost = {
  slug: "my-test-post",
  title: "My Test Post",
  title_hy: "Իմ Թեստ Հոդվածը",
  cover_image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  author: "John Doe",
  author_id: "author-1",
  content: "English content here.",
  content_hy: "Armenian content here.",
  created_at: "2024-03-15T10:00:00.000Z",
  id: "post-1",
  meta_description: "A test post description",
  meta_description_hy: "Թեստ հոդվածի նկարագրություն",
  published: true,
  tags: ["javascript", "react"],
  updated_at: "2024-03-16T10:00:00.000Z",
};

describe("BlogCard", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ locale: "en" });
  });

  it("renders the English title when locale is en", () => {
    render(<BlogCard {...basePost} />);
    expect(screen.getByRole("heading", { name: "My Test Post" })).toBeInTheDocument();
  });

  it("renders the Armenian title when locale is hy", () => {
    mockUseParams.mockReturnValue({ locale: "hy" });
    render(<BlogCard {...basePost} />);
    expect(screen.getByRole("heading", { name: "Իմ Թեստ Հոդվածը" })).toBeInTheDocument();
  });

  it("renders the cover image with correct alt text", () => {
    render(<BlogCard {...basePost} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "My Test Post");
    expect(img).toHaveAttribute("src", basePost.cover_image);
  });

  it("renders the first tag", () => {
    render(<BlogCard {...basePost} />);
    expect(screen.getByText("javascript")).toBeInTheDocument();
  });

  it("renders a formatted date", () => {
    render(<BlogCard {...basePost} />);
    // Mar 15, 2024
    expect(screen.getByText(/Mar 15, 2024/)).toBeInTheDocument();
  });

  it("wraps the card in a link to /blog/:slug", () => {
    render(<BlogCard {...basePost} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/blog/${basePost.slug}`);
  });

  it("renders an <article> element", () => {
    const { container } = render(<BlogCard {...basePost} />);
    expect(container.querySelector("article")).toBeInTheDocument();
  });
});
