import { Component } from "solid-js";
import { NodeViewContent } from "@app/tiptap-solid";
import { NodeViewProps } from "@tiptap/core";
import { all } from "lowlight";
import { SelectBox } from "~/shared/ui/menu";
import "./theme.css";

export const CodeBlock: Component<NodeViewProps> = (props) => {
  return (
    <div class="CodeBlock">
      <SelectBox
        options={Object.keys(all)}
        defaultValue={
          Object.hasOwn(all, props.node.attrs.language as string) ? (props.node.attrs.language as string) : "plaintext"
        }
        onChange={(value) => {
          props.updateAttributes({
            language: value,
          });
        }}
      />
      <pre class="code">
        <code>
          <NodeViewContent />
        </code>
      </pre>
      <style jsx>{`
        .CodeBlock {
          border-radius: var(--radius);
          background-color: var(--bg-code);
          padding: 4px;
        }

        .code {
          margin-top: 10px;
          padding: 4px 8px;
          font-size: 0.8em;
        }
      `}</style>
    </div>
  );
};
