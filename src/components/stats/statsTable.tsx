import React, { useState, useEffect, useMemo } from 'react';
import { PinStats, SortField, SortOrder, FilterOptions } from '../../types/pinterest';
import { StorageManager } from '../../utils/storage';
import { StatsHeader } from './statsHeader';
import { StatsFilters } from './statsFilters';
import { StatsTableRow } from './statsTableRow';
import * as S from './statsTable.styles';

export function StatsTable() {
  const [pins, setPins] = useState<PinStats[]>([]);
  const [sortField, setSortField] = useState<SortField>('saves');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPins();
  }, []);

  const loadPins = async () => {
    setLoading(true);
    const loadedPins = await StorageManager.getPins();
    setPins(loadedPins);
    setLoading(false);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleClearData = async () => {
    if (confirm('Are you sure you want to clear all saved pin data?')) {
      await StorageManager.clearPins();
      setPins([]);
    }
  };

  const filteredAndSortedPins = useMemo(() => {
    let result = [...pins];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (pin) => pin.title.toLowerCase().includes(query) || pin.url.toLowerCase().includes(query)
      );
    }

    // Apply numeric filters
    if (filters.minSaves !== undefined) {
      result = result.filter((pin) => pin.saves >= filters.minSaves!);
    }
    if (filters.maxSaves !== undefined) {
      result = result.filter((pin) => pin.saves <= filters.maxSaves!);
    }
    if (filters.minLikes !== undefined) {
      result = result.filter((pin) => pin.likes >= filters.minLikes!);
    }
    if (filters.maxLikes !== undefined) {
      result = result.filter((pin) => pin.likes <= filters.maxLikes!);
    }
    if (filters.minComments !== undefined) {
      result = result.filter((pin) => pin.comments >= filters.minComments!);
    }
    if (filters.maxComments !== undefined) {
      result = result.filter((pin) => pin.comments <= filters.maxComments!);
    }

    // Sort
    result.sort((a, b) => {
      let aValue: any, bValue: any;

      if (sortField === 'createdAt') {
        aValue = new Date(a[sortField]).getTime();
        bValue = new Date(b[sortField]).getTime();
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }

      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return result;
  }, [pins, sortField, sortOrder, filters, searchQuery]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <S.Container>
        <S.Loading>Loading pin data...</S.Loading>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <StatsHeader totalPins={pins.length} filteredPins={filteredAndSortedPins.length} />

      <StatsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={() => setFilters({})}
        onClearData={handleClearData}
      />

      {filteredAndSortedPins.length === 0 ? (
        <S.EmptyState>
          {pins.length === 0 ? (
            <>
              <S.EmptyText>No pins saved yet.</S.EmptyText>
              <S.EmptySubtext>
                Visit Pinterest and browse some pins. The extension will automatically collect
                stats!
              </S.EmptySubtext>
            </>
          ) : (
            <S.EmptyText>No pins match your filters.</S.EmptyText>
          )}
        </S.EmptyState>
      ) : (
        <S.TableContainer>
          <S.Table>
            <S.TableHead>
              <S.TableHeaderRow>
                <S.TableHeader>Preview</S.TableHeader>
                <S.TableHeader>Title</S.TableHeader>
                <S.TableHeader sortable onClick={() => handleSort('saves')}>
                  📌 Saves {getSortIcon('saves')}
                </S.TableHeader>
                <S.TableHeader sortable onClick={() => handleSort('likes')}>
                  ❤️ Likes {getSortIcon('likes')}
                </S.TableHeader>
                <S.TableHeader sortable onClick={() => handleSort('comments')}>
                  💬 Comments {getSortIcon('comments')}
                </S.TableHeader>
                <S.TableHeader sortable onClick={() => handleSort('createdAt')}>
                  📅 Created {getSortIcon('createdAt')}
                </S.TableHeader>
                <S.TableHeader>Link</S.TableHeader>
              </S.TableHeaderRow>
            </S.TableHead>
            <S.TableBody>
              {filteredAndSortedPins.map((pin) => (
                <StatsTableRow key={pin.id} pin={pin} />
              ))}
            </S.TableBody>
          </S.Table>
        </S.TableContainer>
      )}
    </S.Container>
  );
}
