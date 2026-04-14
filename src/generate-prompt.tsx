import {
  Action,
  ActionPanel,
  Form,
  useNavigation,
  showToast,
  Toast,
  AI,
  environment,
  Icon,
} from "@raycast/api";
import { usePromptStore } from "./store/usePromptStore";
import { useState } from "react";

export default function Command() {
  const { pop } = useNavigation();
  const addPrompt = usePromptStore((state) => state.addPrompt);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: { intent: string }) {
    if (!values.intent) {
      showToast({
        style: Toast.Style.Failure,
        title: "Validation Error",
        description: "Please describe what prompt you want to generate",
      });
      return;
    }

    if (!environment.canAccess(AI)) {
      showToast({
        style: Toast.Style.Failure,
        title: "AI Access Error",
        description: "You need Raycast Pro to use this feature",
      });
      return;
    }

    setIsLoading(true);
    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Generating prompt...",
    });

    try {
      const prompt = `You are an expert prompt engineer. The user wants a prompt for: "${values.intent}".
      Return a JSON object with the following structure:
      {
        "title": "A short, descriptive title",
        "content": "The full prompt content, using {{variable}} syntax for placeholders if appropriate",
        "tags": ["tag1", "tag2"]
      }
      Return ONLY the JSON. Avoid markdown formatting blocks.`;

      const response = await AI.ask(prompt);
      
      // Robust JSON extraction
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not find a valid JSON response from AI");
      }

      const generated = JSON.parse(jsonMatch[0]);

      if (!generated.title || !generated.content) {
        throw new Error("AI generated an incomplete prompt");
      }

      addPrompt({
        title: generated.title,
        content: generated.content,
        tags: generated.tags || [],
      });

      toast.style = Toast.Style.Success;
      toast.title = "Prompt Generated and Saved";
      pop();
    } catch (error) {
      toast.style = Toast.Style.Failure;
      toast.title = "Failed to generate prompt";
      toast.description = error instanceof Error ? error.message : String(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm 
            title="Generate with AI" 
            icon={Icon.MagicWand} 
            onSubmit={handleSubmit} 
          />
        </ActionPanel>
      }
    >
      <Form.Description 
        text="Raycast AI will help you craft a high-quality prompt template including a title, content, and relevant tags." 
      />
      <Form.TextArea 
        id="intent" 
        title="What should this prompt do?" 
        placeholder="e.g. A prompt to help me refactor complex React components into smaller functional components" 
        info="Be descriptive for better results."
      />
    </Form>
  );
}
