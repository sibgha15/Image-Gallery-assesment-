export type CharactersQueryData = {
  characters: {
    info: {
      next: number | null;
      pages: number;
    } | null;
    results: Array<{
      id: string;
      name: string;
      image: string;
      species: string;
      episode: { id: string }[];
    }> | null;
  } | null;
};

export type CharacterQueryData = {
  character: {
    id: string;
    name: string;
    image: string;
    species: string;
    status: string;
    gender: string;
    type: string;
    location: { name: string } | null;
    origin: { name: string } | null;
    episode: { id: string }[];
  } | null;
};
