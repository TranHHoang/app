import { createSignal } from "solid-js";
import { computePosition, ReferenceElement, shift } from "@floating-ui/dom";
import { SuggestionOptions } from "@tiptap/suggestion";
import { render, RenderedComponent } from "~/shared/lib";
import { MenuItem } from "../model/menuItems";
import { InsertBlockMenu } from "../ui/InsertBlockMenu";

type RenderFnReturnType = ReturnType<NonNullable<SuggestionOptions<MenuItem>["render"]>>;

export function renderMenu(): RenderFnReturnType {
  let onKeyDownHandler: ((e: KeyboardEvent) => boolean) | null = null;
  let component: RenderedComponent | null = null;
  const [menuItems, setMenuItems] = createSignal<MenuItem[]>([]);

  return {
    onStart({ items, command, clientRect }) {
      setMenuItems(items);
      component = render(InsertBlockMenu, {
        command,
        exposeOnKeyDownHandler(fn) {
          onKeyDownHandler = fn;
        },
        get items() {
          return menuItems();
        },
      });
      void onChangePosition(component.el, clientRect?.());
    },
    onUpdate({ items, clientRect }) {
      setMenuItems(items);
      void onChangePosition(component?.el, clientRect?.());
    },
    onKeyDown({ event }) {
      if (event.key === "Escape") {
        component?.cleanup();
        return true;
      }
      return onKeyDownHandler?.(event) ?? false;
    },
    onExit() {
      component?.cleanup();
      component = null;
    },
  };
}

async function onChangePosition(el: Element | null | undefined, domRect: DOMRect | null | undefined): Promise<void> {
  if (!(el instanceof HTMLElement) || !domRect) return;
  const refEl: ReferenceElement = {
    getBoundingClientRect: () => domRect,
  };

  const { x, y } = await computePosition(refEl, el, {
    middleware: [shift()],
  });
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
}
