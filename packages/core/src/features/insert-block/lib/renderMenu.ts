import { ComponentProps } from "solid-js";
import { SolidRenderer } from "@app/tiptap-solid";
import { computePosition, ReferenceElement, shift } from "@floating-ui/dom";
import { SuggestionOptions } from "@tiptap/suggestion";
import { MenuItem } from "../model/menuItems";
import { InsertBlockMenu } from "../ui/InsertBlockMenu";

type RenderFnReturnType = ReturnType<NonNullable<SuggestionOptions<MenuItem>["render"]>>;

export function renderMenu(): RenderFnReturnType {
  let onKeyDownHandler: ((e: KeyboardEvent) => boolean) | null = null;
  let component: SolidRenderer<ComponentProps<typeof InsertBlockMenu>> | null = null;

  return {
    onStart({ editor, items, command, clientRect }) {
      component = new SolidRenderer(InsertBlockMenu, {
        editor,
        props: {
          exposeOnKeyDownHandler(fn: (e: KeyboardEvent) => boolean) {
            onKeyDownHandler = fn;
          },
          command,
          items,
        },
        className: "absolute",
      });
      document.body.append(component.element);
      void onChangePosition(component.element, clientRect?.());
    },
    onUpdate({ items, command, clientRect }) {
      component?.updateProps({ items, command });
      void onChangePosition(component?.element, clientRect?.());
    },
    onKeyDown({ event }) {
      if (event.key === "Escape") {
        component?.destroy();
        return true;
      }
      return onKeyDownHandler?.(event) ?? false;
    },
    onExit() {
      component?.destroy();
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
