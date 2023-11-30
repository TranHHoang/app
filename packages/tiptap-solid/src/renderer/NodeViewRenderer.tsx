import type { Component, Setter } from "solid-js";
import { createRoot } from "solid-js";
import { createStore } from "solid-js/store";
import { Dynamic, insert } from "solid-js/web";
import type {
  DecorationWithType,
  Editor,
  NodeViewRenderer,
  NodeViewRendererOptions,
  NodeViewRendererProps,
} from "@tiptap/core";
import { NodeView } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import type { Decoration } from "@tiptap/pm/view";
import { getTiptapSolidReactiveOwner } from "./ReactiveOwner";
import type { SolidNodeViewContextProps } from "./useSolidNodeView";
import { SolidNodeViewContext } from "./useSolidNodeView";

export interface SolidNodeViewRendererOptions extends NodeViewRendererOptions {
  update: ((node: ProseMirrorNode, decorations: Decoration[]) => boolean) | null;
}

export class SolidNodeView extends NodeView<Component, Editor, SolidNodeViewRendererOptions> {
  rootElement!: HTMLElement | null;
  contentElement!: HTMLElement | null;
  setProps!: Setter<Record<string, unknown>>;
  dispose!: () => void;

  constructor(component: Component, props: NodeViewRendererProps, options?: Partial<SolidNodeViewRendererOptions>) {
    super(component, props, options);
    createRoot((dispose) => {
      this.dispose = dispose;
      const [props, setProps] = createStore({
        editor: this.editor,
        node: this.node,
        decorations: this.decorations,
        selected: false,
        extension: this.extension,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        getPos: () => this.getPos(),
        updateAttributes: (attributes = {}) => this.updateAttributes(attributes),
        deleteNode: () => this.deleteNode(),
      });
      this.setProps = setProps;

      const tagName = this.node.isInline ? "span" : "div";

      this.rootElement = document.createElement(tagName);
      this.rootElement.classList.add("solid-renderer");

      this.contentElement = this.node.isLeaf ? null : document.createElement(tagName);

      if (this.contentElement) {
        // For some reason the whiteSpace prop is not inherited properly in Chrome and Safari
        // With this fix it seems to work fine
        // See: https://github.com/ueberdosis/tiptap/issues/1197
        this.contentElement.style.whiteSpace = "inherit";
      }

      const SolidNodeViewProvider: Component<Record<string, unknown>> = (componentProps) => {
        const onDragStart = this.onDragStart.bind(this);
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const nodeViewContentRef: SolidNodeViewContextProps["nodeViewContentRef"] = (element) => {
          if (element && this.contentElement && element.firstChild !== this.contentElement) {
            element.append(this.contentElement);
          }
        };

        return (
          <SolidNodeViewContext.Provider value={{ onDragStart, nodeViewContentRef }}>
            <Dynamic component={this.component} {...componentProps} />
          </SolidNodeViewContext.Provider>
        );
      };

      insert(this.rootElement, SolidNodeViewProvider(props));
    }, getTiptapSolidReactiveOwner(this.editor));
  }

  get dom(): HTMLElement {
    if (!this.rootElement?.firstElementChild?.hasAttribute("data-node-view-wrapper")) {
      throw new Error("Please use the NodeViewWrapper component for your node view.");
    }

    return this.rootElement;
  }

  get contentDOM(): HTMLElement | null {
    if (this.node.isLeaf) {
      return null;
    }
    return this.contentElement;
  }

  update(node: ProseMirrorNode, decorations: DecorationWithType[]): boolean {
    if (typeof this.options.update === "function") {
      const oldNode = this.node;
      const oldDecorations = this.decorations;

      this.node = node;
      this.decorations = decorations;

      return this.options.update(oldNode, oldDecorations);
    }

    if (node.type !== this.node.type) {
      return false;
    }

    if (node === this.node && this.decorations === decorations) {
      return true;
    }

    this.node = node;
    this.decorations = decorations;

    this.setProps({ node, decorations });

    return true;
  }

  selectNode(): void {
    this.setProps({
      selected: true,
    });
  }

  deselectNode(): void {
    this.setProps({
      selected: false,
    });
  }

  destroy(): void {
    if (this.rootElement) this.rootElement.textContent = "";
    this.dispose();
    this.contentElement = null;
    this.rootElement = null;
  }
}

export function SolidNodeViewRenderer(
  component: Component,
  options?: Partial<SolidNodeViewRendererOptions>
): NodeViewRenderer {
  return (props: NodeViewRendererProps) => {
    return new SolidNodeView(component, props, options);
  };
}
