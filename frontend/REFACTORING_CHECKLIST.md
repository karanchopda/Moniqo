# Refactoring Checklist

Track progress on converting all components to the professional design system.

## ✅ Completed (11/26 - 42%)

### Core System
- [x] `src/app/globals.css` - Global styles
- [x] `src/styles/design-tokens.css` - Design tokens (new)

### Features Components
- [x] `src/components/Features/DeepAnalysisCard.tsx`
- [x] `src/components/Features/SmartAutomationCard.tsx`
- [x] `src/components/Features/MoneyLeaksCard.tsx`
- [x] `src/components/Features/FeaturesHero.tsx`

### Landing Components
- [x] `src/components/Landing/ArboretumFeatures.tsx`
- [x] `src/components/Landing/EmeraldHero.tsx`
- [x] `src/components/Landing/LandingHero.tsx`
- [x] `src/components/Landing/LandingNav.tsx`
- [x] `src/components/Landing/HowItWorks.tsx`

---

## 🔄 In Progress (0/26)

None currently

---

## 📋 To Do (15/26 - 58%)

### Landing Components (9 remaining)
- [ ] `src/components/Landing/EmeraldCoach.tsx`
- [ ] `src/components/Landing/LandingPricing.tsx`
- [ ] `src/components/Landing/TestimonialSection.tsx`
- [ ] `src/components/Landing/FAQSection.tsx`
- [ ] `src/components/Landing/PartnerSection.tsx`
- [ ] `src/components/Landing/SecuritySection.tsx`
- [ ] `src/components/Landing/ComparisonSection.tsx`
- [ ] `src/components/Landing/LandingFooter.tsx`
- [ ] `src/components/Landing/LandingFeatures.tsx`

### Features Components (3 remaining)
- [ ] `src/components/Features/AIPrivateMentor.tsx`
- [ ] `src/components/Features/BankStatementAudit.tsx`
- [ ] `src/components/Features/ExpertAnalyserView.tsx`
- [ ] `src/components/Features/FeaturesCTA.tsx`

### Pricing Components (3 remaining)
- [ ] `src/components/Pricing/PricingBenefits.tsx`
- [ ] `src/components/Pricing/PricingCards.tsx`
- [ ] `src/components/Pricing/PricingFAQ.tsx`

---

## 🎯 Refactoring Guidelines

For each component, ensure:

### Remove
- [ ] Framer-motion imports and animations
- [ ] Heavy shadows (shadow-2xl, shadow-3xl)
- [ ] `font-black` (900 weight)
- [ ] Excessive `uppercase` text
- [ ] Extreme `tracking-[0.5em]`
- [ ] Arbitrary border radius values
- [ ] Rotation/scale hover effects
- [ ] Decorative blur elements
- [ ] Low-contrast colors (text-primary/60)
- [ ] Random spacing values (p-16, gap-24)

### Add
- [ ] Standard card classes (`card`, `card-hover`)
- [ ] Professional shadows (`shadow-sm`, `shadow-md`)
- [ ] `font-bold` for headings
- [ ] Normal case text
- [ ] `text-muted` for body text
- [ ] Tailwind radius scale
- [ ] Simple hover effects (duration-200)
- [ ] Focus-visible states
- [ ] Semantic colors
- [ ] Systematic spacing (p-6, p-8)

### Verify
- [ ] No TypeScript errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Color contrast meets WCAG AA
- [ ] Text is readable
- [ ] Component is maintainable

---

## 📊 Estimated Time

- **Per Component**: 15-20 minutes
- **Remaining Components**: 15
- **Total Time**: ~4-6 hours

---

## 🎨 Quick Reference

### Standard Patterns

#### Card
```tsx
<div className="card card-hover p-6 md:p-8">
```

#### Button
```tsx
<button className="btn btn-primary">
```

#### Heading
```tsx
<h2 className="text-3xl md:text-4xl font-bold text-primary">
```

#### Body Text
```tsx
<p className="text-base text-muted">
```

#### Icon Container
```tsx
<div className="w-14 h-14 rounded-xl bg-accent/10">
```

---

## 📝 Notes

- Keep animations minimal (hero only)
- Use design system consistently
- Test accessibility
- Verify responsive design
- Document any new patterns

---

## 🔗 Resources

- Design System: `DESIGN_SYSTEM.md`
- Quick Start: `QUICK_START_GUIDE.md`
- Examples: Check completed components

---

*Last Updated: May 2026*
*Progress: 42% Complete*
