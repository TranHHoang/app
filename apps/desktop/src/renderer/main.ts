import { mount } from "@app/core";

mount(document.querySelector("#root"), {
  openTextFile: window.electronApi.openTextFile,
  saveTextFile: window.electronApi.saveTextFile,
});
