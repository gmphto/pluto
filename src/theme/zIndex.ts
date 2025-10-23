export const zIndex = {
  base: 1,
  overlay: 10,
  modal: 100,
  dropdown: 1000,
  floatingButton: 10000,
} as const;

export type ZIndex = typeof zIndex;
