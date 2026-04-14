import { Action, ActionPanel, List, Icon } from "@raycast/api";
import { usePromptStore } from "./store/usePromptStore";
import CreatePromptForm from "./components/CreatePromptForm";

export default function Command() {
  const { prompts, removePrompt, isHydrated } = usePromptStore();

  return (
    <List isLoading={!isHydrated} searchBarPlaceholder="Search prompts...">
      <List.EmptyView
        title="No prompts yet"
        description="Save your first prompt to get started!"
        actions={
          <ActionPanel>
            <Action.Push
              title="Create New Prompt"
              icon={Icon.Plus}
              target={<CreatePromptForm />}
            />
          </ActionPanel>
        }
      />

      {prompts.map((prompt) => (
        <List.Item
          key={prompt.id}
          title={prompt.title}
          subtitle={prompt.tags?.join(", ")}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard
                title="Copy Content"
                content={prompt.content}
              />
              <Action.Push
                title="Create New Prompt"
                icon={Icon.Plus}
                target={<CreatePromptForm />}
              />
              <Action.SubmitForm
                title="Delete Prompt"
                icon={Icon.Trash}
                onSubmit={() => removePrompt(prompt.id)}
                shortcut={{ modifiers: ["ctrl"], key: "x" }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
