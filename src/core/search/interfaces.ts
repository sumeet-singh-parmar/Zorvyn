export interface SearchOptions {
  limit?: number;
  fuzzy?: boolean;
  fields?: string[];
}

export interface SearchResult<T> {
  item: T;
  score: number;
  matches?: { field: string; indices: [number, number][] }[];
}

export interface ISearchEngine<T> {
  search(query: string, options?: SearchOptions): Promise<SearchResult<T>[]>;
  index(items: T[]): Promise<void>;
  update(item: T): Promise<void>;
  remove(id: string): Promise<void>;
}
