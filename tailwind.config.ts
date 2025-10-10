import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "ancient-gold": "hsl(var(--ancient-gold))",
        "ancient-silver": "hsl(var(--ancient-silver))",
        "ancient-patina": "hsl(var(--ancient-patina))",
        "imperial-bronze": "hsl(var(--imperial-bronze))",
        "temple-marble": "hsl(var(--temple-marble))",
        "obsidian-core": "hsl(var(--obsidian-core))",
        "vita-flame": "hsl(var(--vita-flame))",
        "laurel-green": "hsl(var(--laurel-green))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        ancient: ['Ancient', 'serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Menlo', 'monospace'],
        cinzel: ['Cinzel', 'serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" }
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "parallax": {
          "0%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(-8px)" }
        },
        "marble-float": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)", opacity: "0.3" },
          "50%": { transform: "translateY(-20px) translateX(10px)", opacity: "0.6" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in var(--duration-base) var(--spring)",
        "fade-out": "fade-out var(--duration-base) var(--spring)",
        "scale-in": "scale-in var(--duration-fast) var(--spring)",
        "slide-up": "slide-up var(--duration-slow) var(--spring)",
        "parallax": "parallax 1s ease-out forwards",
        "marble-float": "marble-float 8s ease-in-out infinite",
      },
      transitionTimingFunction: {
        spring: 'var(--spring)',
        'spring-bouncy': 'var(--spring-bouncy)',
      },
      transitionDuration: {
        instant: 'var(--duration-instant)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
