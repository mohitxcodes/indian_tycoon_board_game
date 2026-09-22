export const theme = {
  colors: {
    background: "#FDFBF7", // warm cream
    surface: "#FFFFFF", // white
    primary: "#0B1D3A", // deep navy
    secondary: "#1A49B8", // royal blue
    accent: "#FF9933", // saffron
    success: "#10B981", // emerald
    warning: "#F59E0B", // amber
    danger: "#EF4444", // red
    gold: "#D4AF37", // muted premium gold
    text: "#2D2D2D", // dark charcoal
    textLight: "#6B7280", // subtle text
    border: "#E5E7EB", // subtle borders
    overlay: "rgba(0, 0, 0, 0.4)", // modal overlay
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
      xxxl: 48,
    },
    weights: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: "#0B1D3A",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
  },
} as const;

export type Theme = typeof theme;
