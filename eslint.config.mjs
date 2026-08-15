import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // 1. Regla: Importar Link desde @/i18n/navigation, NUNCA desde next/link
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "next/link",
              message: "Importa Link desde '@/i18n/navigation' en lugar de 'next/link'.",
            },
          ],
        },
      ],

      // 2. Regla: Ningún hex suelto en componentes (debe ser token CSS en app/globals.css o lib/content/site.ts)
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]",
          message:
            "No escribas colores hexadecimales sueltos en componentes. Usa custom properties CSS o define los hex estructurales en lib/content/site.ts.",
        },
      ],
    },
  },
  {
    // Permitir hex explícitos en archivos de configuración estructural de contenido (lib/content/site.ts)
    files: ["lib/content/site.ts"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
  {
    ignores: [".next/", "node_modules/", "public/"],
  },
];
