import styled from '@emotion/styled';
import { theme } from '../../theme';

export const Container = styled.div`
  margin-bottom: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

export const SearchContainer = styled.div`
  width: 100%;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.lg};
  border: 2px solid ${theme.colors.neutral.gray[100]};
  border-radius: 8px;
  outline: none;
  box-sizing: border-box;
  font-family: ${theme.typography.fontFamily.base};

  &:focus {
    border-color: ${theme.colors.brand.primary};
  }
`;

export const FilterContainer = styled.div`
  background: ${theme.colors.neutral.gray[50]};
  padding: ${theme.spacing.xl};
  border-radius: 8px;
  border: 1px solid ${theme.colors.neutral.gray[100]};
`;

export const FilterTitle = styled.h3`
  margin: 0 0 ${theme.spacing.lg} 0;
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.neutral.gray[600]};
`;

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const FilterLabel = styled.label`
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.neutral.gray[500]};
`;

export const FilterInput = styled.input`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.lg};
  border: 1px solid ${theme.colors.neutral.gray[100]};
  border-radius: 4px;
  outline: none;
  font-family: ${theme.typography.fontFamily.base};

  &:focus {
    border-color: ${theme.colors.brand.primary};
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ClearFiltersButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  font-size: ${theme.typography.fontSize.lg};
  background-color: ${theme.colors.neutral.gray[400]};
  color: ${theme.colors.neutral.white};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: ${theme.typography.fontFamily.base};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${theme.colors.neutral.gray[500]};
  }
`;

export const ClearDataButton = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  font-size: ${theme.typography.fontSize.lg};
  background-color: ${theme.colors.status.error};
  color: ${theme.colors.neutral.white};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: ${theme.typography.fontFamily.base};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #c82333;
  }
`;
