# Tailwind Migration Design

## Goal
Migrate the CMS from custom CSS files to Tailwind CSS v4 with a pragmatic visual match (same layout and brand colors, simplified utilities).

## Approach
1. Install `tailwindcss` + `@tailwindcss/vite`.
2. Global `theme.css` becomes Tailwind entry with `@import "tailwindcss"` and `@theme` tokens for accent, surfaces, sidebar width, etc.
3. Rewrite layouts and pages with utility classes; delete co-located `.css` files.
4. Keep routes, components, and behavior unchanged.

## Out of scope
Pixel-perfect replication of every custom CSS rule; design restyling.
