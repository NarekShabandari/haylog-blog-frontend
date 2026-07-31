import { render, screen } from "@testing-library/react";
import { BlogPostClient } from "@/components/blog/blogPostClient";

// Mock the usePost hook
const mockUsePost = jest.fn();
jest.mock("@/hooks/queries/usePosts", () => ({
  usePost: (...args: unknown[]) => mockUsePost(...args),
}));

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

// next/navigation notFound throws to simulate 404 behaviour
jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

// react-markdown: render content as plain text so assertions are easy
jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <div data-testid="markdown">{children}</div>,
}));

// rehype/remark plugins are no-ops in test
jest.mock("rehype-highlight", () => () => {});
jest.mock("rehype-slug", () => () => {});
jest.mock("remark-gfm", () => () => {});

const samplePost = {
  slug: "hello-world",
  title: "Hello World",
  title_hy: "Բարև Աշխարհ",
  content: "# English content",
  content_hy: "# Armenian content",
  cover_image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  author: "Jane Smith",
  author_id: "jane",
  meta_description: "desc",
  meta_description_hy: "նկ",
  tags: ["nextjs", "react"],
  published: true,
  created_at: "2024-06-01T00:00:00.000Z",
  updated_at: "2024-06-02T00:00:00.000Z",
  id: "1",
};

describe("BlogPostClient", () => {
  it("renders a skeleton while loading", () => {
    mockUsePost.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    const { container } = render(<BlogPostClient slug="hello-world" locale="en" />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("throws to notFound() when there is an error", () => {
    mockUsePost.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    expect(() => render(<BlogPostClient slug="bad-slug" locale="en" />)).toThrow("NEXT_NOT_FOUND");
  });

  it("throws to notFound() when post is null", () => {
    mockUsePost.mockReturnValue({ data: null, isLoading: false, isError: false });
    expect(() => render(<BlogPostClient slug="missing" locale="en" />)).toThrow("NEXT_NOT_FOUND");
  });

  it("renders the English title when locale is en", () => {
    mockUsePost.mockReturnValue({ data: samplePost, isLoading: false, isError: false });
    render(<BlogPostClient slug="hello-world" locale="en" />);
    expect(screen.getByRole("heading", { level: 1, name: "Hello World" })).toBeInTheDocument();
  });

  it("renders the Armenian title when locale is hy", () => {
    mockUsePost.mockReturnValue({ data: samplePost, isLoading: false, isError: false });
    render(<BlogPostClient slug="hello-world" locale="hy" />);
    expect(screen.getByRole("heading", { level: 1, name: "Բարև Աշխարհ" })).toBeInTheDocument();
  });

  it("passes English content to ReactMarkdown when locale is en", () => {
    mockUsePost.mockReturnValue({ data: samplePost, isLoading: false, isError: false });
    render(<BlogPostClient slug="hello-world" locale="en" />);
    expect(screen.getByTestId("markdown").textContent).toBe("# English content");
  });

  it("passes Armenian content to ReactMarkdown when locale is hy", () => {
    mockUsePost.mockReturnValue({ data: samplePost, isLoading: false, isError: false });
    render(<BlogPostClient slug="hello-world" locale="hy" />);
    expect(screen.getByTestId("markdown").textContent).toBe("# Armenian content");
  });

  it("renders all post tags", () => {
    mockUsePost.mockReturnValue({ data: samplePost, isLoading: false, isError: false });
    render(<BlogPostClient slug="hello-world" locale="en" />);
    expect(screen.getByText("nextjs")).toBeInTheDocument();
    expect(screen.getByText("react")).toBeInTheDocument();
  });

  it("renders the author name", () => {
    mockUsePost.mockReturnValue({ data: samplePost, isLoading: false, isError: false });
    render(<BlogPostClient slug="hello-world" locale="en" />);
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("renders the author initial avatar", () => {
    mockUsePost.mockReturnValue({ data: samplePost, isLoading: false, isError: false });
    render(<BlogPostClient slug="hello-world" locale="en" />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("renders the cover image", () => {
    mockUsePost.mockReturnValue({ data: samplePost, isLoading: false, isError: false });
    render(<BlogPostClient slug="hello-world" locale="en" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", samplePost.cover_image);
  });

  it("calls usePost with the provided slug", () => {
    mockUsePost.mockReturnValue({ data: samplePost, isLoading: false, isError: false });
    render(<BlogPostClient slug="hello-world" locale="en" />);
    expect(mockUsePost).toHaveBeenCalledWith("hello-world");
  });
});
