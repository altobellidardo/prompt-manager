export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: number;
}

export interface PromptStore {
  prompts: Prompt[];
  addPrompt: (prompt: Omit<Prompt, "id" | "createdAt">) => void;
  removePrompt: (id: string) => void;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
}
