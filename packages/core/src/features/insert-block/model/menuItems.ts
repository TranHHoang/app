import { Component } from "solid-js";
import { ChainedCommands, Editor, Range } from "@tiptap/core";
import { Icon } from "~/shared/ui/icons";

interface MenuItemProps {
  editor: Editor;
  range: Range;
}

export interface MenuItem {
  title: string;
  icon: Component;
  onCommand: (props: MenuItemProps) => boolean;
}

function runCommand({ editor, range }: MenuItemProps, command: (cmd: ChainedCommands) => ChainedCommands): boolean {
  return command(editor.chain().focus().deleteRange(range)).run();
}

export const menuItems: MenuItem[] = [
  {
    title: "Heading 1",
    icon: Icon.TextH1,
    onCommand: (props) => runCommand(props, (cmd) => cmd.setNode("heading", { level: 1 })),
  },
  {
    title: "Heading 2",
    icon: Icon.TextH2,
    onCommand: (props) => runCommand(props, (cmd) => cmd.setNode("heading", { level: 2 })),
  },
  {
    title: "Heading 3",
    icon: Icon.TextH3,
    onCommand: (props) => runCommand(props, (cmd) => cmd.setNode("heading", { level: 3 })),
  },
  {
    title: "Bullet List",
    icon: Icon.BulletList,
    onCommand: (props) => runCommand(props, (cmd) => cmd.toggleBulletList()),
  },
  {
    title: "Numbered List",
    icon: Icon.NumberedList,
    onCommand: (props) => runCommand(props, (cmd) => cmd.toggleOrderedList()),
  },
  {
    title: "Quote",
    icon: Icon.Quotes,
    onCommand: (props) => runCommand(props, (cmd) => cmd.toggleNode("paragraph", "paragraph").toggleBlockquote()),
  },
  {
    title: "Divider",
    icon: Icon.Divider,
    onCommand: (props) => runCommand(props, (cmd) => cmd.setHorizontalRule()),
  },
  {
    title: "To-do List",
    icon: Icon.TaskList,
    onCommand: (props) => runCommand(props, (cmd) => cmd.toggleTaskList()),
  },
];
