export type NavItem = {
  key: string;
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "Главная", href: "/" },
  { key: "catalog", label: "Каталог", href: "/catalog" },
  { key: "cabinets", label: "Кабинеты", href: "/application" },
  { key: "nadh", label: "NADH", href: "/nadh" },
  { key: "results", label: "Результаты", href: "/results" },
  { key: "about", label: "О HYDROGENIUM", href: "/about" },
  { key: "docs", label: "Документы", href: "/documents" },
  { key: "pubs", label: "Публикации", href: "/publications" },
  { key: "contacts", label: "Контакты", href: "/contacts" },
];
