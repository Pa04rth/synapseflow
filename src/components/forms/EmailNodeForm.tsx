import React, { useState, useEffect } from "react";

export const EmailNodeForm = ({
  node,
  onUpdate,
}: {
  node: any;
  onUpdate: (nodeId: string, data: any) => void;
}) => {
  type FormState = {
    to: string;
    subject: string;
    body: string;
  };

  type FormErrors = Partial<Record<keyof FormState, string>>;

  const [form, setForm] = useState<FormState>({
    to: node.data.to || "",
    subject: node.data.subject || "",
    body: node.data.body || "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (values: FormState): FormErrors => {
    const errs: FormErrors = {};
    if (!values.to.trim()) {
      errs.to = "Reciever email is required.";
    }
    if (!values.subject.trim()) {
      errs.subject = "Subject is required.";
    }
    if (!values.body.trim()) {
      errs.body = "Body is required.";
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
      to: node.data.to || "",
      subject: node.data.subject || "",
      body: node.data.body || "",
    });
  }, [node.id, node.data]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      onUpdate(node.id, form);

      // // Reset form after submission
      // setForm({ to: "", subject: "", body: "" });

      // Hide success message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div>
      <h2>{node.data.label}</h2>
      {submitted && (
        <p style={{ color: "green" }}>Form submitted successfully!</p>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="to">To</label>
          <input
            id="to"
            type="text"
            title="Enter reciever's email"
            placeholder="Enter reciever's email"
            value={form.to}
            onChange={handleChange}
          />
          {errors.to && <p style={{ color: "red" }}>{errors.to}</p>}
        </div>
        <div>
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            type="text"
            title="Enter the subject"
            placeholder="Enter the subject"
            value={form.subject}
            onChange={handleChange}
          />
          {errors.subject && <p style={{ color: "red" }}>{errors.subject}</p>}
        </div>
        <div>
          <label htmlFor="body">Body</label>
          <textarea
            id="body"
            title="Enter the body"
            value={form.body}
            placeholder="Enter the body"
          ></textarea>
          {errors.body && <p style={{ color: "red" }}>{errors.body}</p>}
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};
