import { Accessor, Component, createSignal, For } from "solid-js";
import { FloatingMenu } from "~/shared/ui/menu";
import { MenuItem } from "../model/menuItems";
import { MenuButton } from "./MenuButton";

interface InsertBlockMenuProps {
  command: (props: MenuItem) => void;
  items: Accessor<MenuItem[]>;
  exposeOnKeyDownHandler: (fn: (e: KeyboardEvent) => boolean) => void;
}

export const InsertBlockMenu: Component<InsertBlockMenuProps> = (props) => {
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  // Expose onKeyDown function
  // eslint-disable-next-line solid/reactivity
  props.exposeOnKeyDownHandler(onKeyDown);

  function onKeyDown(e: KeyboardEvent): boolean {
    switch (e.key) {
      case "ArrowUp": {
        setSelectedIndex((selectedIndex() + props.items().length - 1) % props.items().length);
        break;
      }
      case "ArrowDown": {
        setSelectedIndex((selectedIndex() + 1) % props.items().length);
        break;
      }
      case "Enter": {
        const item = props.items()[selectedIndex()];
        if (item) props.command(item);
        break;
      }
      default: {
        return false;
      }
    }
    return true;
  }

  return (
    <FloatingMenu component="div" class="InsertBlockMenu">
      <For each={props.items()}>
        {(item, index) => (
          <MenuButton item={item} selected={selectedIndex() === index()} onClick={() => props.command(item)} />
        )}
      </For>
      <style jsx>{`
        .InsertBlockMenu {
          position: absolute;
          flex-direction: column;
          padding: 8px 4px;
          width: max-content;
        }
      `}</style>
    </FloatingMenu>
  );
};
