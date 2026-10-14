export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  primary: string;
  /** Cor de apoio: textos secundários, legendas e ícones neutros. */
  secondary: string;
  success: string;
  error: string;
  warning: string;
  border: string;
  /** Fundo de elementos neutros (chips, opções não selecionadas). */
  muted: string;
  /** Texto sobre fundos `primary`, `error` e `success`. */
  onPrimary: string;
}
