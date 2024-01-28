import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchLikes = createAsyncThunk(
  'drawings/fetchLikes',
  async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts`);
    return response.json();
  }
);

const initialState = {
    likes: {},
    userLiked: {}
};

const drawingsSlice = createSlice({
  name: 'drawings',
  initialState,
  reducers: {
    toggleLike: (state, action) => {
      const { id } = action.payload;
      if (!state.userLiked[id]) {
        state.userLiked[id] = true;
        state.likes[id] = (state.likes[id] || 0) + 1;
      } else {
        state.userLiked[id] = false;
        state.likes[id] = Math.max(0, state.likes[id] - 1);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikes.fulfilled, (state, action) => {
        action.payload.forEach(post => {
          if (!state.likes[post.id]) {
            state.likes[post.id] = 0;
          }
        });
      });
  }
});

export const { toggleLike } = drawingsSlice.actions;
export default drawingsSlice.reducer;
