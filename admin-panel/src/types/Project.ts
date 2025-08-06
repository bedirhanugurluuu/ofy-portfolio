export interface Project {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  thumbnail_image: string;
  is_featured: boolean;
  featured_order: number | null;
  description: string;
  client_name?: string;
  year?: number;
  role?: string;
}
