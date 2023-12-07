import { Component } from "solid-js";
import { Select } from "@kobalte/core";
import { stringUtils } from "~/shared/lib";

interface SelectProps {
  options: string[];
  defaultValue: string;
  onChange?: (value: string) => void;
}

export const SelectBox: Component<SelectProps> = (props) => {
  return (
    <Select.Root
      options={props.options}
      onChange={props.onChange}
      itemComponent={(props) => (
        <Select.Item item={props.item} class="item">
          <Select.ItemLabel>{stringUtils.capitalize(props.item.rawValue)}</Select.ItemLabel>
        </Select.Item>
      )}
      defaultValue={props.defaultValue}
      contentEditable={false}
    >
      <Select.Trigger class="trigger">
        <Select.Value<string>>{(state) => stringUtils.capitalize(state.selectedOption())}</Select.Value>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class="content">
          <Select.Listbox class="listBox" />
        </Select.Content>
      </Select.Portal>
      <style jsx>{`
        .trigger {
          border: none;
          border-radius: var(--radius);
          background: none;
          padding: 6px 8px;
          color: var(--fg);

          &:hover {
            cursor: pointer;
            background: var(--bg-button-hover);
          }
        }

        .content {
          background-color: var(--bg-popup);
        }

        .listBox {
          padding: 4px;
          max-height: 360px;
          overflow: auto;
          list-style: none;
        }

        .item {
          padding: 4px;

          &:hover {
            cursor: pointer;
            background-color: var(--bg-button-hover);
          }

          :where(&[data-highlighted]) {
            outline: none;
            background-color: var(--bg-button-hover);
          }
        }
      `}</style>
    </Select.Root>
  );
};
