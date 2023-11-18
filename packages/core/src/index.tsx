import { render } from "solid-js/web";
import { App } from "~/app/App";
import "./assets/index.css";

// declare module "solid-js" {
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace JSX {
//     interface StyleHTMLAttributes<T> {
//       jsx?: boolean;
//       global?: boolean;
//     }
//   }
// }

export function mount(el: HTMLElement | null): void {
  if (el) render(() => <App />, el);
}
