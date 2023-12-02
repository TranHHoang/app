import type { Component } from "solid-js";
import { createRoot } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { Dynamic, insert } from "solid-js/web";
import type {
  DecorationWithType,
  Editor,
  NodeViewProps,
  NodeViewRenderer,
  NodeViewRendererOptions,
  NodeViewRendererProps,
} from "@tiptap/core";
import { NodeView } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import type { Decoration } from "@tiptap/pm/view";
import { getTiptapSolidReactiveOwner } from "./reactiveOwner";
import type { SolidNodeViewContextProps } from "./useSolidNodeView";
import { SolidNodeViewContext } from "./useSolidNodeView";

export interface SolidNodeViewRendererOptions extends NodeViewRendererOptions {
  update: ((node: ProseMirrorNode, decorations: Decoration[]) => boolean) | null;
}

export class SolidNodeView extends NodeView<Component<NodeViewProps>, Editor, SolidNodeViewRendererOptions> {
  rootElement!: HTMLElement | null;
  contentElement!: HTMLElement | null;
  setProps!: SetStoreFunction<NodeViewProps>;
  dispose!: () => void;

  constructor(
    component: Component<NodeViewProps>,
    props: NodeViewRendererProps,
    options?: Partial<SolidNodeViewRendererOptions>
  ) {
    super(component, props, options);
    createRoot((dispose) => {
      this.dispose = dispose;
      const [props, setProps] = createStore<NodeViewProps>({
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

      const SolidNodeViewProvider: Component<NodeViewProps> = (componentProps) => {
        const onDragStart = this.onDragStart.bind(this);
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const nodeViewContentRef: SolidNodeViewContextProps["nodeViewContentRef"] = (element) => {
          this.contentElement = element;
        };

        return (
          <SolidNodeViewContext.Provider value={{ onDragStart, nodeViewContentRef }}>
            <Dynamic component={this.component} {...componentProps} />
          </SolidNodeViewContext.Provider>
        );
      };

      insert(this.rootElement, SolidNodeViewProvider(props));
      // Remove wrapper
      const componentEl = this.rootElement.firstElementChild as HTMLElement;
      this.rootElement.replaceWith(componentEl);
      this.rootElement = componentEl;
    }, getTiptapSolidReactiveOwner(this.editor));
  }

  get dom(): HTMLElement {
    return this.rootElement!;
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
  component: Component<NodeViewProps>,
  options?: Partial<SolidNodeViewRendererOptions>
): NodeViewRenderer {
  return (props: NodeViewRendererProps) => {
    return new SolidNodeView(component, props, options);
  };
}
