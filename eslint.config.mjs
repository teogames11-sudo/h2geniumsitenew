import nextPlugin from "@next/eslint-plugin-next";

export default [
  ...nextPlugin.configs["core-web-vitals"],
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];
