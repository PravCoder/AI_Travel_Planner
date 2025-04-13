export interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  imageUrl: string;
  isFavorite: boolean;
}
