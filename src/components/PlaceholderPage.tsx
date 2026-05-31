"use client";

import PageHeader from "@/components/PageHeader";

interface PlaceholderPageProps {
  title: string;
  section: "streaks" | "practice";
  description: string;
}

export default function PlaceholderPage({
  title,
  section,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <PageHeader
          title={title}
          section={section}
          subtitle={description}
          showBack
          backLabel="Back to Daily Routine"
        />

        <div className="nisu-card p-10 text-center">
          <div
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full"
            style={{
              backgroundColor: "var(--nisu-pale-pink)",
              color: "var(--nisu-coral)",
              border: "1px solid var(--nisu-pale-pink-2)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--nisu-amber)" }}
            />
            Coming soon
          </div>
        </div>
      </div>
    </div>
  );
}
