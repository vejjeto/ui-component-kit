import { ComponentPlayground } from "@/components/docs/ComponentPlayground";
import { DocsShell } from "@/components/docs/DocsShell";
import { COMPONENT_CATALOG, getComponentSpec } from "@/lib/catalog";
import { notFound } from "next/navigation";

export function generateStaticParams(): Array<{ slug: string }> {
  return COMPONENT_CATALOG.map((item) => ({ slug: item.slug }));
}

export default async function ComponentDocsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const spec = getComponentSpec(slug);

  if (!spec) {
    notFound();
  }

  return (
    <DocsShell activeSlug={spec.slug}>
      <ComponentPlayground slug={spec.slug} />
    </DocsShell>
  );
}
