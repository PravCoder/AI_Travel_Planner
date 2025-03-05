export interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  imageUrl: string;
  isFavorite: boolean;
}
