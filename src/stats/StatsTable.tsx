import React, { useState, useEffect, useMemo } from 'react';
import { PinStats, SortField, SortOrder, FilterOptions } from '../types/pinterest';
import { StorageManager } from '../utils/storage';

export const StatsTable: React.FC = () => {
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

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'N/A';
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading pin data...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>📊 Pinterest Pin Stats Table</h1>
        <p style={styles.subtitle}>
          Analyzing {filteredAndSortedPins.length} of {pins.length} pins
        </p>
      </header>

      <div style={styles.controls}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Search pins by title or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterContainer}>
          <h3 style={styles.filterTitle}>Filters</h3>
          <div style={styles.filterGrid}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Min Saves:</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minSaves || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minSaves: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                style={styles.filterInput}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Max Saves:</label>
              <input
                type="number"
                placeholder="∞"
                value={filters.maxSaves || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxSaves: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                style={styles.filterInput}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Min Likes:</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minLikes || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minLikes: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                style={styles.filterInput}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Max Likes:</label>
              <input
                type="number"
                placeholder="∞"
                value={filters.maxLikes || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxLikes: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                style={styles.filterInput}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Min Comments:</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minComments || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minComments: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                style={styles.filterInput}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Max Comments:</label>
              <input
                type="number"
                placeholder="∞"
                value={filters.maxComments || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxComments: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                style={styles.filterInput}
              />
            </div>
          </div>

          <button onClick={() => setFilters({})} style={styles.clearFiltersBtn}>
            Clear Filters
          </button>
        </div>

        <button onClick={handleClearData} style={styles.clearDataBtn}>
          🗑️ Clear All Data
        </button>
      </div>

      {filteredAndSortedPins.length === 0 ? (
        <div style={styles.emptyState}>
          {pins.length === 0 ? (
            <>
              <p style={styles.emptyText}>No pins saved yet.</p>
              <p style={styles.emptySubtext}>
                Visit Pinterest and browse some pins. The extension will automatically collect
                stats!
              </p>
            </>
          ) : (
            <p style={styles.emptyText}>No pins match your filters.</p>
          )}
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Preview</th>
                <th style={styles.th}>Title</th>
                <th
                  style={{ ...styles.th, ...styles.sortable }}
                  onClick={() => handleSort('saves')}
                >
                  📌 Saves {getSortIcon('saves')}
                </th>
                <th
                  style={{ ...styles.th, ...styles.sortable }}
                  onClick={() => handleSort('likes')}
                >
                  ❤️ Likes {getSortIcon('likes')}
                </th>
                <th
                  style={{ ...styles.th, ...styles.sortable }}
                  onClick={() => handleSort('comments')}
                >
                  💬 Comments {getSortIcon('comments')}
                </th>
                <th
                  style={{ ...styles.th, ...styles.sortable }}
                  onClick={() => handleSort('createdAt')}
                >
                  📅 Created {getSortIcon('createdAt')}
                </th>
                <th style={styles.th}>Link</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedPins.map((pin) => (
                <tr key={pin.id} style={styles.row}>
                  <td style={styles.td}>
                    {pin.imageUrl && (
                      <img src={pin.imageUrl} alt={pin.title} style={styles.thumbnail} />
                    )}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.titleCell}>{pin.title}</div>
                  </td>
                  <td style={styles.td}>{formatNumber(pin.saves)}</td>
                  <td style={styles.td}>{formatNumber(pin.likes)}</td>
                  <td style={styles.td}>{formatNumber(pin.comments)}</td>
                  <td style={styles.td}>{formatDate(pin.createdAt)}</td>
                  <td style={styles.td}>
                    <a href={pin.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                      View Pin
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#E60023',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '18px',
    color: '#666',
  },
  controls: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  searchContainer: {
    width: '100%',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  filterContainer: {
    background: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  filterTitle: {
    margin: '0 0 15px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '15px',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  filterLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#555',
  },
  filterInput: {
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
  },
  clearFiltersBtn: {
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  clearDataBtn: {
    padding: '10px 20px',
    fontSize: '14px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    alignSelf: 'flex-end',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyText: {
    fontSize: '18px',
    color: '#666',
    margin: '0 0 10px 0',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#999',
    margin: 0,
  },
  tableContainer: {
    overflowX: 'auto',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headerRow: {
    backgroundColor: '#E60023',
    color: 'white',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  },
  sortable: {
    cursor: 'pointer',
    userSelect: 'none',
  },
  row: {
    borderBottom: '1px solid #eee',
  },
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#333',
  },
  thumbnail: {
    width: '60px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  titleCell: {
    maxWidth: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  link: {
    color: '#E60023',
    textDecoration: 'none',
    fontWeight: '500',
  },
};
