import { Component } from "solid-js";
import { render as solidRender } from "solid-js/web";

export interface RenderedComponent {
  el: HTMLElement;
  cleanup: () => void;
}

export function render<T extends object>(
  comp: Component<T>,
  props = {} as T,
  options?: { detached: boolean }
): RenderedComponent {
  let parentEl: HTMLElement | null = document.createElement("div");
  const cleanup = solidRender(() => comp(props), parentEl);

  if (!(options?.detached ?? false)) document.body.append(parentEl);

  return {
    el: parentEl.firstElementChild as HTMLElement,
    cleanup: () => {
      cleanup();
      parentEl?.remove();
      parentEl = null;
    },
  };
}
