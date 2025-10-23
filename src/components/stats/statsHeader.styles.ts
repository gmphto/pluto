import styled from '@emotion/styled';
import { theme } from '../../theme';

export const Header = styled.header`
  text-align: center;
  margin-bottom: ${theme.spacing.xxxl};
`;

export const Title = styled.h1`
  font-size: ${theme.typography.fontSize.xxxl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.brand.primary};
  margin: 0 0 ${theme.spacing.md} 0;
`;

export const Subtitle = styled.p`
  font-size: ${theme.typography.fontSize.xl};
  color: ${theme.colors.neutral.gray[400]};
  margin: 0;
`;
