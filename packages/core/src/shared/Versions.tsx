import { type Component } from "solid-js";

export const Versions: Component = () => {
  return (
    <div>
      Hello world <span>XYZ</span>
      <style jsx>{`
        div {
          color: red;

          > span {
            color: green;
          }
        }
      `}</style>
    </div>
  );
};
