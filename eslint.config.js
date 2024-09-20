// eslint.config.js (CommonJS 스타일)
const js = require("@eslint/js");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");

module.exports = [
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "*.config.js",
      ".expo/",
      "scripts/",
      "README.md",
    ],
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "@typescript-eslint": typescriptEslint,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json", // TypeScript 프로젝트 설정 경로
      },
    },
    rules: {
      "react-hooks/rules-of-hooks": "warn", // 훅 규칙 위반 체크
      "react-hooks/exhaustive-deps": "error", // 의존성 배열 검사
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_", // 변수명이 '_'로 시작하면 무시
          args: "after-used",
          argsIgnorePattern: "^_", // 인자명이 '_'로 시작하면 무시
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
