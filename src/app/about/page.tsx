import { NadhRouter } from "@/components/home/nadh-router";
import { GlassBadge, GlassCard } from "@/components/ui/glass";
import { Reveal } from "@/components/ui/reveal";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <Reveal className="space-y-3">
        <GlassBadge tone="accent">HYDROGENIUM</GlassBadge>
        <h1 className="text-3xl font-semibold text-[color:var(--text)]">О HYDROGENIUM</h1>
        <p className="max-w-3xl text-[color:var(--muted)]">
          Когда речь идет о современной водородотерапии, имя Hydrogenium стало синонимом технологического лидерства.
          Модельный ряд Hydrogenium 4200 / 6000 / 8400 / 12000 создан для клиник, которым важны результат, безопасность и
          высокая пропускная способность.
        </p>
      </Reveal>

      <GlassCard className="space-y-4">
        <p className="text-sm text-[color:var(--muted)]">
          HYDROGENIUM — техника, которая работает за вас. Система док-станций с интеллектуальными сенсорами контролирует
          параметры среды и при необходимости мгновенно отключает питание, обеспечивая абсолютную безопасность.
          Интеграция с инфраструктурой клиники делает Hydrogenium не просто аппаратом, а центральной водородной платформой,
          готовой к масштабированию.
        </p>

        <div className="space-y-2">
          <div className="text-sm font-semibold text-[color:var(--text)]">Почему клиники выбирают Hydrogenium</div>
          <ul className="list-disc space-y-2 pl-5 text-sm text-[color:var(--muted)]">
            <li>Быстрая окупаемость за счет высокой пропускной способности.</li>
            <li>Низкие расходы на обслуживание.</li>
            <li>Надежность и автоматизация всех ключевых процессов.</li>
            <li>Престиж инновационного бренда, демонстрирующий технологический уровень клиники.</li>
          </ul>
        </div>

        <p className="text-sm text-[color:var(--muted)]">
          Hydrogenium — это не просто ингаляторы. Это основа вашего будущего водородного центра. Серия 4200 / 6000 / 8400
          / 12000 покрывает все сценарии — от персонального кабинета восстановительной медицины до крупного
          санаторно-реабилитационного комплекса. Цифровая эра медицинского водорода уже началась — и она начинается с вас.
        </p>
      </GlassCard>

      <NadhRouter />
    </div>
  );
}
