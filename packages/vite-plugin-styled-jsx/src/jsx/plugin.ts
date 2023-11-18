import * as babel from "@babel/core";
import { Scope } from "@babel/traverse";
import * as t from "@babel/types";
import { compileStyle } from "../css/processor.js";
import { computeHash } from "../utils.js";

const STYLED_JSX_NS = "s";

function hasAttribute(attr: babel.types.JSXAttribute | babel.types.JSXSpreadAttribute, name: string): boolean {
  return t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && attr.name.name === name;
}

function getFunctionName(functionScope: Scope): string {
  const { node } = functionScope.path;
  if ((t.isFunctionExpression(node) || t.isFunctionDeclaration(node)) && t.isIdentifier(node.id)) {
    return node.id.name;
  }
  return "Anonymous";
}

function addScopedId(functionScope: Scope, map: WeakMap<Scope, string>): void {
  functionScope.path.traverse({
    JSXElement(path): void {
      const opening = path.node.openingElement;

      if (
        // <div>, <Item>
        (t.isJSXIdentifier(opening.name) && /^[A-Za-z]/.test(opening.name.name)) ||
        // <div.el> <Popup.Root>
        (t.isJSXMemberExpression(opening.name) &&
          t.isJSXIdentifier(opening.name.object) &&
          /^[A-Za-z]/.test(opening.name.object.name))
      ) {
        const value = map.get(functionScope);
        if (!value) return;

        // Check if scoping attribute already exists
        if (
          opening.attributes.some(
            (attr) =>
              t.isJSXAttribute(attr) &&
              t.isJSXNamespacedName(attr.name) &&
              attr.name.namespace.name === STYLED_JSX_NS &&
              attr.name.name.name === value
          )
        ) {
          return;
        }

        opening.attributes.push(
          t.jsxAttribute(t.jsxNamespacedName(t.jsxIdentifier(STYLED_JSX_NS), t.jsxIdentifier(value)))
        );
      }
    },
  });
}

export function styledJsxPlugin(): babel.PluginObj<babel.PluginPass & { opts: { css: string } }> {
  const functionStyleMap = new WeakMap<Scope, string>();

  return {
    name: "styled-jsx",
    visitor: {
      Program(rootPath, state): void {
        let genId = 0;
        const fileName = state.file.opts.sourceFileName;
        if (!fileName) return;
        let hasStyledJsx = false;

        rootPath.traverse({
          JSXElement(path) {
            const opening = path.node.openingElement;
            // Only transform <style jsx> tag
            if (
              !(
                t.isJSXIdentifier(opening.name) &&
                opening.name.name === "style" &&
                opening.attributes.some((attr) => hasAttribute(attr, "jsx"))
              )
            ) {
              return;
            }

            // <style jsx global>
            const isGlobal = opening.attributes.some((attr) => hasAttribute(attr, "global"));
            // Containing function
            const containingFunc = path.scope.getFunctionParent();
            if (containingFunc) {
              for (const child of path.node.children) {
                if (!(t.isJSXExpressionContainer(child) && t.isTemplateLiteral(child.expression))) continue;
                // Extract the css
                const id = `v${computeHash(`${fileName}-${getFunctionName(containingFunc)}-${genId++}`)}`;
                const { code: css } = compileStyle({
                  id,
                  filename: fileName,
                  source: child.expression.quasis[0]?.value?.cooked ?? "",
                  scoped: !isGlobal,
                });

                functionStyleMap.set(containingFunc, id);

                const hashedFileName = computeHash(fileName);
                state.opts.css = `${state.opts.css}\n${css}`;
                // Add scoping to JSXElement
                addScopedId(containingFunc, functionStyleMap);
                // Add import (if not there already)
                if (!hasStyledJsx) {
                  hasStyledJsx = true;
                  const importDecl = t.importDeclaration(
                    [],
                    t.stringLiteral(`virtual:styled-jsx/${hashedFileName}.css`)
                  );
                  rootPath.unshiftContainer("body", importDecl);
                }
              }
              // Remove the <style> tag from the result template
              path.replaceWith({ ...t.jsxText(""), extra: { raw: "" } });
            }
          },
        });
        rootPath.scope.crawl();
      },
    },
  };
}
