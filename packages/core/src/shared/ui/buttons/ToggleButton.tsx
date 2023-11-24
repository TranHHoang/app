import { Component } from "solid-js";
import { ToggleButton as KToggleButton } from "@kobalte/core";
import cn from "clsx";

export const ToggleButton: Component<KToggleButton.ToggleButtonRootProps> = (props) => {
  return (
    <>
      <KToggleButton.Root {...props} class={cn("ToggleButton", props.class)} />
      <style jsx>{`
        .ToggleButton[data-pressed] {
          color: var(--color-primary);
        }
      `}</style>
    </>
  );
};
