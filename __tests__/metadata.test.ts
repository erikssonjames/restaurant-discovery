import { describe, expect, it } from "@jest/globals";

import { createPageMetadata } from "@/lib/seo/metadata";

describe("createPageMetadata", () => {
  it("creates indexable page metadata", () => {
    const metadata = createPageMetadata({
      title: "About",
      description: "About the restaurant discovery website.",
      path: "/about",
    });

    expect(metadata.title).toBe("About");
    expect(metadata.description).toBe(
      "About the restaurant discovery website.",
    );

    const canonical = new URL(
      String(metadata.alternates?.canonical),
    );

    expect(canonical.pathname).toBe("/about");

    expect(metadata.robots).toMatchObject({
      index: true,
      follow: true,
    });
  });

  it("creates noindex metadata", () => {
    const metadata = createPageMetadata({
      title: "Search restaurants",
      description: "Search restaurants.",
      path: "/search",
      noIndex: true,
    });

    expect(metadata.robots).toMatchObject({
      index: false,
      follow: true,
    });
  });
});