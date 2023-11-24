import { Component, For, onCleanup, onMount } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Editor, isNodeSelection } from "@tiptap/core";
import { FloatingMenu } from "~/shared/ui/menu";
import { useEditorExtensions } from "~/entities/editor-area";
import { FormatTextMenuExt } from "../lib/menuExt";
import { menuIconItems } from "../model/menuItems";
import { MenuButton } from "./MenuButton";

export const FormatTextMenu: Component<{ editor: Editor }> = (props) => {
  let element: HTMLDivElement | undefined;

  onMount(() => {
    const ext = FormatTextMenuExt.configure({
      element,
      shouldShow({ state }) {
        const { selection } = state;
        return !selection.empty && !isNodeSelection(selection);
      },
    });

    const extensionsStore = useEditorExtensions();
    extensionsStore.add([ext]);

    onCleanup(() => {
      extensionsStore.remove([ext]);
    });
  });

  return (
    <FloatingMenu component="div" ref={element}>
      <For each={menuIconItems}>
        {(item) => (
          <Dynamic
            component={MenuButton}
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
