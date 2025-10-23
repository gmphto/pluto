import styled from '@emotion/styled';
import { theme } from '../../theme';

export const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    ${theme.colors.overlay.dark} 0%,
    ${theme.colors.overlay.medium} 70%,
    transparent 100%
  );
  color: ${theme.colors.neutral.white};
  padding: ${theme.spacing.md} ${theme.spacing.sm} ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.base};
  font-family: ${theme.typography.fontFamily.base};
  z-index: ${theme.zIndex.overlay};
  pointer-events: none;
`;

export const StatsRow = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: ${theme.spacing.xs};
`;

export const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

export const Icon = styled.span`
  font-size: ${theme.typography.fontSize.lg};
`;

export const Value = styled.span`
  font-weight: ${theme.typography.fontWeight.semibold};
`;

export const Label = styled.span`
  opacity: 0.8;
  font-size: ${theme.typography.fontSize.sm};
`;

export const DateInfo = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  opacity: 0.7;
  text-align: center;
  margin-top: ${theme.spacing.xs};
`;
