/* Tailwind is wired to the CSS tokens so utility classes and components never drift. */
const ch = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;
const scale = (n, steps) => Object.fromEntries(steps.map((s) => [s, ch(`${n}-${s}`)]));

tailwind.config = {
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'] },
      colors: {
        ink: { DEFAULT: ch('ink'), 2: ch('ink-2') },
        brand: scale('brand', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        accent: { ...scale('accent', [300, 400, 500, 600]), text: ch('accent-text') },
        text: { 1: ch('text-1'), 2: ch('text-2'), 3: ch('text-3') },
        line: ch('line'),
      },
      borderRadius: { sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)', xl: 'var(--radius-xl)', '2xl': 'var(--radius-2xl)' },
      boxShadow: { glow: 'var(--glow-brand)', 'glow-accent': 'var(--glow-accent)' },
    },
  },
};
