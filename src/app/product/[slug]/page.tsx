import products from "@/content/products.json";
import { GlassBadge, GlassButton, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import { ProductModelViewer } from "@/components/product/ProductModelViewer";
import { notFound } from "next/navigation";
import type { PageProps } from "next";
import type { DocumentLink, ProductContent } from "@/types/content";

const buildDescriptionBlocks = (description?: string) => {
  if (!description) return [];
  return description
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const isList = lines.length > 0 && lines.every((line) => line.startsWith("- "));
      if (isList) {
        return {
          type: "list" as const,
          items: lines.map((line) => line.replace(/^-\s*/, "")),
        };
      }
      return {
        type: "paragraph" as const,
        text: lines.join(" "),
      };
    });
};

export default function ProductPage({ params }: PageProps<{ slug: string }>) {
  const { slug } = params;
  const product = (products as ProductContent[]).find((item) => item.slug === slug);
  if (!product) {
    return notFound();
  }

  const summary = product.summary ?? product.description;
  const descriptionBlocks = buildDescriptionBlocks(product.description);
  const isPdf = (url: string) => url.toLowerCase().endsWith(".pdf");

  return (
    <div className="space-y-6">
      <Reveal className="space-y-3">
        <GlassBadge tone="accent">Карточка товара</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">{product.title}</h1>
        {summary ? (
          <p className="text-[color:var(--muted)]">{summary}</p>
        ) : (
          <p className="text-[color:var(--muted)]">Описание будет доступно после синхронизации.</p>
        )}
      </Reveal>

      <Reveal className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          {descriptionBlocks.length > 0 && (
            <GlassCard className="space-y-3">
              <h2 className="text-xl font-semibold text-[color:var(--text)]">Описание</h2>
              <div className="space-y-3 text-sm text-[color:var(--muted)]">
                {descriptionBlocks.map((block, idx) =>
                  block.type === "list" ? (
                    <ul key={`list-${idx}`} className="list-disc space-y-2 pl-5">
                      {block.items.map((item, itemIndex) => (
                        <li key={`${idx}-${itemIndex}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={`p-${idx}`}>{block.text}</p>
                  ),
                )}
              </div>
            </GlassCard>
          )}
          <GlassCard className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-semibold text-[color:var(--text)]">3D/360 обзор</h2>
            <span className="text-xs font-semibold text-[color:var(--muted)]">Поверните модель мышью</span>
          </div>
          {product.model ? (
            <ProductModelViewer modelUrl={product.model} />
          ) : (
            <div className="rounded-3xl border border-dashed border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/40 p-6 text-sm text-[color:var(--muted)]">
              3D модель появится после синхронизации контента.
            </div>
          )}

          {product.video && (
            <video
              className="h-[320px] w-full rounded-3xl border border-[color:var(--glass-stroke)] object-cover"
              src={product.video}
              controls
              preload="metadata"
            />
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {(product.images || []).map((src: string) => (
              <div
                key={src}
                className="aspect-[4/3] overflow-hidden rounded-2xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/35 shadow-[var(--shadow-1)]"
              >
                <img src={src} alt={product.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
            {(product.images || []).length === 0 && (
              <div className="rounded-2xl border border-dashed border-[color:var(--glass-stroke)] p-6 text-sm text-[color:var(--muted)]">
                Изображения появятся после синхронизации контента.
              </div>
            )}
          </div>

          {product.highlights && product.highlights.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[color:var(--text)]">Ключевые особенности</h3>
              <ul className="space-y-2 text-sm text-[color:var(--muted)]">
                {product.highlights.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--accent-blue)]/70 shadow-[0_0_0_6px_rgba(18,110,235,0.12)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard className="space-y-4">
            <h2 className="text-xl font-semibold text-[color:var(--text)]">Действия</h2>
            <GlassButton as="a" href="/contacts#form" variant="primary" className="w-full justify-center">
              Оставить заявку
            </GlassButton>
            <GlassButton as="a" href="/contacts#form" variant="ghost" className="w-full justify-center">
              Получить КП
            </GlassButton>
            <GlassButton as="a" href="/application#configurator" variant="outline" className="w-full justify-center">
              Рассчитать кабинет
            </GlassButton>
          </GlassCard>

          <GlassCard className="space-y-4">
            <h2 className="text-xl font-semibold text-[color:var(--text)]">Характеристики</h2>
            {product.specs && product.specs.length > 0 ? (
              <dl className="grid gap-3 text-sm">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex items-start justify-between gap-3">
                    <dt className="text-[color:var(--muted)]">{spec.label}</dt>
                    <dd className="text-right font-semibold text-[color:var(--text)]">
                      {spec.value}
                      {spec.note && <span className="block text-xs text-[color:var(--muted)]">{spec.note}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-[color:var(--muted)]">Характеристики будут доступны позже.</p>
            )}
            <div className="space-y-2 text-sm text-[color:var(--muted)]">
              <p>Документы:</p>
              <ul className="space-y-1">
                {(product.documents || []).map((doc: DocumentLink) => (
                  <li key={doc.url}>
                    <a
                      className="text-[color:var(--accent-blue)] hover:underline"
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      download={isPdf(doc.url) ? "" : undefined}
                    >
                      {doc.title}
                    </a>
                  </li>
                ))}
                {(product.documents || []).length === 0 && <li>Документы будут доступны позже.</li>}
              </ul>
            </div>
          </GlassCard>
        </div>
      </Reveal>
    </div>
  );
}
