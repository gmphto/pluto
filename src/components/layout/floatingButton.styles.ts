import styled from '@emotion/styled';
import { theme } from '../../theme';

export const Button = styled.button`
  position: fixed;
  bottom: ${theme.spacing.xl};
  right: ${theme.spacing.xl};
  background-color: ${theme.colors.brand.primary};
  color: ${theme.colors.neutral.white};
  border: none;
  border-radius: 24px;
  padding: ${theme.spacing.md} ${theme.spacing.xxl};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-family: ${theme.typography.fontFamily.base};
  cursor: pointer;
  box-shadow: 0 4px 12px ${theme.colors.shadow.primary};
  z-index: ${theme.zIndex.floatingButton};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px ${theme.colors.shadow.primaryHover};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const Icon = styled.span`
  font-size: ${theme.typography.fontSize.xxl};
`;

export const Text = styled.span``;

export const Badge = styled.span`
  background-color: ${theme.colors.overlay.light};
  border-radius: 12px;
  padding: 2px ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.bold};
`;
