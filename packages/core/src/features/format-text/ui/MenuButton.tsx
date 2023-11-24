import { Component, ParentProps, ValidComponent } from "solid-js";
import { Editor } from "@tiptap/core";
import { MenuButton as GenericMenuButton, ToggleButton } from "~/shared/ui/buttons";
import { useEditorActive } from "~/entities/editor-area";

export type MenuButtonProps = ParentProps<{
  editor: Editor;
  icon: ValidComponent;
  name: string;
  onClick: () => void;
}>;

export const MenuButton: Component<MenuButtonProps> = (props) => {
  const isActive = useEditorActive(
    () => props.editor,
    () => props.name
  );

  return (
    <GenericMenuButton component={ToggleButton} pressed={isActive()} onClick={props.onClick}>
      {props.icon}
    </GenericMenuButton>
  );
};
