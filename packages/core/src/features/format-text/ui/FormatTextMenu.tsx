import { Component, For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Editor } from "@tiptap/core";
import { FloatingMenu } from "~/shared/ui/menu";
import { menuIconItems } from "../model/menuItems";
import { MenuButton } from "./MenuButton";

interface FormatTextMenuProps {
  editor: () => Editor | null;
}

export const FormatTextMenu: Component<FormatTextMenuProps> = (props) => {
  return (
    <FloatingMenu component="div">
      <Show when={props.editor()}>
        {(editor) => (
          <For each={menuIconItems}>
            {(item) => (
              <Dynamic
                component={MenuButton}
                editor={editor()}
                name={item.name}
                icon={item.icon}
                onClick={() => item.onCommand(editor().chain().focus()).run()}
              />
            )}
          </For>
        )}
      </Show>
    </FloatingMenu>
  );
};
