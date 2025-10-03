import React, { useState, useEffect } from "react";
import { saveCredential } from "../../services/api";

export const AiNodeForm = ({
  node,
  onUpdate,
}: {
  node: any;
  onUpdate: (nodeId: string, data: any) => void;
}) => {
  type FormState = {
    prompt: string;
    apiKey: string;
  };

  type FormErrors = Partial<Record<keyof FormState, string>>;

  const [form, setForm] = useState<FormState>({
    prompt: node.data.prompt || "",
    apiKey: node.data.apiKey || "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (values: FormState): FormErrors => {
    const errs: FormErrors = {};
    if (!values.prompt.trim()) {
      errs.prompt = "Prompt is required.";
    }
    if (!values.apiKey.trim()) {
      errs.apiKey = "API Key is required.";
    }
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  useEffect(() => {
    setForm({
      prompt: node.data.prompt || "",
      apiKey: node.data.apiKey || "",
    });
  }, [node.id, node.data]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await saveCredential({
          type: "OPENAI_API_KEY",
          value: form.apiKey,
          userId: "user-123",
        });

        onUpdate(node.id, { prompt: form.prompt });

        setSubmitted(true);

        setTimeout(() => setSubmitted(false), 3000);
      } catch (error) {
        console.error("Failed to save data:", error);
      }
    }
  };

  return (
    <div>
      <h2>{node.data.label} Form</h2>
      {submitted && (
        <p style={{ color: "green" }}>Form submitted successfully!</p>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="prompt">Prompt</label>
          <input
            id="prompt"
            type="text"
            title="Enter your prompt"
            placeholder="Enter your prompt"
            value={form.prompt}
            onChange={handleChange}
          />
          {errors.prompt && <p style={{ color: "red" }}>{errors.prompt}</p>}
        </div>
        <div>
          <label htmlFor="apiKey">API Key</label>
          <input
            id="apiKey"
            type="password"
            title="Enter your API Key"
            placeholder="Enter your API Key"
            value={form.apiKey}
            onChange={handleChange}
          />
          {errors.apiKey && <p style={{ color: "red" }}>{errors.apiKey}</p>}
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};
