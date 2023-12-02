import { Component, createSignal, Show } from "solid-js";
import { NodeViewContent } from "@app/tiptap-solid";
import { NodeViewProps } from "@tiptap/core";
import { Icon } from "~/shared/ui/icons";

export const TaskItem: Component<NodeViewProps> = (props) => {
  // eslint-disable-next-line solid/reactivity
  const [checked, setChecked] = createSignal(props.node.attrs.checked as boolean);

  function handleCheck(): void {
    props.updateAttributes({
      checked: !checked(),
    });
    setChecked(!checked());
  }

  return (
    <div data-type="listItem" class="TaskItem" data-checked={checked()}>
      <div class="leading" onClick={handleCheck}>
        <Show when={checked()} fallback={<Icon.CheckBox />}>
          <Icon.CheckBoxChecked />
        </Show>
      </div>
      <NodeViewContent class="content" />
      <style jsx>{`
        .TaskItem {
          display: flex;

          :where(&[data-checked="true"]) {
            :where(& > .content :deep(> p:first-child)) {
              opacity: 0.7;
              text-decoration: line-through;
            }

            :where(& > .leading) {
              color: var(--color-primary);
            }
          }
        }

        .leading {
          transition: 0.25s all ease-in-out;
          cursor: pointer;
        }

        .content {
          padding-left: 10px;
        }
      `}</style>
    </div>
  );
};
