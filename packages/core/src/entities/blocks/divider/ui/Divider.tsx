import { Component } from "solid-js";

export const Divider: Component = () => {
  return (
    <>
      <div class="Divider" data-type="divider" />
      <style jsx>{`
        .Divider {
          position: relative;
          height: 14px;
          line-height: 1;

          &::before {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            border-bottom: 1px solid white;
            width: 100%;
            content: "";
          }
        }
      `}</style>
    </>
  );
};
