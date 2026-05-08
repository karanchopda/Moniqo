# Design System Documentation

## Overview
This document outlines the professional design system implemented for Moniqo. The refactoring focused on removing excessive animations, standardizing shadows, improving typography, and creating a consistent, accessible design language.

---

## 🎨 Color System

### Primary Colors
- **Primary**: `#00331c` - Deep green for main brand elements
- **Primary Light**: `#004c2b` - Hover states and variations
- **Accent**: `#3fc580` - Vibrant emerald for CTAs and highlights
- **Secondary**: `#00473e` - Supporting brand color

### Semantic Colors
- **Background**: `#f8faf9` - Page background
- **Surface**: `#ffffff` - Card and component backgrounds
- **Muted**: `#6b7280` - Secondary text (gray-600)
- **Muted Foreground**: `#9ca3af` - Tertiary text (gray-400)

### Usage Guidelines
- Use `text-primary` for headings and important text
- Use `text-muted` for body text and descriptions
- Use `text-accent` sparingly for highlights and CTAs
- Ensure WCAG AA contrast compliance (4.5:1 minimum)

---

## 📏 Spacing Scale

### Consistent Spacing
- **Section Padding**: `py-24 md:py-32` (96px-128px)
- **Card Padding**: `p-6 md:p-8` (24px-32px)
- **Element Gaps**: `gap-6 md:gap-8` (24px-32px)
- **Component Spacing**: `space-y-6` or `space-y-8`

### Avoid
- Random values like `p-10`, `p-16`, `gap-16`
- Excessive spacing that creates visual disconnection

---

## 🔤 Typography

### Font Weights
- **Bold** (700): Headings and subheadings
- **Semibold** (600): Emphasis and labels
- **Medium** (500): Body text
- **Regular** (400): Default text

### Type Scale
```css
h1: text-4xl md:text-5xl lg:text-6xl (36px-48px-60px)
h2: text-3xl md:text-4xl lg:text-5xl (30px-36px-48px)
h3: text-2xl md:text-3xl (24px-30px)
h4: text-xl md:text-2xl (20px-24px)
body: text-base (16px)
small: text-sm (14px)
label: text-xs (12px)
```

### Guidelines
- **Avoid**: `font-black` (900 weight) everywhere
- **Avoid**: Excessive `uppercase` and extreme `tracking-[0.5em]`
- **Use**: Normal case for readability, uppercase only for labels
- **Use**: `tracking-tight` for headings, `tracking-wide` for labels

---

## 🎭 Shadows

### Shadow System
```css
shadow-sm: Subtle elevation for cards
shadow-md: Moderate elevation for hover states
shadow-lg: Strong elevation for modals/overlays
```

### Guidelines
- Use `shadow-sm` as default for cards
- Use `shadow-md` on hover for interactive elements
- **Avoid**: `shadow-2xl`, `shadow-3xl`, custom shadow values
- **Avoid**: Multiple layered shadows

---

## 📐 Border Radius

### Consistent Scale
- **Small**: `rounded-lg` (12px) - Buttons, small elements
- **Medium**: `rounded-xl` (16px) - Icons, badges
- **Large**: `rounded-2xl` (24px) - Cards
- **Extra Large**: `rounded-3xl` (32px) - Hero elements
- **Full**: `rounded-full` - Pills, circular elements

### Avoid
- Arbitrary values like `rounded-[40px]`, `rounded-[2.5rem]`
- Inconsistent radius across similar components

---

## 🎬 Animations

### Minimal Animation Philosophy
- **Remove**: 80% of framer-motion animations
- **Keep**: Hero section entrance animations only
- **Use**: CSS transitions for hover states (200ms)

### Allowed Animations
```css
transition-colors duration-200
transition-shadow duration-200
transition-all duration-200
```

### Forbidden
- Rotation effects on hover (`rotate-[15deg]`)
- Scale transformations on every element
- `whileInView` animations on cards
- Continuous animations (`animate-float`, `animate-ping`)
- Staggered children animations

---

## 🎯 Component Patterns

### Card Component
```tsx
<div className="card card-hover p-6 md:p-8">
  {/* Content */}
</div>
```

### Button Component
```tsx
// Primary
<button className="btn btn-primary">
  Label
  <span className="material-symbols-outlined">arrow_forward</span>
</button>

// Secondary
<button className="btn btn-secondary">
  Label
</button>
```

### Badge Component
```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
  <span className="w-2 h-2 rounded-full bg-accent"></span>
  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
    Label
  </span>
</div>
```

---

## ♿ Accessibility

### Focus States
All interactive elements must have visible focus states:
```css
focus-visible:outline-none 
focus-visible:ring-2 
focus-visible:ring-accent 
focus-visible:ring-offset-2
```

### Contrast Requirements
- Body text: 4.5:1 minimum (WCAG AA)
- Large text (18px+): 3:1 minimum
- Use `text-muted` (#6b7280) instead of opacity-based colors

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Logical tab order maintained
- Skip links for main content

---

## 🚫 What to Avoid

### Excessive Effects
- ❌ Glassmorphism on every component
- ❌ Heavy blur effects (`blur-3xl`, `blur-[140px]`)
- ❌ Decorative gradient overlays
- ❌ Absolute positioned decorative elements

### Typography Mistakes
- ❌ `font-black` everywhere
- ❌ `uppercase` on paragraphs
- ❌ Extreme letter-spacing (`tracking-[0.5em]`)
- ❌ Text sizes below 14px for body content

### Layout Issues
- ❌ Fixed heights that break responsively
- ❌ Inconsistent padding across breakpoints
- ❌ Too many nested wrapper divs

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: Default (< 768px)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)
- **Wide**: `xl:` (1280px+)

### Mobile-First Approach
```tsx
// Good
<div className="text-base md:text-lg lg:text-xl">

// Bad
<div className="text-xl md:text-base">
```

### Container Widths
- Max width: `max-w-7xl` (1280px)
- Padding: `px-6 md:px-8`

---

## 🎨 Icon Usage

### Material Symbols
- Default size: `text-xl` or `text-2xl`
- Remove custom `fontVariationSettings` unless necessary
- Use filled icons sparingly: `style={{ fontVariationSettings: "'FILL' 1" }}`

### Guidelines
- Use icons purposefully, not decoratively
- Maintain consistent sizing within sections
- Ensure proper color contrast

---

## 📦 Component Library

### Reusable Classes
```css
.card - Base card styling
.card-hover - Hover effect for cards
.btn - Base button styling
.btn-primary - Primary button variant
.btn-secondary - Secondary button variant
.text-muted - Muted text color
.glass-nav - Navigation glassmorphism
```

---

## 🔄 Migration Checklist

When refactoring components:

- [ ] Remove framer-motion imports (except hero)
- [ ] Replace `shadow-2xl` with `shadow-sm` or `shadow-md`
- [ ] Change `font-black` to `font-bold`
- [ ] Remove `uppercase` from body text
- [ ] Reduce `tracking-[0.5em]` to `tracking-wide`
- [ ] Replace arbitrary border radius with scale
- [ ] Remove rotation/scale hover effects
- [ ] Simplify nested div structure
- [ ] Add focus-visible states
- [ ] Test keyboard navigation
- [ ] Verify color contrast
- [ ] Check responsive behavior

---

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Symbols](https://fonts.google.com/icons)

---

## 🎯 Key Principles

1. **Simplicity over complexity** - Remove unnecessary visual effects
2. **Consistency over variety** - Use design tokens consistently
3. **Accessibility first** - Ensure all users can access content
4. **Performance matters** - Minimize animations and heavy effects
5. **Content is king** - Design should enhance, not distract from content

---

*Last Updated: May 2026*
