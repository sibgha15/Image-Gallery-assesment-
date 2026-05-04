import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { GalleryImage } from '../types/gallery';

type GalleryState = {
  images: GalleryImage[];
  likedByUser: Record<string, boolean>;
  loading: boolean;
  error: string | null;
};

const initialState: GalleryState = {
  images: [],
  likedByUser: {},
  loading: false,
  error: null,
};

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setImages: (state, action: PayloadAction<GalleryImage[]>) => {
      state.images = action.payload;
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.likedByUser[id] = !state.likedByUser[id];
    },
    resetGallery: () => initialState,
  },
});

export const { setLoading, setError, setImages, toggleLike, resetGallery } =
  gallerySlice.actions;
export default gallerySlice.reducer;
