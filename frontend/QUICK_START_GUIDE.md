# Quick Start Guide - Professional Design System

## 🚀 For Developers

### When Creating New Components

#### 1. **Use Standard Card Pattern**
```tsx
// ✅ Good
<div className="card card-hover p-6 md:p-8">
  <h3 className="text-2xl font-bold text-primary mb-4">Title</h3>
  <p className="text-muted">Description</p>
</div>

// ❌ Avoid
<div className="bg-white border border-primary/5 rounded-[40px] p-16 shadow-2xl">
  <h3 className="text-5xl font-black uppercase tracking-[0.5em]">TITLE</h3>
  <p className="text-primary/60">Description</p>
</div>
```

#### 2. **Use Standard Button Pattern**
```tsx
// ✅ Primary Button
<button className="btn btn-primary">
  Click Me
  <span className="material-symbols-outlined">arrow_forward</span>
</button>

// ✅ Secondary Button
<button className="btn btn-secondary">
  Learn More
</button>

// ❌ Avoid
<button className="px-12 py-6 bg-accent text-primary rounded-full 
  font-black text-xs uppercase tracking-[0.3em] shadow-[0_25px_50px_rgba(0,51,28,0.3)] 
  hover:scale-105 active:scale-95 transition-all">
```

#### 3. **Typography Hierarchy**
```tsx
// ✅ Good
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
<h2 className="text-3xl md:text-4xl font-bold text-primary">
<h3 className="text-2xl md:text-3xl font-bold text-primary">
<p className="text-base text-muted">

// ❌ Avoid
<h1 className="text-9xl font-black uppercase tracking-tighter">
<h2 className="text-[5.5rem] font-headline font-black">
<p className="text-primary/60 font-medium">
```

#### 4. **Spacing**
```tsx
// ✅ Good - Consistent spacing
<section className="py-24 md:py-32 px-6 md:px-8">
  <div className="space-y-6">
    <div className="card p-6 md:p-8">

// ❌ Avoid - Random values
<section className="py-40 px-8">
  <div className="space-y-10">
    <div className="p-16">
```

#### 5. **No Animations (Except Hero)**
```tsx
// ✅ Good - Simple hover
<div className="card card-hover">

// ✅ Good - Hero only
<div className="animate-fadeInUp">

// ❌ Avoid - Everywhere
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.05, rotate: 15 }}
>
```

---

## 📋 Quick Reference

### Colors
```tsx
text-primary      // Headings
text-muted        // Body text
text-accent       // Highlights
bg-white          // Cards
bg-gray-50        // Sections
border-gray-100   // Borders
```

### Shadows
```tsx
shadow-sm         // Default cards
shadow-md         // Hover states
shadow-lg         // Modals
```

### Border Radius
```tsx
rounded-lg        // Small (12px)
rounded-xl        // Medium (16px)
rounded-2xl       // Large (24px)
rounded-full      // Pills
```

### Spacing
```tsx
p-6 md:p-8        // Card padding
py-24 md:py-32    // Section padding
gap-6 md:gap-8    // Grid gaps
space-y-6         // Vertical spacing
```

### Typography
```tsx
font-bold         // Headings
font-semibold     // Subheadings
font-medium       // Emphasis
text-sm           // Small (14px)
text-base         // Body (16px)
text-lg           // Large (18px)
```

---

## ✅ Checklist for New Components

Before committing:

- [ ] No framer-motion (unless hero section)
- [ ] Using `shadow-sm` or `shadow-md` (not shadow-2xl)
- [ ] Using `font-bold` (not font-black)
- [ ] Text is normal case (not uppercase everywhere)
- [ ] Using `text-muted` (not text-primary/60)
- [ ] Using standard spacing (p-6, p-8, not p-16)
- [ ] Using Tailwind radius scale (not arbitrary values)
- [ ] Has focus-visible states on interactive elements
- [ ] Responsive sizing (text-4xl md:text-5xl)
- [ ] No rotation/scale hover effects

---

## 🎨 Common Patterns

### Badge
```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
     bg-accent/10 border border-accent/20">
  <span className="w-2 h-2 rounded-full bg-accent"></span>
  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
    Label
  </span>
</div>
```

### Icon Container
```tsx
<div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
  <span className="material-symbols-outlined text-accent text-2xl">
    icon_name
  </span>
</div>
```

### Section Header
```tsx
<div className="text-center mb-16">
  <span className="inline-block text-accent font-semibold tracking-wider 
        text-sm uppercase mb-4 px-4 py-2 rounded-full bg-accent/10 
        border border-accent/20">
    Section Label
  </span>
  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
    Section Title
  </h2>
  <p className="text-lg md:text-xl text-muted leading-relaxed max-w-3xl mx-auto">
    Section description
  </p>
</div>
```

### Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
  {items.map((item) => (
    <div key={item.id} className="card card-hover p-6 md:p-8">
      {/* Content */}
    </div>
  ))}
</div>
```

---

## 🚫 Common Mistakes to Avoid

### 1. Over-styling
```tsx
// ❌ Bad
<div className="bg-white border border-primary/5 rounded-[40px] p-10 md:p-16 
     shadow-2xl relative overflow-hidden group">
  <div className="absolute inset-0 bg-gradient-to-r from-accent/5 
       to-transparent opacity-0 group-hover:opacity-100 
       transition-opacity duration-700 pointer-events-none"></div>
  <div className="relative z-10">

// ✅ Good
<div className="card card-hover p-6 md:p-8">
```

### 2. Typography Overload
```tsx
// ❌ Bad
<h3 className="text-5xl font-headline font-black uppercase 
     tracking-[0.5em] text-primary">

// ✅ Good
<h3 className="text-2xl md:text-3xl font-bold text-primary">
```

### 3. Animation Everywhere
```tsx
// ❌ Bad
<motion.div
  initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
  whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
  whileHover={{ y: -10, scale: 1.02 }}
  transition={{ duration: 1.2, delay: 0.6 }}
>

// ✅ Good
<div className="transition-shadow duration-200 hover:shadow-md">
```

### 4. Low Contrast
```tsx
// ❌ Bad
<p className="text-primary/60">

// ✅ Good
<p className="text-muted">
```

### 5. Arbitrary Values
```tsx
// ❌ Bad
<div className="rounded-[2.5rem] p-16 gap-24">

// ✅ Good
<div className="rounded-2xl p-8 gap-8">
```

---

## 🔧 VS Code Snippets

Add these to your snippets for faster development:

### Card Component
```json
"Professional Card": {
  "prefix": "card-pro",
  "body": [
    "<div className=\"card card-hover p-6 md:p-8\">",
    "  $0",
    "</div>"
  ]
}
```

### Button Primary
```json
"Primary Button": {
  "prefix": "btn-primary",
  "body": [
    "<button className=\"btn btn-primary\">",
    "  $1",
    "  <span className=\"material-symbols-outlined\">arrow_forward</span>",
    "</button>"
  ]
}
```

### Section Header
```json
"Section Header": {
  "prefix": "section-header",
  "body": [
    "<div className=\"text-center mb-16\">",
    "  <h2 className=\"text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6\">",
    "    $1",
    "  </h2>",
    "  <p className=\"text-lg md:text-xl text-muted leading-relaxed max-w-3xl mx-auto\">",
    "    $2",
    "  </p>",
    "</div>"
  ]
}
```

---

## 📚 Resources

- **Design System**: See `DESIGN_SYSTEM.md`
- **Comparison**: See `BEFORE_AFTER_COMPARISON.md`
- **Summary**: See `REFACTORING_SUMMARY.md`
- **Tailwind Docs**: https://tailwindcss.com/docs

---

## 🎯 Key Principles

1. **Simplicity First** - Remove before adding
2. **Consistency Always** - Use design tokens
3. **Content Focus** - Design enhances, not distracts
4. **Accessibility Required** - Focus states, contrast, keyboard nav
5. **Performance Matters** - Minimal animations, optimized assets

---

## 💬 Questions?

When in doubt:
1. Check existing refactored components
2. Review `DESIGN_SYSTEM.md`
3. Use the checklist above
4. Keep it simple and professional

---

*Remember: Professional design is about restraint, not excess.*
