import { render } from "@testing-library/react";

import { JsonLd } from "@/components/seo/json-ld";

describe("JsonLd", () => {
  it("renders valid and escaped JSON-LD", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: "<script>alert('test')</script>",
    };

    const { container } = render(<JsonLd data={data} />);

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );

    expect(script).toBeInTheDocument();
    expect(script?.textContent).not.toContain("<script>");
    expect(JSON.parse(script?.textContent ?? "")).toEqual(data);
  });
});