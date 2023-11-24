import { Dynamic } from "solid-js/web";

export const MenuButton: typeof Dynamic = (props) => {
  return (
    <>
      <Dynamic {...props} component={props.component} class="MenuButton" />
      <style jsx>{`
        .MenuButton {
          display: flex;
          align-items: center;
          transition: 0.3s;
          cursor: pointer;
          border: none;
          border-radius: var(--radius);
          background-color: transparent;
          padding: 4px;
          color: var(--fg);
          font-size: var(--text-base);

          &:hover {
            background: var(--bg-button-hover);
            color: var(--color-primary);
          }

          &:active {
            background: var(--bg-button-active);
          }
        }
      `}</style>
    </>
  );
};
