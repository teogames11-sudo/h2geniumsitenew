export type SnapshotPage = {
  url: string;
  title: string;
  headings: string[];
  paragraphs: string[];
  lists: string[];
  images: string[];
  documents: { title: string; url: string }[];
  links: string[];
};

export type SnapshotData = {
  generatedAt: string;
  pages: SnapshotPage[];
};

export type ProductContent = {
  url: string;
  slug: string;
  title: string;
  description?: string;
  images: string[];
  documents: { title: string; url: string }[];
  category?: string;
};

export type ArticleContent = {
  url: string;
  title: string;
  excerpt?: string;
};

export type DocumentLink = {
  url: string;
  title: string;
  description?: string;
  type?: string;
  tags?: string[];
};
