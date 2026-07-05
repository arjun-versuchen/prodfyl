/** Semantic design token class helpers — use these instead of hardcoded colors. */
export const tokens = {
  bg: 'bg-background',
  bgSurface: 'bg-surface',
  bgCard: 'bg-card',
  border: 'border-border',
  text: 'text-foreground',
  textMuted: 'text-muted',
  primary: 'text-primary',
  primaryBg: 'bg-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  accentBg: 'bg-accent',
  success: 'text-success',
  warning: 'text-warning',
  info: 'text-info',
  gradientBrand: 'bg-gradient-to-r from-primary to-accent',
  gradientText: 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent',
  card: 'rounded-2xl border border-border bg-card',
  cardHover: 'transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10',
  input:
    'w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20',
  btnPrimary:
    'inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:brightness-110 disabled:opacity-50',
  btnSecondary:
    'inline-flex items-center justify-center rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40',
} as const
