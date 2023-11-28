import { Component, ParentProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import cn from "clsx";
import { MenuButton as GenericMenuButton } from "~/shared/ui/buttons";
import { MenuItem } from "../model/menuItems";

type MenuButtonProps = ParentProps<{
  item: MenuItem;
  selected: boolean;
  onClick: () => void;
}>;

export const MenuButton: Component<MenuButtonProps> = (props) => {
  return (
    <GenericMenuButton component="button" class={cn({ selected: props.selected })} onClick={props.onClick}>
      <div class="icon">
        <Dynamic component={props.item.icon} />
      </div>
      <div class="content">{props.item.title}</div>
      <style jsx>{`
        .MenuButton {
          gap: 12px;
          padding: 4px 8px;

          :where(.icon) {
            display: flex;
            align-items: center;
            opacity: 0.5;
            border-radius: var(--radius);
            font-size: 0.8rem;
          }

          :where(.content) {
            font-weight: 500;
            font-size: 1rem;
          }
        }

        .selected {
          background-color: var(--bg-button-hover);
          color: var(--color-primary);
        }
      `}</style>
    </GenericMenuButton>
  );
};
