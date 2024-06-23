export interface Post {
  id: string;
  title: string;
  description: string | undefined;
  updated_on: string | undefined;
  slug: string;
  tags: string[] | undefined;
  isPaginationPage: boolean;
}
