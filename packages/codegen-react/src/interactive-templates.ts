import type { UIHFile, LayoutBlock, Node } from "uih-parser";

/**
 * Interactive template injection for hybrid workflow
 * Adds smart placeholders to generated code for Claude Code to implement
 */

export interface InteractiveOptions {
  features?: string[]; // ["validation", "api", "animation", "modal", "tabs"]
}

export interface DetectedFeatures {
  hasForm: boolean;
  hasInputs: InputField[];
  hasButtons: boolean;
  hasModal: boolean;
  hasTabs: boolean;
  needsValidation: boolean;
  needsApi: boolean;
}

export interface InputField {
  name?: string;
  type: string;
  required?: boolean;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

/**
 * Detect features from UIH AST
 */
export function detectFeatures(file: UIHFile): DetectedFeatures {
  const layout = file.blocks.find((b) => b.type === "Layout") as LayoutBlock | undefined;

  if (!layout) {
    return {
      hasForm: false,
      hasInputs: [],
      hasButtons: false,
      hasModal: false,
      hasTabs: false,
      needsValidation: false,
      needsApi: false,
    };
  }

  let hasForm = false;
  let hasButtons = false;
  let hasModal = false;
  let hasTabs = false;
  const inputs: InputField[] = [];

  // Recursive node traversal
  function traverse(nodes: Node[]) {
    for (const node of nodes) {
      if (node.kind === "Element") {
        const name = (node as any).name;

        // Detect Form
        if (name === "Form") {
          hasForm = true;
        }

        // Detect Input fields
        if (name === "Input" || name === "Textarea") {
          const props = Object.fromEntries(
            ((node as any).props || []).map((p: any) => [p.key, String(p.value)])
          );

          // Use name or id as fallback
          const fieldName = props.name || props.id;
          if (fieldName) {
            // Handle required attribute: can be "true", "{true}", true, or empty string
            const isRequired =
              props.required === "true" ||
              props.required === "{true}" ||
              props.required === true ||
              props.required === "";

            inputs.push({
              name: fieldName,
              type: props.type || "text",
              required: isRequired,
            });
          }
        }

        // Detect Button
        if (name === "Button") {
          hasButtons = true;
        }

        // Detect Modal/Dialog
        if (name === "Dialog" || name === "Modal" || name === "Sheet") {
          hasModal = true;
        }

        // Detect Tabs
        if (name === "Tabs" || name === "Accordion") {
          hasTabs = true;
        }

        // Recurse into children
        if ((node as any).children) {
          traverse((node as any).children);
        }
      } else if (node.kind === "Conditional") {
        traverse((node as any).thenNodes || []);
        traverse((node as any).elseNodes || []);
      } else if (node.kind === "Loop") {
        traverse((node as any).children || []);
      }
    }
  }

  traverse(layout.nodes);

  return {
    hasForm,
    hasInputs: inputs,
    hasButtons,
    hasModal,
    hasTabs,
    needsValidation: hasForm && inputs.length > 0,
    needsApi: hasForm && hasButtons,
  };
}

/**
 * Inject interactive placeholders into generated React code
 */
export function injectInteractivePlaceholders(
  code: string,
  features: DetectedFeatures,
  options: InteractiveOptions = {}
): string {
  // Don't inject if no interactive features detected
  if (!features.hasForm && !features.hasModal && !features.hasTabs) {
    return code;
  }

  const lines = code.split("\n");
  const result: string[] = [];

  // Find the component function line
  const componentIndex = lines.findIndex((line) => line.includes("export default function"));

  if (componentIndex === -1) {
    return code; // Can't find component, return original
  }

  // Add imports at the top if needed
  if (features.hasForm && features.hasInputs.length > 0) {
    const importIndex = lines.findIndex((line) => line.startsWith("import"));
    if (importIndex !== -1) {
      // Find last import
      let lastImportIndex = importIndex;
      for (let i = importIndex; i < lines.length; i++) {
        if (lines[i].startsWith("import") || lines[i].trim() === "") {
          lastImportIndex = i;
        } else {
          break;
        }
      }

      // Insert useState import if not present
      if (!code.includes('from "react"') && !code.includes("from 'react'")) {
        lines.splice(lastImportIndex + 1, 0, 'import { useState } from "react";');
      }
    }
  }

  // Rebuild lines array after potential import insertion
  const updatedLines = lines;

  // Find component body start (after function declaration)
  let bodyStartIndex = componentIndex + 1;
  for (let i = componentIndex; i < updatedLines.length; i++) {
    if (updatedLines[i].includes("{")) {
      bodyStartIndex = i + 1;
      break;
    }
  }

  // Inject state management placeholder
  if (features.hasForm && features.hasInputs.length > 0) {
    const stateTemplate = generateStatePlaceholder(features.hasInputs);
    updatedLines.splice(bodyStartIndex, 0, stateTemplate);
  }

  // Inject validation placeholder
  if (features.needsValidation && (options.features?.includes("validation") ?? true)) {
    const validationTemplate = generateValidationPlaceholder(features.hasInputs);
    updatedLines.splice(bodyStartIndex + 1, 0, validationTemplate);
  }

  // Inject submit handler placeholder
  if (features.needsApi && (options.features?.includes("api") ?? true)) {
    const submitTemplate = generateSubmitPlaceholder(features.hasInputs);
    updatedLines.splice(bodyStartIndex + 2, 0, submitTemplate);
  }

  // Inject input handler placeholder
  if (features.hasForm && features.hasInputs.length > 0) {
    const inputTemplate = generateInputHandlerPlaceholder();
    updatedLines.splice(bodyStartIndex + 3, 0, inputTemplate);
  }

  // Inject modal state placeholder
  if (features.hasModal && (options.features?.includes("modal") ?? true)) {
    const modalTemplate = generateModalPlaceholder();
    updatedLines.splice(bodyStartIndex + 4, 0, modalTemplate);
  }

  // Inject tabs state placeholder
  if (features.hasTabs && (options.features?.includes("tabs") ?? true)) {
    const tabsTemplate = generateTabsPlaceholder();
    updatedLines.splice(bodyStartIndex + 5, 0, tabsTemplate);
  }

  return updatedLines.join("\n");
}

/**
 * Generate state management placeholder
 */
export function generateStatePlaceholder(inputs: InputField[]): string {
  const fields = inputs
    .filter((input) => input.name)
    .map((input) => `${input.name}: ''`)
    .join(",\n    ");

  return `
  // 🤖 AUTO-IMPLEMENT: Form state management
  // Detected inputs: ${inputs.map((i) => `${i.name} (type: ${i.type})`).join(", ")}
  const [formData, setFormData] = useState({
    ${fields}
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
`;
}

/**
 * Generate validation placeholder
 */
export function generateValidationPlaceholder(inputs: InputField[]): string {
  const validations = inputs
    .filter((input) => input.name)
    .map((input) => {
      const checks: string[] = [];

      // Required check
      if (input.required) {
        checks.push(`if (!formData.${input.name}) {
      newErrors.${input.name} = '${capitalize(input.name || "Field")} is required';
    }`);
      }

      // Email validation
      if (input.type === "email") {
        const prefix = checks.length > 0 ? "else if" : "if";
        checks.push(`${prefix} (!/\\S+@\\S+\\.\\S+/.test(formData.${input.name})) {
      newErrors.${input.name} = 'Invalid email format';
    }`);
      }

      // Password validation
      if (input.type === "password") {
        const prefix = checks.length > 0 ? "else if" : "if";
        checks.push(`${prefix} (formData.${input.name}.length < 8) {
      newErrors.${input.name} = 'Password must be at least 8 characters';
    }`);
      }

      return checks.join(" ");
    })
    .join("\n\n    ");

  return `
  // 🤖 AUTO-IMPLEMENT: Form validation logic
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    ${validations}

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
`;
}

/**
 * Generate submit handler placeholder
 */
export function generateSubmitPlaceholder(inputs: InputField[]): string {
  return `
  // 🤖 AUTO-IMPLEMENT: Form submit handler with API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 🤖 TODO: Replace with your API endpoint
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const data = await response.json();

      // 🤖 TODO: Handle successful submission (e.g., redirect, show success message)
      console.log('Success:', data);

    } catch (error) {
      setErrors({ submit: 'Submission failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
`;
}

/**
 * Generate input handler placeholder
 */
export function generateInputHandlerPlaceholder(): string {
  return `
  // 🤖 AUTO-IMPLEMENT: Input change handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
`;
}

/**
 * Generate modal state placeholder
 */
function generateModalPlaceholder(): string {
  return `
  // 🤖 AUTO-IMPLEMENT: Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
`;
}

/**
 * Generate tabs state placeholder
 */
function generateTabsPlaceholder(): string {
  return `
  // 🤖 AUTO-IMPLEMENT: Tab state management
  const [activeTab, setActiveTab] = useState('tab1');
`;
}

/**
 * Helper: Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
