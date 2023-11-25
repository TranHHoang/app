import { render } from "solid-js/web";
import { PlatformConfigs } from "~/shared/lib";
import { App } from "~/app/App";
import "~/assets/index.css";

export function mount(el: HTMLElement | null, configs: PlatformConfigs): void {
  if (el) render(() => <App initialPlatformConfigs={configs} />, el);
}
