# Hybrid Template Design

## Overview

UIH generates static UI structure + smart logic placeholders → Claude Code implements interactivity automatically.

## Workflow

```
User Request: "Login form with validation and API"
  ↓
[1] UIH MCP: Generate base structure
  ↓
[2] Inject Logic Placeholders: Smart TODO comments with context
  ↓
[3] Claude Code: Auto-implement based on placeholders
  ↓
Result: Fully interactive component
```

## Logic Placeholder Patterns

### Pattern 1: Form State Management

**Trigger**: Form, Input, Textarea detected

**React Template**:
```tsx
import { useState } from 'react';

export default function LoginForm() {
  // 🤖 AUTO-IMPLEMENT: Form state for email and password inputs
  // Detected inputs: email (type: email), password (type: password)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ... rest of component
}
```

**Vue Template**:
```vue
<script setup lang="ts">
import { ref } from 'vue';

// 🤖 AUTO-IMPLEMENT: Form state for email and password inputs
const formData = ref({
  email: '',
  password: ''
});

const errors = ref({});
const isLoading = ref(false);
</script>
```

**Svelte Template**:
```svelte
<script lang="ts">
  // 🤖 AUTO-IMPLEMENT: Form state for email and password inputs
  let formData = {
    email: '',
    password: ''
  };

  let errors = {};
  let isLoading = false;
</script>
```

---

### Pattern 2: Form Validation

**Trigger**: Form + validation keywords ("validation", "validate")

**React Template**:
```tsx
// 🤖 AUTO-IMPLEMENT: Form validation logic
// Required fields: email (must be valid email), password (min 8 chars)
const validateForm = () => {
  const newErrors: Record<string, string> = {};

  // Email validation
  if (!formData.email) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Email is invalid';
  }

  // Password validation
  if (!formData.password) {
    newErrors.password = 'Password is required';
  } else if (formData.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

---

### Pattern 3: Submit Handler

**Trigger**: Form + Button(type:"submit")

**React Template**:
```tsx
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
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();

    // 🤖 TODO: Handle successful login (e.g., redirect, store token)
    console.log('Login successful:', data);

  } catch (error) {
    setErrors({ submit: 'Login failed. Please try again.' });
  } finally {
    setIsLoading(false);
  }
};
```

---

### Pattern 4: Input Handlers

**Trigger**: Input, Textarea with state management

**React Template**:
```tsx
// 🤖 AUTO-IMPLEMENT: Input change handlers
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));

  // Clear error when user starts typing
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
};
```

---

### Pattern 5: Data Fetching

**Trigger**: Keywords ("fetch", "load", "api") in component description

**React Template**:
```tsx
import { useEffect, useState } from 'react';

export default function UserList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🤖 AUTO-IMPLEMENT: Data fetching logic
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // 🤖 TODO: Replace with your API endpoint
        const response = await fetch('/api/users');

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        setData(result);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // ... rest of component
}
```

---

### Pattern 6: Modal/Dialog State

**Trigger**: Dialog, Modal components

**React Template**:
```tsx
// 🤖 AUTO-IMPLEMENT: Modal state management
const [isOpen, setIsOpen] = useState(false);

const openModal = () => setIsOpen(true);
const closeModal = () => setIsOpen(false);

// ... in JSX
<Button onClick={openModal}>Open Modal</Button>
<Dialog open={isOpen} onClose={closeModal}>
  {/* content */}
</Dialog>
```

---

### Pattern 7: Tab/Accordion State

**Trigger**: Tabs, Accordion components

**React Template**:
```tsx
// 🤖 AUTO-IMPLEMENT: Tab state management
const [activeTab, setActiveTab] = useState('tab1');

// ... in JSX
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
</Tabs>
```

---

### Pattern 8: Animation/Transition

**Trigger**: Keywords ("animation", "transition", "fade")

**React Template**:
```tsx
import { useState } from 'react';

export default function AnimatedComponent() {
  // 🤖 AUTO-IMPLEMENT: Animation state
  const [isVisible, setIsVisible] = useState(false);

  // 🤖 TODO: Add framer-motion or CSS transition classes
  // Example with CSS:
  // className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}

  // Example with framer-motion:
  // <motion.div
  //   initial={{ opacity: 0 }}
  //   animate={{ opacity: isVisible ? 1 : 0 }}
  // />

  // ... rest of component
}
```

---

## Feature Detection Logic

### Input Detection
```typescript
interface InputField {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

function detectFormInputs(uihCode: string): InputField[] {
  // Parse UIH AST
  // Find all Input() components
  // Extract name, type, validation attributes
  // Return structured input metadata
}
```

### Feature Keywords
```typescript
const featureKeywords = {
  validation: ['validate', 'validation', 'required', 'error'],
  api: ['api', 'fetch', 'load', 'submit', 'post', 'get'],
  animation: ['animate', 'transition', 'fade', 'slide', 'motion'],
  modal: ['modal', 'dialog', 'popup', 'overlay'],
  tabs: ['tab', 'tabs', 'accordion', 'collapse'],
  auth: ['login', 'signin', 'signup', 'register', 'auth']
};

function detectFeatures(description: string): string[] {
  // Parse user description
  // Match against feature keywords
  // Return list of detected features
}
```

---

## MCP Integration

### Updated Tool Schema

```json
{
  "name": "compile_uih",
  "parameters": {
    "uih_code": "string",
    "target": "react | vue | svelte",
    "interactive": "boolean (default: false)",
    "features": "array of strings (optional)",
    "output_file": "string (optional)"
  }
}
```

### Example Usage

**Static Only (Current)**:
```
mcp__uih__compile_uih(
  uih_code: "layout { Button { 'Click' } }",
  target: "react"
)
→ Returns static JSX
```

**Interactive (NEW)**:
```
mcp__uih__compile_uih(
  uih_code: "layout { Form { Input(type:'email') Button { 'Submit' } } }",
  target: "react",
  interactive: true,
  features: ["validation", "api"]
)
→ Returns React component with:
   - useState for form fields
   - Validation logic placeholder
   - Submit handler with API call placeholder
   - Smart TODO comments for Claude Code
```

---

## Claude Code Auto-Implementation

When Claude Code sees generated template:

1. **Detect TODO Comments**: Scan for `🤖 TODO:` markers
2. **Understand Context**: Read surrounding code structure
3. **Implement Logic**:
   - Replace placeholders with actual implementation
   - Use context7 for API patterns if needed
   - Follow project conventions
4. **Validate**: Ensure type safety and best practices

### Example Flow

**Generated Template**:
```tsx
// 🤖 TODO: Replace with your API endpoint
const response = await fetch('/api/auth/login', { ... });
```

**Claude Code Implementation**:
```tsx
// Uses project's API client
const response = await apiClient.post('/auth/login', formData);
```

---

## Implementation Checklist

- [ ] Add `interactive` parameter to compile_uih
- [ ] Implement feature detection from UIH code
- [ ] Create placeholder injection system
- [ ] Generate framework-specific templates
- [ ] Add smart TODO comments with context
- [ ] Update MCP server schema
- [ ] Test with Claude Code workflow
- [ ] Document usage patterns
- [ ] Add examples to AI_GENERATION.md

---

## Benefits

✅ **For Users**: One command generates interactive components
✅ **For Claude Code**: Clear implementation guidance
✅ **For UIH**: Extends capability without complex logic block implementation
✅ **For Workflow**: Seamless handoff between static → dynamic

---

## Future Enhancements

- **Smart API Detection**: Recognize RESTful patterns, GraphQL
- **Framework Integration**: Detect Next.js, Nuxt, SvelteKit patterns
- **State Management**: Redux, Zustand, Pinia detection
- **Testing Scaffolds**: Generate test templates alongside component
- **Accessibility**: Auto-inject ARIA attributes and keyboard handlers

---

[← Back to Development](DEVELOPMENT.md)
