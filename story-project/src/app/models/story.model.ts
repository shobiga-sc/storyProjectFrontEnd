export interface Story {
  id?: string; 
  title?: string;
  posterUrl?: string | null;
  summary?: string;
  authorId?: string;
  authorName?: string;
  genre?: string;
  tags?: string[] | null;
  paid?: boolean;
  content: string;
  likeCount?: number;
  viewCount?: number;
  subscriptions?: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  publishedDate?: string | null;
  status?: string;
}
