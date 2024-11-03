import { TSESTree } from "@typescript-eslint/utils";

import { createEslintRule, type RuleModule } from "../utils/create-rule";

export const RULE_NAME = "enforce-request-prefix";

type MessageIds = "enforceRequestPrefix";

type Options = [];

const rule: RuleModule<Options> = createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "Enforce request prefix for React Query hooks",
    },
    fixable: "code",
    schema: [],
    messages: {
      enforceRequestPrefix:
        "React Query hooks should be prefixed with 'request'. Rename '{{name}}' to 'request{{capitalizedName}}'",
    },
  },
  defaultOptions: [],
  create: (context) => {
    const { sourceCode } = context;

    const reactQueryHookNames = new Set([
      "useQuery",
      "useMutation",
      "useInfiniteQuery",
      "useSuspenseQuery",
      "usePrefetchQuery",
    ]);

    const isReactQueryHook = (name: string): boolean =>
      reactQueryHookNames.has(name);

    function isTRPCReactQueryHook(node: TSESTree.CallExpression): boolean {
      const { callee } = node;
      if (callee.type !== TSESTree.AST_NODE_TYPES.MemberExpression)
        return false;

      const propertyName =
        callee.property.type === TSESTree.AST_NODE_TYPES.Identifier
          ? callee.property.name
          : "";

      return isReactQueryHook(propertyName);
    }

    function isVanillaReactQueryHook(node: TSESTree.CallExpression): boolean {
      const { callee } = node;

      return (
        callee.type === TSESTree.AST_NODE_TYPES.Identifier &&
        isReactQueryHook(callee.name)
      );
    }

    function capitalizeFirstLetter(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return {
      VariableDeclarator(node) {
        if (
          node.id.type !== TSESTree.AST_NODE_TYPES.Identifier ||
          node.init?.type !== TSESTree.AST_NODE_TYPES.CallExpression
        )
          return;

        const { name } = node.id;
        if (name.startsWith("request")) return;

        if (
          isTRPCReactQueryHook(node.init) ||
          isVanillaReactQueryHook(node.init)
        ) {
          const capitalizedName = capitalizeFirstLetter(name);
          const scope = sourceCode.getScope(node);
          const variable = scope.variables.find((v) => v.name === name);

          context.report({
            node: node.id,
            messageId: "enforceRequestPrefix",
            data: {
              name,
              capitalizedName,
            },
            *fix(fixer) {
              yield fixer.replaceText(node.id, `request${capitalizedName}`);

              if (variable) {
                for (const reference of variable.references) {
                  if (reference.identifier !== node.id) {
                    yield fixer.replaceText(
                      reference.identifier,
                      `request${capitalizedName}`,
                    );
                  }
                }
              }
            },
          });
        }
      },
    };
  },
});

export default rule;
