"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { GlassBadge, GlassButton, GlassCard, GlassInput } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";

export default function ContactsPage() {
  const [form, setForm] = useState({ name: "", city: "", info: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const phone = "+7 (495) 240-91-21";
  const phoneHref = "tel:+74952409121";

  const onChange = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setForm({ name: "", city: "", info: "", phone: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="space-y-6">
      <Reveal className="space-y-2">
        <GlassBadge tone="accent">Контакты</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">Связь с H2GENIUM</h1>
        <p className="text-[color:var(--muted)]">Оставьте заявку или свяжитесь с нами любым удобным способом.</p>
      </Reveal>

      <Reveal className="grid gap-4 md:grid-cols-2">
        <GlassCard className="space-y-4">
          <h2 className="text-xl font-semibold text-[color:var(--text)]">Быстрая связь</h2>
          <div className="flex flex-wrap gap-3">
            <GlassButton as="a" href="https://wa.me/74952409121" variant="primary">
              WhatsApp
            </GlassButton>
            <GlassButton as="a" href={phoneHref} variant="ghost">
              Телефон: {phone}
            </GlassButton>
          </div>
        </GlassCard>

        <GlassCard id="form" className="space-y-3">
          <h2 className="text-xl font-semibold text-[color:var(--text)]">Оставить заявку</h2>
          <form className="space-y-3" onSubmit={onSubmit}>
            <GlassInput name="name" placeholder="Имя" value={form.name} onChange={onChange("name")} />
            <GlassInput name="city" placeholder="Город" value={form.city} onChange={onChange("city")} />
            <GlassInput
              name="info"
              placeholder="Интересующие позиции/информация"
              value={form.info}
              onChange={onChange("info")}
            />
            <GlassInput
              name="phone"
              placeholder="Телефон / WhatsApp"
              value={form.phone}
              onChange={onChange("phone")}
            />
            <GlassButton type="submit" variant="primary" className="w-full justify-center">
              {status === "sending" ? "Отправляем..." : "Отправить заявку"}
            </GlassButton>
            {status === "sent" && <p className="text-xs text-green-700">Заявка отправлена</p>}
            {status === "error" && <p className="text-xs text-red-600">Не удалось отправить. Попробуйте еще раз.</p>}
          </form>
          <p className="text-xs text-[color:var(--muted)]">
            Отправляя форму, вы соглашаетесь на обработку персональных данных.
          </p>
        </GlassCard>
      </Reveal>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-[color:var(--text)]">Как нас найти</h2>
            <p className="text-sm md:text-base text-[color:var(--muted)]">Алтуфьевское ш., 27, Москва</p>
          </div>
          <a
            className="text-sm md:text-base font-semibold text-[color:var(--accent-blue)] underline underline-offset-4 hover:text-[color:var(--accent-cyan)]"
            href="https://yandex.ru/maps/?pt=37.583185,55.857523&z=16&l=map"
            target="_blank"
            rel="noreferrer"
          >
            Открыть в Яндекс.Картах
          </a>
        </div>
        <div className="relative w-full overflow-hidden rounded-[32px] border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/25 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.28),0_8px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur-2xl h-[520px] md:h-[620px] xl:h-[680px]">
          <iframe
            title="Yandex Map — H2GENIUM"
            src="https://yandex.ru/map-widget/v1/?ll=37.583185%2C55.857523&z=16&pt=37.583185%2C55.857523%2Cpm2rdm"
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          />
          <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/70 px-4 py-3 text-sm font-semibold text-[color:var(--text)] shadow-[0_18px_50px_-18px_rgba(0,0,0,0.32)] backdrop-blur-xl">
            <div>Алтуфьевское ш., 27</div>
            <div className="text-xs text-[color:var(--muted)]">55.857523, 37.583185</div>
          </div>
        </div>
      </section>
    </div>
  );
}
