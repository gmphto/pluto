import styled from '@emotion/styled';
import { theme } from '../../theme';

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
  font-family: ${theme.typography.fontFamily.base};
`;

export const Loading = styled.div`
  text-align: center;
  padding: ${theme.spacing.huge};
  font-size: ${theme.typography.fontSize.xxl};
  color: ${theme.colors.neutral.gray[400]};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.huge} ${theme.spacing.xl};
`;

export const EmptyText = styled.p`
  font-size: ${theme.typography.fontSize.xxl};
  color: ${theme.colors.neutral.gray[400]};
  margin: 0 0 ${theme.spacing.md} 0;
`;

export const EmptySubtext = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.neutral.gray[300]};
  margin: 0;
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  background: ${theme.colors.neutral.white};
  border-radius: 8px;
  box-shadow: 0 2px 8px ${theme.colors.shadow.default};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background-color: ${theme.colors.brand.primary};
  color: ${theme.colors.neutral.white};
`;

export const TableHeaderRow = styled.tr``;

export const TableHeader = styled.th<{ sortable?: boolean }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  text-align: left;
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.lg};
  white-space: nowrap;
  cursor: ${({ sortable }) => (sortable ? 'pointer' : 'default')};
  user-select: ${({ sortable }) => (sortable ? 'none' : 'auto')};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ sortable }) => (sortable ? theme.colors.brand.primaryHover : 'inherit')};
  }
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.neutral.gray[100]};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${theme.colors.neutral.gray[50]};
  }
`;

export const TableCell = styled.td`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.neutral.gray[600]};
`;

export const Thumbnail = styled.img`
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`;

export const TitleCell = styled.div`
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Link = styled.a`
  color: ${theme.colors.brand.primary};
  text-decoration: none;
  font-weight: ${theme.typography.fontWeight.medium};
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.brand.primaryHover};
    text-decoration: underline;
  }
`;
