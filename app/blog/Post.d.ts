export type Post = {
  id: number;
  postId: string;
  userId: string;
  title: string;
  body: string;
  category: string;
  pin: number;
  noindex: boolean;
  draft: boolean;
  date: Date;
  updatedAt: Date | null;
  flags: number | null;
  memo: string | null;
}