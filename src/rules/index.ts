import type { RuleModule } from "src/utils/create-rule";

import enforceRequestPrefix from "./enforce-request-prefix";
import functionParamsDestructuring from "./function-params-destructuring";
import noDoubleExport from "./no-double-export";
import noJsxNonNullAssertion from "./no-jsx-non-null-assertion";
import noJsxOptionalChaining from "./no-jsx-optional-chaining";
import noObjectLiteralTypeAssertion from "./no-object-literal-type-assertion";
import noUncaughtMutateAsync from "./no-uncaught-mutate-async";
import noUnsafeTypeAssertion from "./no-unsafe-type-assertion";
import noVoidMutateAsync from "./no-void-mutate-async";
import paddingLines from "./padding-lines";
import preferExportDefaultFunction from "./prefer-export-default-function";

export type RuleName = keyof typeof rules;

export type RuleCategory =
  | "best-practice"
  | "code-style"
  | "import-export"
  | "react-query";

export const rules = {
  "enforce-request-prefix": enforceRequestPrefix,
  "function-params-destructuring": functionParamsDestructuring,
  "no-double-export": noDoubleExport,
  "no-jsx-non-null-assertion": noJsxNonNullAssertion,
  "no-jsx-optional-chaining": noJsxOptionalChaining,
  "no-uncaught-mutate-async": noUncaughtMutateAsync,
  "no-unsafe-type-assertion": noUnsafeTypeAssertion,
  "no-void-mutate-async": noVoidMutateAsync,
  "padding-lines": paddingLines,
  "prefer-export-default-function": preferExportDefaultFunction,
  "no-object-literal-type-assertion": noObjectLiteralTypeAssertion,
} satisfies Record<string, RuleModule<unknown[]>>;

export const ruleCategories: Record<RuleName, RuleCategory> = {
  "enforce-request-prefix": "react-query",
  "function-params-destructuring": "code-style",
  "no-double-export": "import-export",
  "no-jsx-non-null-assertion": "best-practice",
  "no-jsx-optional-chaining": "best-practice",
  "no-uncaught-mutate-async": "react-query",
  "no-unsafe-type-assertion": "best-practice",
  "no-void-mutate-async": "react-query",
  "padding-lines": "code-style",
  "prefer-export-default-function": "code-style",
  "no-object-literal-type-assertion": "best-practice",
};
