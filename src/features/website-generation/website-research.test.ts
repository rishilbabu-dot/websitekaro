import { describe, expect, it } from "vitest";
import { extractPage, isSafePublicUrl } from "./website-research.functions";

describe("isSafePublicUrl", () => {
  it("accepts public https URLs", () => {
    expect(isSafePublicUrl("https://example.com/about")).toBe(true);
    expect(isSafePublicUrl("http://business.in")).toBe(true);
  });

  it("blocks localhost and private IP ranges", () => {
    for (const url of [
      "http://localhost:8080",
      "https://127.0.0.1/admin",
      "http://10.0.0.5",
      "http://192.168.1.1",
      "http://172.16.0.1",
      "http://169.254.169.254/latest/meta-data",
      "https://printer.local",
      "http://[::1]",
    ]) {
      expect(isSafePublicUrl(url)).toBe(false);
    }
  });

  it("blocks non-http schemes and credentials", () => {
    expect(isSafePublicUrl("file:///etc/passwd")).toBe(false);
    expect(isSafePublicUrl("ftp://example.com")).toBe(false);
    expect(isSafePublicUrl("https://user:pass@example.com")).toBe(false);
    expect(isSafePublicUrl("not a url")).toBe(false);
  });
});

describe("extractPage", () => {
  const html = `<!doctype html><html><head>
    <title>Sharma Weddings — Wedding Planner in Jaipur</title>
    <meta name="description" content="Sharma Weddings plans destination weddings across Rajasthan.">
    <meta name="theme-color" content="#b03060">
    <meta property="og:image" content="/cover.jpg">
    <script type="application/ld+json">
      {"@context":"https://schema.org","@type":"LocalBusiness","name":"Sharma Weddings",
       "mainEntity":[{"@type":"Service","name":"Destination Weddings","description":"Full planning"},
                     {"@type":"Service","name":"Decor & Styling"}]}
    </script>
    <script type="application/ld+json">
      {"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Do you plan weddings outside Jaipur?",
        "acceptedAnswer":{"@type":"Answer","text":"Yes, across India."}}]}
    </script>
  </head><body>
    <h1>Sharma Weddings</h1>
    <h2>Our Services</h2>
    <img src="/gallery/mandap.jpg" alt="Mandap decor">
    <img src="/logo.svg" alt="logo">
    <img src="data:image/png;base64,xx">
    <p>Contact us at hello@sharmaweddings.in for a quote.</p>
    <a href="/about">Our story</a>
    <a href="https://othersite.com/services">External</a>
  </body></html>`;

  const page = extractPage(html, "https://sharmaweddings.in/");

  it("extracts title, description and theme colour", () => {
    expect(page.title).toBe("Sharma Weddings — Wedding Planner in Jaipur");
    expect(page.description).toContain("destination weddings");
    expect(page.themeColor).toBe("#b03060");
  });

  it("extracts JSON-LD services and FAQs", () => {
    expect(page.services.map((s) => s.name)).toEqual(["Destination Weddings", "Decor & Styling"]);
    expect(page.faqs).toEqual([{ question: "Do you plan weddings outside Jaipur?", answer: "Yes, across India." }]);
  });

  it("keeps content images absolute and skips logos/data URIs", () => {
    const urls = page.images.map((i) => i.url);
    expect(urls).toContain("https://sharmaweddings.in/cover.jpg");
    expect(urls).toContain("https://sharmaweddings.in/gallery/mandap.jpg");
    expect(urls.some((u) => u.includes("logo") || u.startsWith("data:"))).toBe(false);
    expect(page.images.every((i) => i.sourcePage === "https://sharmaweddings.in/")).toBe(true);
  });

  it("finds emails and same-origin content links only", () => {
    expect(page.emails).toEqual(["hello@sharmaweddings.in"]);
    expect(page.contentLinks).toEqual(["https://sharmaweddings.in/about"]);
  });

  it("tolerates pages with no structured data", () => {
    const empty = extractPage("<html><head><title>Plain</title></head><body></body></html>", "https://plain.example/");
    expect(empty.title).toBe("Plain");
    expect(empty.services).toEqual([]);
    expect(empty.faqs).toEqual([]);
    expect(empty.images).toEqual([]);
  });
});
