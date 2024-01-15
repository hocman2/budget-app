/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      'mono': ['DM Mono', 'ui-monospace', 'monospace'],
      'sans': ['DM Sans', 'ui-sans-serif', 'sans-serif'],
    },
    extend: {
      colors: {
        "dark": "#252323",
        "accent-dark": "#8A53D7",
        "accent-light": "#B696E3",
        "accent-secondary": "#5DC095",
        "text": "#FFFFFF",
        "text-secondary": "#D6D6D6",
        "text-error": "#EB5B8E",
        "valid": "#50BFAB",
        "warning": "#CC8A27",
        "error": "#D24074",

        "chart-1": "#5DC095",
        "chart-2": "#316C6A",
        "chart-3": "#50BFAB",
        "chart-4": "#6395D0",
        "chart-5": "#5A7BD1",
        "chart-6": "#516AC3",
        "chart-7": "#E465E7",
        "chart-8": "#BF4DC9",
        "chart-9": "#9B4EAE",
        "chart-10": "#AC4A91",
      }
    },
  },
  plugins: [],
}

