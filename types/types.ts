export interface Post {
  id: string;
  title: string | undefined;
  description: string | undefined;
  updated_on: string | undefined;
  slug: string | undefined;
  tags: string[] | undefined;
}