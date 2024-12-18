import type { Linter } from "eslint";

import { rules } from "./rules";
import { pluginName, type RuleSet, type XimaginePlugin } from "./types";

/**
 * Ximagine ESLint plugin
 * @see https://github.com/ximagine-ai/eslint-plugin
 */
const plugin: XimaginePlugin = {
  meta: {
    name: pluginName,
  },
  rules,
  configs: {
    get recommended() {
      return recommended;
    },
  },
};

const recommended: Linter.Config = {
  plugins: {
    [pluginName]: plugin,
  },
  rules: {
    [`${pluginName}/no-jsx-non-null-assertion`]: "error",
    [`${pluginName}/no-jsx-optional-chaining`]: "error",
    [`${pluginName}/no-unsafe-type-assertion`]: "error",
    [`${pluginName}/no-object-literal-type-assertion`]: "error",
    [`${pluginName}/no-double-export`]: "error",
    [`${pluginName}/no-uncaught-mutate-async`]: "error",
    [`${pluginName}/function-params-destructuring`]: "warn",
    [`${pluginName}/padding-lines`]: "warn",
    [`${pluginName}/prefer-export-default-function`]: "warn",
    [`${pluginName}/enforce-request-prefix`]: "warn",
    [`${pluginName}/no-void-mutate-async`]: "warn",
  } satisfies RuleSet,
};

export default plugin;
