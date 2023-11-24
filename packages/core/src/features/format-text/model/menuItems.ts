import { Component } from "solid-js";
import { ChainedCommands } from "@tiptap/core";
import { Icon } from "~/shared/ui/icons";

interface MenuItem {
  name: string;
  onCommand: (cmd: ChainedCommands) => ChainedCommands;
}

interface MenuIconItem extends MenuItem {
  icon: Component;
}

export const menuIconItems: MenuIconItem[] = [
  {
    name: "bold",
    icon: Icon.TextBold,
    onCommand: (cmd) => cmd.toggleBold(),
  },
  {
    name: "italic",
    icon: Icon.TextItalic,
    onCommand: (cmd) => cmd.toggleItalic(),
  },
  {
    name: "underline",
    icon: Icon.TextUnderline,
    onCommand: (cmd) => cmd.toggleUnderline(),
  },
  {
    name: "strike",
    icon: Icon.TextStrike,
    onCommand: (cmd) => cmd.toggleStrike(),
  },
  {
    name: "code",
    icon: Icon.TextCode,
    onCommand: (cmd) => cmd.toggleCode(),
  },
];
