import { type Component, createRoot } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { Dynamic, insert } from "solid-js/web";
import type { Editor } from "@tiptap/core";
import { getTiptapSolidReactiveOwner } from "./reactiveOwner";

export interface SolidRendererOptions<P> {
  editor: Editor;
  props?: P;
  as?: string;
  className?: string;
}

export class SolidRenderer<P extends object = object> {
  id: string;
  editor: Editor;
  element: Element;
  setProps!: SetStoreFunction<Record<string, unknown>>;

  #dispose!: () => void;

  constructor(component: Component<P>, { editor, props, as = "div", className = "" }: SolidRendererOptions<P>) {
    this.id = Math.floor(Math.random() * 0xff_ff_ff_ff).toString();
    this.editor = editor;
    this.element = document.createElement(as);

    createRoot((dispose) => {
      const [reactiveProps, setProps] = createStore<Record<string, unknown>>(props ?? {});
      this.setProps = setProps;
      if (className) {
        this.element.classList.add(...className.split(" "));
      }
      insert(this.element, <Dynamic component={component} {...(reactiveProps as P)} />);
      // Remove wrapper
      const componentEl = this.element.firstElementChild as HTMLElement;
      this.element.replaceWith(componentEl);
      this.element = componentEl;
      // eslint-disable-next-line solid/reactivity
      this.#dispose = dispose;
    }, getTiptapSolidReactiveOwner(this.editor));
  }

  updateProps(props: Partial<P>): void {
    this.setProps({
      ...props,
    });
  }

  destroy(): void {
    this.#dispose();
    this.element.remove();
  }
}
