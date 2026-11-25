export type GalleryId = 'russia' | 'europe' | 'asia' | 'americas';

export type ExhibitionNote = {
  slug: string;
  gallery: GalleryId;
  title: string;
  subtitle: string;
  venue: string;
  date: string;
};

// The exhibition lists and all note counts use this same collection.
export const exhibitionNotes: ExhibitionNote[] = [
  {
    slug: 'nicolai-fechin',
    gallery: 'russia',
    title: 'Nicolai Fechin',
    subtitle: 'Colour, brushwork, and the joy of life',
    venue: 'National Art Museum of China',
    date: '2026-11-25',
  },
];

export function noteCountLabel(count: number) {
  return `${count} exhibition ${count === 1 ? 'note' : 'notes'}`;
}
