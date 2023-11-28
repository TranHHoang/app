import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { computePosition, ReferenceElement, shift } from "@floating-ui/dom";
import { SuggestionOptions } from "@tiptap/suggestion";
import { MenuItem } from "../model/menuItems";
import { InsertBlockMenu } from "../ui/InsertBlockMenu";

type RenderFnReturnType = ReturnType<NonNullable<SuggestionOptions<MenuItem>["render"]>>;

export function renderMenu(): RenderFnReturnType {
  let cleanup: (() => void) | null = null;
  let onKeyDownHandler: ((e: KeyboardEvent) => boolean) | null = null;
  const menuEl = document.createElement("div");

  const [menuItems, setMenuItems] = createSignal<MenuItem[]>([]);

  return {
    onStart({ items, command, clientRect }) {
      document.body.append(menuEl);

      setMenuItems(items);
      cleanup = render(
        () => InsertBlockMenu({ items: menuItems, command, exposeOnKeyDownHandler: (fn) => (onKeyDownHandler = fn) }),
        menuEl
      );
      void onChangePosition(menuEl.firstElementChild, clientRect?.());
    },
    onUpdate({ items, clientRect }) {
      setMenuItems(items);
      void onChangePosition(menuEl.firstElementChild, clientRect?.());
    },
    onKeyDown({ event }) {
      if (event.key === "Escape") {
        cleanup?.();
        menuEl.remove();
        return true;
      }
      return onKeyDownHandler?.(event) ?? false;
    },
    onExit() {
      cleanup?.();
      menuEl.remove();
    },
  };
}

async function onChangePosition(el: Element | null, domRect: DOMRect | null | undefined): Promise<void> {
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
