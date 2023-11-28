import { Component, For } from "solid-js";
import { Editor } from "@tiptap/core";
import { FloatingMenu } from "~/shared/ui/menu";
import { menuIconItems } from "../model/menuItems";
import { MenuButton } from "./MenuButton";

interface FormatTextMenuProps {
  editor: Editor;
}

export const FormatTextMenu: Component<FormatTextMenuProps> = (props) => {
  return (
    <FloatingMenu component="div">
      <For each={menuIconItems}>
        {(item) => (
          <MenuButton
            editor={props.editor}
            name={item.name}
            icon={item.icon}
            onClick={() => item.onCommand(props.editor.chain().focus()).run()}
          />
        )}
      </For>
    </FloatingMenu>
  );
};
