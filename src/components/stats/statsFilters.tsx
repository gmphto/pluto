import React from 'react';
import { FilterOptions } from '../../types/pinterest';
import * as S from './statsFilters.styles';

interface StatsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  onClearData: () => void;
}

export function StatsFilters({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  onClearFilters,
  onClearData,
}: StatsFiltersProps) {
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value ? parseInt(value) : undefined,
    });
  };

  return (
    <S.Container>
      <S.SearchContainer>
        <S.SearchInput
          type="text"
          placeholder="🔍 Search pins by title or URL..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </S.SearchContainer>

      <S.FilterContainer>
        <S.FilterTitle>Filters</S.FilterTitle>
        <S.FilterGrid>
          <S.FilterGroup>
            <S.FilterLabel>Min Saves:</S.FilterLabel>
            <S.FilterInput
              type="number"
              placeholder="0"
              value={filters.minSaves || ''}
              onChange={(e) => handleFilterChange('minSaves', e.target.value)}
            />
          </S.FilterGroup>

          <S.FilterGroup>
            <S.FilterLabel>Max Saves:</S.FilterLabel>
            <S.FilterInput
              type="number"
              placeholder="∞"
              value={filters.maxSaves || ''}
              onChange={(e) => handleFilterChange('maxSaves', e.target.value)}
            />
          </S.FilterGroup>

          <S.FilterGroup>
            <S.FilterLabel>Min Likes:</S.FilterLabel>
            <S.FilterInput
              type="number"
              placeholder="0"
              value={filters.minLikes || ''}
              onChange={(e) => handleFilterChange('minLikes', e.target.value)}
            />
          </S.FilterGroup>

          <S.FilterGroup>
            <S.FilterLabel>Max Likes:</S.FilterLabel>
            <S.FilterInput
              type="number"
              placeholder="∞"
              value={filters.maxLikes || ''}
              onChange={(e) => handleFilterChange('maxLikes', e.target.value)}
            />
          </S.FilterGroup>

          <S.FilterGroup>
            <S.FilterLabel>Min Comments:</S.FilterLabel>
            <S.FilterInput
              type="number"
              placeholder="0"
              value={filters.minComments || ''}
              onChange={(e) => handleFilterChange('minComments', e.target.value)}
            />
          </S.FilterGroup>

          <S.FilterGroup>
            <S.FilterLabel>Max Comments:</S.FilterLabel>
            <S.FilterInput
              type="number"
              placeholder="∞"
              value={filters.maxComments || ''}
              onChange={(e) => handleFilterChange('maxComments', e.target.value)}
            />
          </S.FilterGroup>
        </S.FilterGrid>

        <S.ButtonGroup>
          <S.ClearFiltersButton onClick={onClearFilters}>Clear Filters</S.ClearFiltersButton>
          <S.ClearDataButton onClick={onClearData}>🗑️ Clear All Data</S.ClearDataButton>
        </S.ButtonGroup>
      </S.FilterContainer>
    </S.Container>
  );
}
