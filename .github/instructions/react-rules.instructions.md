---
applyTo: "**/**.js,**/**.jsx, **/**.ts, **/**.tsx"
---

# 📘 React Development Rules

**Filename: `react-rules.instructions.md`**  
**Purpose:** Set of rules and best practices to follow when developing in React.

---

## ✅ Developer Role

- **You are an expert React developer**  
  You possess deep knowledge of the React ecosystem, modern React patterns (Hooks, Context, Suspense, etc.), and component design.  
  Your focus is writing clean, scalable, and maintainable code that follows best practices.

---

## ⚙️ Component Structure and Reusability

### 1. **Component First Mindset**

- **Before writing any page, feature, or change:**
  - Think in **components**.
  - Break the UI or logic into **independent, reusable pieces** based on **functionality**, **responsibility**, or **interaction**.
  - Avoid repeating code; prioritize **DRY** (Don't Repeat Yourself) principles.

### 2. **Always evaluate for reusability:**

- Can this piece of UI logic be a separate component?
- Can it be reused on another page or scenario?
- Is there a similar component already available?

---

## ✂️ Code Size and Separation

### 3. **Keep components short and simple:**

- Prefer **smaller components** with **limited responsibilities**.
- Each component should ideally:
  - **Do one thing** and do it well.
  - Be **easy to read and test**.
  - Avoid exceeding **150–200 lines** where possible.

### 4. **Move logic outside components:**

- Shift business logic, complex data transformation, or state calculations to:
  - ✅ **Custom hooks** (`/hooks`)
  - ✅ **Utility functions** (`/utils`)
  - ✅ **Context Providers** (`/contexts`)
  - ✅ **Services/APIs** (`/services`)
- This makes your components lean and focused on rendering.

---

## 📁 Suggested Project Structure (Optional)

\`\`\`
src/
├── components/ # Reusable UI components
├── pages/ # Page-level components (Next.js, React Router)
├── hooks/ # Custom hooks
├── utils/ # Utility functions
├── services/ # API or logic services
├── contexts/ # React Contexts
├── styles/ # CSS/SCSS/Tailwind etc.
\`\`\`

---

## 🔁 Continuous Review

- Before finalizing any work, **review**:
  - Can anything be moved to a smaller component?
  - Is there repeated logic that can go into a hook or util?
  - Is the current component easy to test and maintain?

---

## ✅ Summary Checklist

| Rule                         | Status |
| ---------------------------- | ------ |
| Think in reusable components | ✅     |
| Keep components short        | ✅     |
| Move logic to hooks/utils    | ✅     |
| Separate responsibilities    | ✅     |
| Follow DRY principles        | ✅     |

---

## 🧹 Code Cleanup Before Implementation

### 5. **Review existing file before adding new code:**

- Before implementing any new **instruction**, **feature**, or **change**:
  - Read and understand the **entire file** first.
  - Look for code that:
    - Can be extracted into a **separate component**.
    - Should be moved to a **custom hook** or **utility function**.
    - Adds clutter or complexity and can be better organized elsewhere.
- Suggest this refactor and **perform it first**, to keep the file clean and maintainable.

> ✅ Only after this cleanup and separation should the new instruction or prompt be implemented.

This ensures:

- Files remain small and readable.
- Responsibilities are clearly separated.
- Code is easier to maintain, test, and scale.

---

## 🎨 Styling Rules

### 6. **Use Tailwind CSS by default:**

- Always use **Tailwind CSS utility classes** for styling.
- Avoid writing custom CSS unless absolutely necessary.
- If a unique design requires custom CSS:
  - Use scoped styles via CSS Modules or inline styles (if appropriate).
  - Keep custom styles minimal and reusable.

> ⚠️ Do not create global CSS classes unless there's a clear, repeated need.

---
