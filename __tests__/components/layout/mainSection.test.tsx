import { render, screen } from "@testing-library/react";
import { MainSection } from "@/components/layout/mainSection";

describe("MainSection", () => {
  it("renders children", () => {
    render(<MainSection>Hello world</MainSection>);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("uses wide max-width by default", () => {
    const { container } = render(<MainSection>content</MainSection>);
    const main = container.querySelector("main");
    expect(main).toHaveClass("max-w-6xl");
    expect(main).not.toHaveClass("max-w-4xl");
  });

  it("uses narrow max-width when narrow prop is set", () => {
    const { container } = render(<MainSection narrow>content</MainSection>);
    const main = container.querySelector("main");
    expect(main).toHaveClass("max-w-4xl");
    expect(main).not.toHaveClass("max-w-6xl");
  });

  it("applies extra className", () => {
    const { container } = render(
      <MainSection className="custom-class">content</MainSection>
    );
    expect(container.querySelector("main")).toHaveClass("custom-class");
  });

  it("renders a <main> element", () => {
    render(<MainSection>content</MainSection>);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
