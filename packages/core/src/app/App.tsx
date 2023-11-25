import { Component } from "solid-js";
import { createPlatformConfigs, PlatformConfigs, PlatformConfigsCtx } from "~/shared/lib";
import { createEditorExtensions, EditorExtensionsCtx } from "~/entities/editor-area";
import { TextEditor } from "~/widgets/text-editor";

interface AppProps {
  initialPlatformConfigs: Partial<PlatformConfigs>;
}

export const App: Component<AppProps> = (props) => {
  const extensions = createEditorExtensions();
  const platformApi = createPlatformConfigs(props.initialPlatformConfigs);

  return (
    <PlatformConfigsCtx.Provider value={platformApi}>
      <EditorExtensionsCtx.Provider value={extensions}>
        <TextEditor />
      </EditorExtensionsCtx.Provider>
    </PlatformConfigsCtx.Provider>
  );
};
