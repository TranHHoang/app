import { render } from "solid-js/web";
import { App } from "~/app/App";
import "./assets/index.css";

export function mount(el: HTMLElement | null): void {
  if (el) render(() => <App />, el);
}
