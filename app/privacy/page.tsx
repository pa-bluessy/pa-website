import type { Metadata } from "next";
import { readFileSync } from "fs";
import path from "path";
import { PageShell, PageTitle } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "pa.のプライバシーポリシー。",
};

function parsePrivacyMarkdown(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const paragraphs: string[] = [];
  const sections: { title: string; body: string[] }[] = [];
  let current: { title: string; body: string[] } | null = null;
  let skipNote = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("# ")) continue;
    if (line.startsWith(">")) {
      skipNote = true;
      continue;
    }
    if (skipNote && !line.startsWith("## ")) {
      if (!line.startsWith("「")) continue;
      skipNote = false;
    }
    if (line.startsWith("## ")) {
      current = { title: line.replace(/^##\s+/, ""), body: [] };
      sections.push(current);
      continue;
    }
    if (!current) {
      paragraphs.push(line);
    } else {
      current.body.push(line);
    }
  }

  return { paragraphs, sections };
}

function renderInline(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) {
      return (
        <a key={i} href={m[2]} className="underline underline-offset-2 hover:text-pa-text">
          {m[1]}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function PrivacyPage() {
  const filePath = path.join(process.cwd(), "docs", "content", "privacy.md");
  const markdown = readFileSync(filePath, "utf8");
  const { paragraphs, sections } = parsePrivacyMarkdown(markdown);

  return (
    <PageShell>
      <PageTitle>Privacy Policy</PageTitle>

      <div className="space-y-6 text-sm leading-relaxed text-pa-muted md:text-base">
        {paragraphs.map((p) => (
          <p key={p}>{renderInline(p)}</p>
        ))}
      </div>

      <div className="mt-12 space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-xl font-medium tracking-tight text-[#F3EDE3]">
              {section.title}
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-pa-muted md:text-base">
              {section.body.map((p) => (
                <p key={p}>{renderInline(p)}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
