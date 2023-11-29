import { Extension } from "@tiptap/core";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import "../ui/taskList.css";

export const TaskListExt = Extension.create({
  addExtensions() {
    return [
      TaskList.configure({ HTMLAttributes: { class: "TaskList" } }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "TaskItem",
        },
      }),
    ];
  },
});
