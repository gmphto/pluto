export interface PinStats {
  id: string;
  url: string;
  imageUrl: string;
  title: string;
  saves: number;
  likes: number;
  comments: number;
  createdAt: string;
  timestamp: number;
}

export interface FilterOptions {
  minSaves?: number;
  maxSaves?: number;
  minLikes?: number;
  maxLikes?: number;
  minComments?: number;
  maxComments?: number;
}

export type SortField = 'saves' | 'likes' | 'comments' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface StorageData {
  pins: PinStats[];
  lastUpdated: number;
}
