# UIH Language Specification v1.0

**UIH (Universal UI Hierarchy)** is a meta-language designed to bridge human-written interface descriptions and AI-generated framework-specific components. This document defines the complete language specification.

---

## Table of Contents

1. [Language Overview](#language-overview)
2. [File Structure](#file-structure)
3. [Lexical Grammar](#lexical-grammar)
4. [Import Statements](#import-statements)
5. [Block Types](#block-types)
6. [Element System](#element-system)
7. [Props and Attributes](#props-and-attributes)
8. [Control Flow](#control-flow)
9. [Variable References](#variable-references)
10. [Type System](#type-system)
11. [Code Generation](#code-generation)
12. [Examples](#examples)

---

## Language Overview

### Design Principles

- **AI-First**: Optimized for LLM understanding and generation
- **Framework Agnostic**: Compiles to React, Vue, and Svelte
- **Declarative**: Focus on "what" not "how"
- **Type Safe**: Strong typing through AST validation
- **Human Readable**: Clean, minimal syntax

### File Extension

`.uih` - UIH source files

### Compilation

```bash
uih compile <input.uih> [outDir] --target <react|vue|svelte>
```

---

## File Structure

A UIH file consists of three parts:

```uih
# 1. Import Statements (optional)
import ComponentA, ComponentB from "./components"

# 2. Block Declarations (required)
meta {
  route: "/page";
}

layout {
  Button { "Click me" }
}

# 3. Additional Blocks (optional)
style { ... }
motion { ... }
logic { ... }
```

### File Anatomy

```
UIHFile
├── imports: ImportStatement[]
└── blocks: Block[]
```

---

## Lexical Grammar

### Comments

```uih
# Single-line comment
```

Multi-line comments are **not supported**.

### Identifiers

```
Identifier ::= [a-zA-Z_][a-zA-Z0-9_]*
```

Valid: `count`, `userName`, `_private`, `item2`
Invalid: `2count`, `user-name`, `class`

### Literals

**String Literal**:
```uih
"Hello, World!"
"/api/users"
```

**Number Literal**:
```uih
0
42
3.14
-10
```

**Boolean Literal**:
```uih
true
false
```

### Keywords

Reserved keywords: `meta`, `style`, `layout`, `motion`, `logic`, `state`, `data`, `i18n`, `bind`, `import`, `from`, `if`, `else`, `for`, `in`, `on`

---

## Import Statements

### Syntax

**Single Import**:
```uih
import ComponentName from "./path/to/Component.uih"
```

**Multiple Imports**:
```uih
import ComponentA, ComponentB, ComponentC from "./components"
```

### Grammar

```
ImportStatement ::= 'import' IdentifierList 'from' StringLiteral

IdentifierList ::= Identifier (',' Identifier)*
```

### Semantics

- Imports are resolved relative to the current file
- `.uih` extension is automatically stripped in generated code
- Imported components are used as custom elements in layout blocks
- Circular imports are **not allowed**

### Example

**Component Definition** (`components/Button.uih`):
```uih
state {
  count: 0;
}

layout {
  Button(variant:"primary") { "Click: {count}" }
}
```

**Using Imported Component**:
```uih
import CustomButton from "./components/Button.uih"

layout {
  CustomButton(variant:"secondary", size:"large")
}
```

---

## Block Types

### Overview

| Block | Purpose | Required | Multiple |
|-------|---------|----------|----------|
| `meta` | Page metadata | No | No |
| `style` | Design tokens (CSS variables) | No | No |
| `layout` | UI structure | **Yes** | No |
| `motion` | CSS animations | No | No |
| `logic` | Event handlers | No | No |
| `state` | Component state | No | No |
| `data` | Data fetching | No | No |
| `i18n` | Internationalization | No | No |
| `bind` | Data binding | No | No |

### 1. Meta Block

**Purpose**: Define page-level metadata (routing, theme, etc.)

**Syntax**:
```uih
meta {
  key: value;
  key: value;
}
```

**Grammar**:
```
MetaBlock ::= 'meta' '{' Entry* '}'
Entry ::= Identifier ':' Literal ';'
```

**Example**:
```uih
meta {
  route: "/dashboard";
  theme: "dark";
  title: "Dashboard";
}
```

**Common Properties**:
- `route`: Page route path
- `theme`: UI theme (`"light"` | `"dark"`)
- `title`: Page title

### 2. Style Block

**Purpose**: Define design tokens as CSS variables

**Syntax**:
```uih
style {
  token.name: "value";
  token.name: "value";
}
```

**Grammar**:
```
StyleBlock ::= 'style' '{' Token* '}'
Token ::= DottedIdentifier ':' StringLiteral ';'
DottedIdentifier ::= Identifier ('.' Identifier)*
```

**Example**:
```uih
style {
  color.primary: "#0E5EF7";
  color.secondary: "#64748b";
  color.success: "#10b981";
  spacing.card: "1.5rem";
  radius.button: "8px";
  font.heading: "Inter, sans-serif";
}
```

**Generated CSS**:
```css
:root {
  --color-primary: #0E5EF7;
  --color-secondary: #64748b;
  --color-success: #10b981;
  --spacing-card: 1.5rem;
  --radius-button: 8px;
  --font-heading: Inter, sans-serif;
}
```

**Usage in Layout**:
```uih
Button(class:"bg-[var(--color-primary)] text-white")
```

### 3. Layout Block

**Purpose**: Define UI component tree

**Syntax**:
```uih
layout [mode] {
  Node
  Node
  ...
}
```

**Grammar**:
```
LayoutBlock ::= 'layout' StringLiteral? '{' Node* '}'

Node ::= ElementNode | TextNode | ConditionalNode | LoopNode

ElementNode ::= Identifier '(' PropList? ')' ('{' Node* '}')?
TextNode ::= StringLiteral
ConditionalNode ::= 'if' '(' Expression ')' '{' Node* '}' ('else' '{' Node* '}')?
LoopNode ::= 'for' '(' Identifier 'in' Expression ')' '{' Node* '}'

PropList ::= Prop (',' Prop)*
Prop ::= Identifier ':' Literal | Identifier ':' VariableReference
```

**Example**:
```uih
layout "centered" {
  Card(id:"main-card") {
    H1(class:"text-3xl font-bold") { "Welcome" }
    P(class:"text-gray-600") { "Get started with UIH" }
  }

  Form(class:"space-y-4") {
    Input(placeholder:"Email", type:"email")
    Button(variant:"primary") { "Submit" }
  }
}
```

**Layout Modes**: Optional string label (e.g., `"centered"`, `"fullwidth"`)

### 4. State Block

**Purpose**: Declare reactive component state

**Syntax**:
```uih
state {
  variableName: initialValue;
  variableName: initialValue;
}
```

**Grammar**:
```
StateBlock ::= 'state' '{' StateDeclaration* '}'
StateDeclaration ::= Identifier ':' Literal ';'
```

**Example**:
```uih
state {
  count: 0;
  userName: "Guest";
  isActive: true;
  items: [];
}
```

**Generated Code**:

**React**:
```tsx
const [count, setCount] = useState(0);
const [userName, setUserName] = useState("Guest");
const [isActive, setIsActive] = useState(true);
```

**Vue**:
```vue
<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
const userName = ref("Guest");
const isActive = ref(true);
</script>
```

**Svelte**:
```svelte
<script lang="ts">
  let count = 0;
  let userName = "Guest";
  let isActive = true;
</script>
```

### 5. Data Block

**Purpose**: Declare data fetching operations

**Syntax**:
```uih
data {
  variableName: METHOD "url";
  variableName: METHOD "url";
}
```

**Grammar**:
```
DataBlock ::= 'data' '{' DataFetch* '}'
DataFetch ::= Identifier ':' HTTPMethod StringLiteral ';'
HTTPMethod ::= 'GET' | 'POST' | 'PUT' | 'DELETE'
```

**Example**:
```uih
data {
  users: GET "/api/users";
  posts: GET "/api/posts";
  profile: GET "/api/profile";
}
```

**Generated Variables**:

For each data fetch `users: GET "/api/users"`:
- `users` - Fetched data
- `usersLoading` - Loading state (boolean)
- `usersError` - Error object (if failed)

**React** (using SWR):
```tsx
import useSWR from "swr";

const { data: users, error: usersError, isLoading: usersLoading } =
  useSWR("/api/users", fetcher);
```

**Vue** (using composable):
```vue
<script setup lang="ts">
import { onMounted, ref } from "vue";

const users = ref(null);
const usersLoading = ref(true);
const usersError = ref(null);

onMounted(async () => {
  try {
    const response = await fetch("/api/users");
    users.value = await response.json();
  } catch (err) {
    usersError.value = err;
  } finally {
    usersLoading.value = false;
  }
});
</script>
```

### 6. Motion Block

**Purpose**: Define CSS animations and transitions

**Syntax**:
```uih
motion {
  on event(selector) {
    property: value;
    duration: "time";
  }
}
```

**Grammar**:
```
MotionBlock ::= 'motion' '{' MotionRule* '}'
MotionRule ::= 'on' MotionEvent '(' Selector ')' '{' MotionProp* '}'
MotionEvent ::= 'hover' | 'focus' | 'active'
Selector ::= '#' Identifier | '.' Identifier
MotionProp ::= MotionProperty ':' StringLiteral ';'
MotionProperty ::= 'scale' | 'opacity' | 'rotate' | 'x' | 'y' | 'duration'
```

**Example**:
```uih
motion {
  on hover(#card) {
    scale: "1.05";
    duration: "200ms";
  }
  on active(#button) {
    scale: "0.95";
    duration: "100ms";
  }
  on hover(.badge) {
    opacity: "0.8";
    duration: "150ms";
  }
}
```

**Generated CSS**:
```css
#card:hover {
  transform: scale(1.05);
  transition: all 200ms ease;
}

#button:active {
  transform: scale(0.95);
  transition: all 100ms ease;
}

.badge:hover {
  opacity: 0.8;
  transition: all 150ms ease;
}
```

**Supported Properties**:
- `scale` - Transform scale (`"1.05"`)
- `opacity` - Opacity (`"0.8"`)
- `rotate` - Rotation in degrees (`"90"`)
- `x` - TranslateX in pixels (`"10"`)
- `y` - TranslateY in pixels (`"-5"`)
- `duration` - Transition duration (`"200ms"`, `"0.3s"`)

### 7. Logic Block

**Purpose**: Define event handlers and application logic

**Syntax**:
```uih
logic {
  on eventName {
    action;
    action;
  }
}
```

**Grammar**:
```
LogicBlock ::= 'logic' '{' LogicEvent* '}'
LogicEvent ::= 'on' Identifier '{' Expr* '}'
Expr ::= NavigateExpr | ToastExpr | CallExpr | GuardExpr
NavigateExpr ::= 'navigate' ':' StringLiteral ';'
ToastExpr ::= 'toast' ':' StringLiteral ';'
CallExpr ::= 'call' ':' HTTPMethod StringLiteral ';'
GuardExpr ::= 'guard' ':' Expression ';'
```

**Example**:
```uih
logic {
  on submit {
    guard: "email && password";
    call: POST "/api/login";
    navigate: "/dashboard";
  }

  on cancel {
    toast: "Operation cancelled";
    navigate: "/home";
  }
}
```

**Generated React**:
```tsx
const handleSubmit = async () => {
  if (!(email && password)) return;
  await fetch("/api/login", { method: "POST" });
  window.location.href = "/dashboard";
};

const handleCancel = () => {
  alert("Operation cancelled");
  window.location.href = "/home";
};
```

### 8. I18n Block

**Purpose**: Define internationalization strings

**Syntax**:
```uih
i18n {
  key: {
    locale: "translation";
    locale: "translation";
  }
}
```

**Grammar**:
```
I18nBlock ::= 'i18n' '{' I18nEntry* '}'
I18nEntry ::= Identifier ':' '{' LocaleMap* '}' ';'
LocaleMap ::= Identifier ':' StringLiteral ';'
```

**Example**:
```uih
i18n {
  welcome: {
    en: "Welcome";
    ko: "환영합니다";
    ja: "ようこそ";
  }
  submit: {
    en: "Submit";
    ko: "제출";
    ja: "送信";
  }
}
```

### 9. Bind Block

**Purpose**: Bind UI elements to state variables

**Syntax**:
```uih
bind {
  elementId: variableName;
  elementId: variableName;
}
```

**Grammar**:
```
BindBlock ::= 'bind' '{' BindEntry* '}'
BindEntry ::= Identifier ':' Identifier ';'
```

**Example**:
```uih
state {
  email: "";
  password: "";
}

bind {
  emailInput: email;
  passwordInput: password;
}

layout {
  Input(id:"emailInput", type:"email")
  Input(id:"passwordInput", type:"password")
}
```

---

## Element System

### Element Types

UIH supports three categories of elements:

1. **HTML Elements** - Pure semantic HTML
2. **shadcn/ui Components** - Pre-built accessible components
3. **Custom Components** - User-defined imported components

### HTML Elements

**Layout Elements**:
- `Div`, `Section`, `Article`, `Aside`, `Header`, `Footer`, `Nav`, `Main`

**Text Elements**:
- `H1`, `H2`, `H3`, `H4`, `H5`, `H6`, `P`, `Span`

**Form Elements**:
- `Form`, `Input`, `Textarea`, `Button`, `Label`, `Select`, `Option`, `Fieldset`, `Legend`, `Checkbox`, `Radio`

**List Elements**:
- `Ul`, `Ol`, `Li`

**Media Elements**:
- `Video`, `Audio`, `Source`

**Table Elements**:
- `Table`, `Thead`, `Tbody`, `Tfoot`, `Tr`, `Td`, `Th`

**Canvas and SVG**:
- `Canvas`, `Svg`

**Other Elements**:
- `A` (links), `Img` (images)

### shadcn/ui Components

- `Card`, `Badge`, `Alert`, `Avatar`, `Dialog`, `Tooltip`, `Switch`, `Separator`, `Progress`, `Skeleton`, `Tabs`, `Accordion`

**Example**:
```uih
layout {
  Card {
    H2(class:"text-2xl font-bold") { "Title" }
    P { "Description" }
  }

  Badge(variant:"secondary") { "New" }

  Alert(variant:"destructive", title:"Error") {
    "Something went wrong"
  }
}
```

### Custom Components

Imported via `import` statement:

```uih
import CustomButton from "./components/Button.uih"

layout {
  CustomButton(variant:"primary", size:"lg")
}
```

---

## Props and Attributes

### Common Props

**All Elements**:
- `id` - Element identifier
- `class` - CSS classes (Tailwind supported)
- `aria-*` - Accessibility attributes
- `data-*` - Custom data attributes
- `role` - ARIA role

### Event Handlers

**Syntax**: `eventName:"{handlerName}"`

**Mouse Events**:
- `onClick`, `onDoubleClick`, `onMouseEnter`, `onMouseLeave`, `onMouseDown`, `onMouseUp`

**Form Events**:
- `onChange`, `onSubmit`, `onInput`, `onFocus`, `onBlur`, `onReset`

**Keyboard Events**:
- `onKeyDown`, `onKeyUp`, `onKeyPress`

**Media Events**:
- `onPlay`, `onPause`, `onEnded`, `onVolumeChange`, `onTimeUpdate`

**Example**:
```uih
Button(onClick:"{handleClick}", class:"btn-primary") { "Click me" }

Form(onSubmit:"{handleSubmit}", class:"space-y-4") {
  Input(onChange:"{handleChange}", onFocus:"{handleFocus}")
}

Video(onPlay:"{handlePlay}", onEnded:"{handleEnded}")
```

**Generated React**:
```tsx
<button onClick={handleClick} className="btn-primary">Click me</button>

<form onSubmit={handleSubmit} className="space-y-4">
  <input onChange={handleChange} onFocus={handleFocus} />
</form>

<video onPlay={handlePlay} onEnded={handleEnded} />
```

**Generated Vue**:
```vue
<button :onClick="handleClick" class="btn-primary">Click me</button>

<form :onSubmit="handleSubmit" class="space-y-4">
  <input :onChange="handleChange" :onFocus="handleFocus" />
</form>

<video :onPlay="handlePlay" :onEnded="handleEnded" />
```

### Element-Specific Props

**A (Anchor)**:
- `href`, `target`, `rel`

**Img (Image)**:
- `src`, `alt`, `width`, `height`

**Form**:
- `action`, `method`

**Input / Textarea**:
- `placeholder`, `type`, `value`, `disabled`, `required`

**Video / Audio**:
- `src`, `controls`, `autoplay`, `loop`, `muted`, `width`, `height`

**Source**:
- `src`, `type`

**Table Cells (Td / Th)**:
- `colspan`, `rowspan`, `scope` (Th only)

**Canvas**:
- `width`, `height`

**Svg**:
- `width`, `height`, `viewBox`

**Example**:
```uih
A(href:"https://example.com", target:"_blank", rel:"noopener") { "Link" }

Img(src:"/logo.png", alt:"Logo", width:"100", height:"50")

Input(placeholder:"Email", type:"email", required:true)

Video(src:"/video.mp4", controls:true, muted:true)

Th(scope:"col", colspan:"2") { "Header" }
```

### Accessibility Props

**ARIA Attributes**:
- `aria-label` - Accessible name
- `aria-describedby` - Reference to description
- `aria-required` - Required field indicator
- `aria-pressed` - Toggle button state
- `aria-expanded` - Expandable element state
- `aria-hidden` - Hide from screen readers

**Example**:
```uih
Button(
  onClick:"{handleClose}",
  aria-label:"Close dialog",
  aria-pressed:"false",
  role:"button"
) { "×" }

Input(
  type:"email",
  aria-required:"true",
  aria-describedby:"email-help"
)

Span(id:"email-help") { "We'll never share your email" }
```

---

## Control Flow

### Conditional Rendering

**Syntax**:
```uih
if (condition) {
  # then nodes
}

if (condition) {
  # then nodes
} else {
  # else nodes
}
```

**Grammar**:
```
ConditionalNode ::= 'if' '(' Expression ')' '{' Node* '}' ('else' '{' Node* '}')?
```

**Example**:
```uih
data {
  users: GET "/api/users";
}

layout {
  if (usersLoading) {
    Text { "Loading..." }
  }

  if (usersError) {
    Alert(variant:"destructive") { "Error loading users" }
  } else {
    Card { "Users loaded successfully" }
  }

  if (users) {
    Text { "Found {users.length} users" }
  }
}
```

**Generated React**:
```tsx
{usersLoading && <p>Loading...</p>}

{usersError ? (
  <Alert variant="destructive">Error loading users</Alert>
) : (
  <Card>Users loaded successfully</Card>
)}

{users && <p>Found {users.length} users</p>}
```

### Loop Rendering

**Syntax**:
```uih
for (item in collection) {
  # loop body
}
```

**Grammar**:
```
LoopNode ::= 'for' '(' Identifier 'in' Expression ')' '{' Node* '}'
```

**Example**:
```uih
layout {
  for (user in users) {
    Card(id:user.id) {
      H3 { user.name }
      P { user.email }
      Badge { user.role }
    }
  }

  for (product in products) {
    Div(class:"product-card") {
      Text { product.name }
      Text { product.price }
      Button(variant:"primary") { "Buy" }
    }
  }
}
```

**Generated React**:
```tsx
{users.map((user) => (
  <Card key={user.id || Math.random()} id={user.id}>
    <h3>{user.name}</h3>
    <p>{user.email}</p>
    <Badge>{user.role}</Badge>
  </Card>
))}

{products.map((product) => (
  <div key={product.id || Math.random()} className="product-card">
    <p>{product.name}</p>
    <p>{product.price}</p>
    <button variant="primary">Buy</button>
  </div>
))}
```

**Generated Vue**:
```vue
<Card v-for="user in users" :key="user.id || Math.random()" :id="user.id">
  <h3>{{ user.name }}</h3>
  <p>{{ user.email }}</p>
  <Badge>{{ user.role }}</Badge>
</Card>

<div v-for="product in products" :key="product.id || Math.random()" class="product-card">
  <p>{{ product.name }}</p>
  <p>{{ product.price }}</p>
  <button variant="primary">Buy</button>
</div>
```

---

## Variable References

### Syntax

Variables from `state` or `data` blocks can be referenced using curly braces:

**In Text Content**:
```uih
Text { "Count: {count}" }
Text { "User: {userName}" }
```

**In Props**:
```uih
Input(placeholder:{userName}, value:{email})
Button(disabled:{isLoading}) { "Submit" }
CustomComponent(count:{count}, name:{userName})
```

### Grammar

```
VariableReference ::= '{' Expression '}'
```

### Example

```uih
state {
  count: 0;
  userName: "홍길동";
  isActive: true;
}

layout {
  Text { "카운트: {count}" }
  Text { "사용자: {userName}" }

  Input(placeholder:{userName}, disabled:{isActive})

  CustomButton(count:{count}, variant:"primary")

  if (count > 0) {
    Badge { "Active: {count}" }
  }

  for (item in items) {
    Card(id:{item.id}) { item.name }
  }
}
```

**Generated React**:
```tsx
<p>카운트: {count}</p>
<p>사용자: {userName}</p>

<input placeholder={userName} disabled={isActive} />

<CustomButton count={count} variant="primary" />

{count > 0 && <Badge>Active: {count}</Badge>}

{items.map((item) => (
  <Card key={item.id || Math.random()} id={item.id}>
    {item.name}
  </Card>
))}
```

---

## Type System

### Literal Types

```typescript
type Literal = string | number | boolean;
```

**String**: `"Hello"`, `"/api/users"`, `"#0E5EF7"`
**Number**: `0`, `42`, `3.14`, `-10`
**Boolean**: `true`, `false`

### AST Types

Complete type definitions in `packages/parser/src/ast.ts`:

```typescript
interface UIHFile {
  type: "UIHFile";
  imports: ImportStatement[];
  blocks: Block[];
}

type Block =
  | MetaBlock
  | StyleBlock
  | LayoutBlock
  | MotionBlock
  | LogicBlock
  | StateBlock
  | DataBlock
  | I18nBlock
  | BindBlock;

type Node =
  | ElementNode
  | TextNode
  | ConditionalNode
  | LoopNode;
```

---

## Code Generation

### Compilation Pipeline

```
.uih file
    ↓
Parser (Chevrotain)
    ↓
AST (TypeScript types)
    ↓
Codegen (React/Vue/Svelte)
    ↓
.tsx / .vue / .svelte
```

### Framework-Specific Output

**React (.tsx)**:
- `class` → `className`
- `for` → `htmlFor`
- Event handlers: `onClick={handler}`
- Conditionals: `{condition && <Element />}`
- Loops: `{array.map(item => <Element />)}`

**Vue (.vue)**:
- `class` → `class` (native)
- Event handlers: `:onClick="handler"` (v-bind syntax)
- Conditionals: `v-if`, `v-else`
- Loops: `v-for="item in array"`

**Svelte (.svelte)**:
- `class` → `class` (native)
- Event handlers: `on:click={handler}`
- Conditionals: `{#if condition}...{/if}`
- Loops: `{#each array as item}...{/each}`

### CSS Variable Generation

**UIH Style Block**:
```uih
style {
  color.primary: "#0E5EF7";
  spacing.card: "1.5rem";
}
```

**Generated CSS**:
```css
:root {
  --color-primary: #0E5EF7;
  --spacing-card: 1.5rem;
}
```

**React Output**:
```tsx
<style dangerouslySetInnerHTML={{
  __html: `:root {
  --color-primary: #0E5EF7;
  --spacing-card: 1.5rem;
}`
}} />
```

**Vue/Svelte Output**:
```vue
<style scoped>
:root {
  --color-primary: #0E5EF7;
  --spacing-card: 1.5rem;
}
</style>
```

---

## Examples

### Complete Application

**File**: `examples/user-dashboard.uih`

```uih
import UserCard from "./components/UserCard.uih"
import DataTable from "./components/DataTable.uih"

meta {
  route: "/dashboard";
  theme: "light";
  title: "User Dashboard";
}

style {
  color.primary: "#0E5EF7";
  color.secondary: "#64748b";
  color.success: "#10b981";
  color.danger: "#ef4444";
  spacing.section: "2rem";
  radius.card: "16px";
}

state {
  searchQuery: "";
  selectedUser: null;
  isModalOpen: false;
}

data {
  users: GET "/api/users";
  analytics: GET "/api/analytics";
}

layout "dashboard" {
  Header(class:"bg-white shadow-sm px-6 py-4") {
    H1(class:"text-3xl font-bold text-[var(--color-primary)]") {
      "User Dashboard"
    }

    if (analytics) {
      Badge(variant:"secondary") {
        "Total Users: {analytics.totalUsers}"
      }
    }
  }

  Main(class:"container mx-auto px-6 py-8") {
    Section(class:"mb-8") {
      H2(class:"text-2xl font-semibold mb-4") { "Search Users" }

      Input(
        placeholder:"Search by name or email",
        value:{searchQuery},
        onChange:"{handleSearchChange}",
        class:"w-full px-4 py-2 border rounded-lg"
      )
    }

    Section(class:"space-y-4") {
      if (usersLoading) {
        Div(class:"flex items-center justify-center py-12") {
          Text(class:"text-gray-500") { "Loading users..." }
        }
      }

      if (usersError) {
        Alert(variant:"destructive", title:"Error") {
          "Failed to load users. Please try again."
        }
      }

      if (users) {
        for (user in users) {
          UserCard(
            id:{user.id},
            name:{user.name},
            email:{user.email},
            role:{user.role},
            onClick:"{handleUserClick}"
          )
        }
      }
    }

    if (isModalOpen) {
      Dialog(open:{isModalOpen}, onClose:"{handleCloseModal}") {
        H3(class:"text-xl font-bold mb-4") { "User Details" }

        if (selectedUser) {
          Div(class:"space-y-2") {
            P { "Name: {selectedUser.name}" }
            P { "Email: {selectedUser.email}" }
            P { "Role: {selectedUser.role}" }
          }
        }

        Button(
          onClick:"{handleCloseModal}",
          variant:"secondary",
          class:"mt-4"
        ) {
          "Close"
        }
      }
    }
  }

  Footer(class:"bg-gray-100 px-6 py-4 text-center") {
    P(class:"text-sm text-gray-600") {
      "© 2024 Dashboard. Built with UIH."
    }
  }
}

motion {
  on hover(.user-card) {
    scale: "1.02";
    duration: "200ms";
  }

  on active(.user-card) {
    scale: "0.98";
    duration: "100ms";
  }
}

logic {
  on userClick {
    call: GET "/api/users/{userId}";
    toast: "User selected";
  }

  on searchChange {
    call: GET "/api/users?search={searchQuery}";
  }

  on closeModal {
    navigate: "/dashboard";
  }
}
```

---

## Language Versioning

**Current Version**: v1.0

**Versioning Scheme**: Semantic Versioning (SemVer)
- **Major**: Breaking syntax changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes

---

## References

- **Parser**: `packages/parser/src/index.ts`
- **AST Types**: `packages/parser/src/ast.ts`
- **React Codegen**: `packages/codegen-react/src/index.ts`
- **Component Registry**: `packages/codegen-react/src/registry.ts`
- **Examples**: `examples/*.uih`

---

## Appendix: EBNF Grammar

```ebnf
(* UIH Language Grammar *)

UIHFile = { ImportStatement }, { Block } ;

ImportStatement = "import", IdentifierList, "from", StringLiteral ;
IdentifierList = Identifier, { ",", Identifier } ;

Block = MetaBlock
      | StyleBlock
      | LayoutBlock
      | StateBlock
      | DataBlock
      | MotionBlock
      | LogicBlock
      | I18nBlock
      | BindBlock ;

MetaBlock = "meta", "{", { Entry }, "}" ;
Entry = Identifier, ":", Literal, ";" ;

StyleBlock = "style", "{", { Token }, "}" ;
Token = DottedIdentifier, ":", StringLiteral, ";" ;
DottedIdentifier = Identifier, { ".", Identifier } ;

LayoutBlock = "layout", [ StringLiteral ], "{", { Node }, "}" ;

Node = ElementNode
     | TextNode
     | ConditionalNode
     | LoopNode ;

ElementNode = Identifier, "(", [ PropList ], ")", [ "{", { Node }, "}" ] ;
PropList = Prop, { ",", Prop } ;
Prop = Identifier, ":", ( Literal | VariableReference ) ;

TextNode = StringLiteral ;

ConditionalNode = "if", "(", Expression, ")", "{", { Node }, "}",
                  [ "else", "{", { Node }, "}" ] ;

LoopNode = "for", "(", Identifier, "in", Expression, ")", "{", { Node }, "}" ;

StateBlock = "state", "{", { StateDeclaration }, "}" ;
StateDeclaration = Identifier, ":", Literal, ";" ;

DataBlock = "data", "{", { DataFetch }, "}" ;
DataFetch = Identifier, ":", HTTPMethod, StringLiteral, ";" ;
HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" ;

MotionBlock = "motion", "{", { MotionRule }, "}" ;
MotionRule = "on", MotionEvent, "(", Selector, ")", "{", { MotionProp }, "}" ;
MotionEvent = "hover" | "focus" | "active" ;
Selector = "#", Identifier | ".", Identifier ;
MotionProp = MotionProperty, ":", StringLiteral, ";" ;
MotionProperty = "scale" | "opacity" | "rotate" | "x" | "y" | "duration" ;

LogicBlock = "logic", "{", { LogicEvent }, "}" ;
LogicEvent = "on", Identifier, "{", { Expr }, "}" ;
Expr = NavigateExpr | ToastExpr | CallExpr | GuardExpr ;
NavigateExpr = "navigate", ":", StringLiteral, ";" ;
ToastExpr = "toast", ":", StringLiteral, ";" ;
CallExpr = "call", ":", HTTPMethod, StringLiteral, ";" ;
GuardExpr = "guard", ":", Expression, ";" ;

I18nBlock = "i18n", "{", { I18nEntry }, "}" ;
I18nEntry = Identifier, ":", "{", { LocaleMap }, "}", ";" ;
LocaleMap = Identifier, ":", StringLiteral, ";" ;

BindBlock = "bind", "{", { BindEntry }, "}" ;
BindEntry = Identifier, ":", Identifier, ";" ;

VariableReference = "{", Expression, "}" ;

Literal = StringLiteral | NumberLiteral | BooleanLiteral ;
StringLiteral = '"', { character }, '"' ;
NumberLiteral = [ "-" ], digit, { digit }, [ ".", digit, { digit } ] ;
BooleanLiteral = "true" | "false" ;

Identifier = letter, { letter | digit | "_" } ;

Expression = (* Complex expression grammar - supports JS-like expressions *) ;
```

---

**End of Specification**

For implementation details, see:
- Repository: https://github.com/your-org/uih
- Documentation: https://uih-lang.org/docs
- Examples: `examples/` directory
