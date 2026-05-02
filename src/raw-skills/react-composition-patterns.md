---
name: react-composition-patterns
description: Advanced React component composition patterns focusing on modularity, flexibility, and render performance. Use when building complex UI systems or internal component libraries.
---

# React Composition Patterns & Architecture

Composition is the preferred way to reuse code in React over inheritance. This skill covers specific patterns to build highly flexible and performant component trees.

## 1. Composition over Props Drilling
Instead of passing "leaf" data through many intermediaries, pass the component itself or its children.

```tsx
// ❌ Props Drilling
<Layout user={user} /> // Layout passes user to Header, Header to Avatar...

// ✅ Composition
<Layout>
  <Header>
    <Avatar user={user} />
  </Header>
</Layout>
```

## 2. Compound Components
Group related components together to manage internal state while giving users control over layout.

```tsx
<Tabs defaultValue="home">
  <TabsList>
    <TabsTrigger value="home">Home</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="home">...</TabsContent>
</Tabs>
```

## 3. Render Props & Children as Function
Enables passing logic while keeping the UI flexible.

```tsx
<DataProvider render={(data) => <Display data={data} />} />
```

## 4. Slot Pattern
Use named slots for complex layouts instead of a single `children` prop.

```tsx
function Page({ header, sidebar, main, footer }) {
  return (
    <div className="grid">
      <header>{header}</header>
      <div className="flex">
        <aside>{sidebar}</aside>
        <main>{main}</main>
      </div>
      <footer>{footer}</footer>
    </div>
  )
}
```

## 5. Controlled vs Uncontrolled Components
- **Controlled:** State is managed by the parent. Best for synchronization.
- **Uncontrolled:** State is managed internally. Best for performance and simple forms.

## 6. Higher-Order Components (HOCs)
Use sparingly for cross-cutting concerns (e.g., Auth guards, logging) but prefer Hooks for logic reuse.
