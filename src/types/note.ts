export type Note = {
  id: string;
  title: string;
  content: string;
  linkedWarId?: string;
  region?: string;
  era?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
};
