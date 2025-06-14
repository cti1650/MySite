export interface Post {
  id: string;
  title: string;
  url: string;
  likes_count: number;
  liked_count?: number;
  created_at: string;
  updated_at: string;
  body_updated_at?: string;
  published_at?: string;
  slug?: string;
}
