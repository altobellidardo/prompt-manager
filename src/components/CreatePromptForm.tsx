import {
  Action,
  ActionPanel,
  Form,
  useNavigation,
  showToast,
  Toast,
} from "@raycast/api";
import { usePromptStore } from "../store/usePromptStore";

export default function CreatePromptForm() {
  const { pop } = useNavigation();
  const addPrompt = usePromptStore((state) => state.addPrompt);

  function handleSubmit(values: {
    title: string;
    content: string;
    tags: string;
  }) {
    if (!values.title || !values.content) {
      showToast({
        style: Toast.Style.Failure,
        title: "Validation Error",
        description: "Title and Content are required",
      });
      return;
    }

    const tagsArray = values.tags
      ? values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "")
      : [];

    addPrompt({
      title: values.title,
      content: values.content,
      tags: tagsArray,
    });

    showToast({
      style: Toast.Style.Success,
      title: "Prompt Saved",
    });

    pop();
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save Prompt" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="title"
        title="Title"
        placeholder="Enter prompt title"
      />
      <Form.TextArea
        id="content"
        title="Content"
        placeholder="Enter prompt content"
      />
      <Form.TextField
        id="tags"
        title="Tags"
        placeholder="Comma separated tags (e.g. coding, refactor)"
      />
    </Form>
  );
}
