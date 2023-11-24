import { Dynamic } from "solid-js/web";

export const FloatingMenu: typeof Dynamic = (props) => {
  return (
    <>
      <Dynamic {...props} component={props.component} class="FloatingMenu" />
      <style jsx>{`
        .FloatingMenu {
          display: flex;
          box-shadow:
            0 0 2px rgba(0 0 0 / 24%),
            0 8px 16px rgba(0 0 0 / 28%);
          border-radius: var(--radius);
          background-color: var(--bg-popup);
          padding: 4px;
        }
      `}</style>
    </>
  );
};
