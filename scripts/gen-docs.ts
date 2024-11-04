import type { RuleModule } from "src/utils/create-rule";

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pluginName } from "src/types";

import plugin from "../src/index";
import { rules } from "../src/rules";

const recommendedRules = new Set(Object.keys(plugin.configs.recommended.rules!));

function generateRuleHeader(ruleName: string) {
  const rulesRecord = rules as Record<string, RuleModule<unknown[]>>;
  const rule = rulesRecord[ruleName];
  const { meta } = rule;

  if (!meta?.docs) {
    throw new Error(`Docs meta not found for rule ${ruleName}`);
  }

  const isRecommended = recommendedRules.has(`${pluginName}/${ruleName}`);
  const isFixable = !!meta?.fixable;

  const lines: string[] = [
    `# ${ruleName}`,
    "",
    `${meta.docs.description}.`,
    "",
  ];

  // Add recommended badge if applicable
  if (isRecommended) {
    lines.push(
      `✅ This rule is _enabled_ in the \`recommended\` [config](https://github.com/ximagine-ai/eslint-plugin#configs).`,
      "",
    );
  } else {
    lines.push(
      `🚫 This rule is _disabled_ in the \`recommended\` [config](https://github.com/ximagine-ai/eslint-plugin#configs).`,
      "",
    );
  }

  // Add fixable badge if applicable
  if (isFixable) {
    lines.push(
      `🔧 This rule is automatically fixable by the [\`--fix\` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).`,
      "",
    );
  }

  lines.push(
    "<!-- end auto-generated rule header -->",
    "<!-- Do not manually modify this header. Run: `pnpm run gen:docs` -->",
    "",
    "##",
  );

  return lines.join("\n");
}

function updateRuleDoc(ruleName: string) {
  const docPath = path.resolve(
    import.meta.dirname,
    `../src/rules/${ruleName}.md`,
  );

  const content = readFileSync(docPath, "utf8");

  // Find the position of the first level 2 heading
  const level2HeadingIndex = content.indexOf("##");
  if (level2HeadingIndex === -1) {
    console.error(`Could not find "##" in ${ruleName}.md`);

    return;
  }

  // Generate new header
  const newHeader = generateRuleHeader(ruleName);

  // Combine new header with existing content after "##"
  const newContent =
    newHeader + content.slice(level2HeadingIndex + "##".length);

  writeFileSync(docPath, newContent);
  console.log(`✅ Updated ${ruleName}.md`);
}

// Update all rule docs
for (const ruleName of Object.keys(rules)) {
  updateRuleDoc(ruleName);
}
