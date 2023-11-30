import { type Component, createRoot } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { Dynamic, insert } from "solid-js/web";
import type { Editor } from "@tiptap/core";
import { getTiptapSolidReactiveOwner } from "./ReactiveOwner";

export interface SolidRendererOptions {
  editor: Editor;
  props?: Record<string, unknown>;
  as?: string;
  className?: string;
}

export class SolidRenderer<P extends Record<string, unknown>> {
  id: string;
  editor: Editor;
  element: Element;
  dispose!: () => void;
  setProps!: SetStoreFunction<Record<string, unknown>>;

  constructor(component: Component<P>, { editor, props, as = "div", className = "" }: SolidRendererOptions) {
    this.id = Math.floor(Math.random() * 0xff_ff_ff_ff).toString();
    this.editor = editor;
    this.element = document.createElement(as);
    this.element.classList.add("solid-renderer");
    createRoot((dispose) => {
      const [reactiveProps, setProps] = createStore<Record<string, unknown>>(props ?? {});
      this.setProps = setProps;
      if (className) {
        this.element.classList.add(...className.split(" "));
      }
      insert(this.element, <Dynamic component={component} {...(reactiveProps as P)} />);
      // eslint-disable-next-line solid/reactivity
      this.dispose = dispose;
    }, getTiptapSolidReactiveOwner(this.editor));
  }

  updateProps(props: P): void {
    this.setProps({
      ...props,
    });
  }

  destroy(): void {
    this.dispose();
    this.element.remove();
  }
}
