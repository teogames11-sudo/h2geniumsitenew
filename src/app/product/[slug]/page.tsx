import products from "@/content/products.json";
import { GlassBadge, GlassButton, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";
import { notFound } from "next/navigation";
import type { PageProps } from "next";
import type { DocumentLink, ProductContent } from "@/types/content";

export default function ProductPage({ params }: PageProps<{ slug: string }>) {
  const { slug } = params;
  const product = (products as ProductContent[]).find((item) => item.slug === slug);
  if (!product) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">Карточка товара</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">{product.title}</h1>
        {product.description ? (
          <p className="text-[color:var(--muted)]">{product.description}</p>
        ) : (
          <p className="text-[color:var(--muted)]">Описание будет доступно после синхронизации.</p>
        )}
      </Reveal>

      <Reveal className="grid gap-4 md:grid-cols-3">
        <GlassCard className="md:col-span-2 space-y-3">
          <h2 className="text-xl font-semibold text-[color:var(--text)]">Галерея</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(product.images || []).map((src: string) => (
              <div
                key={src}
                className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-[rgba(12,24,44,0.6)] to-[color:var(--accent-blue)]/20"
                style={{ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }}
              />
            ))}
            {(product.images || []).length === 0 && (
              <div className="rounded-2xl border border-dashed border-[color:var(--glass-stroke)] p-6 text-sm text-[color:var(--muted)]">
                Изображения появятся после синхронизации контента.
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard className="space-y-4">
          <h2 className="text-xl font-semibold text-[color:var(--text)]">Действия</h2>
          <GlassButton as="a" href="/contacts#form" variant="primary" className="w-full justify-center">
            Оставить заявку
          </GlassButton>
          <GlassButton as="a" href="/contacts#form" variant="ghost" className="w-full justify-center">
            Получить КП
          </GlassButton>
          <div className="space-y-2 text-sm text-[color:var(--muted)]">
            <p>Документы:</p>
            <ul className="space-y-1">
              {(product.documents || []).map((doc: DocumentLink) => (
                <li key={doc.url}>
                  <a className="text-[color:var(--accent-blue)] hover:underline" href={doc.url} target="_blank">
                    {doc.title}
                  </a>
                </li>
              ))}
              {(product.documents || []).length === 0 && <li>Документы будут доступны позже.</li>}
            </ul>
          </div>
        </GlassCard>
      </Reveal>
    </div>
  );
}
