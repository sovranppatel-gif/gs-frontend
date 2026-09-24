import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createHeroLeft,
  fetchHeroLeftList,
  removeHeroLeft,
  toggleHeroLeftPublish,
  toggleHeroLeftVisibility,
  updateHeroLeft,
} from "../../services/heroLeftService.js";

export const loadHeroLeftList = createAsyncThunk("heroLeft/loadList", async (params, thunkApi) => {
  try {
    return await fetchHeroLeftList(params);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const addHeroLeft = createAsyncThunk("heroLeft/add", async (payload, thunkApi) => {
  try {
    return await createHeroLeft(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const editHeroLeft = createAsyncThunk(
  "heroLeft/edit",
  async ({ id, payload }, thunkApi) => {
    try {
      return await updateHeroLeft(id, payload);
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const deleteHeroLeft = createAsyncThunk("heroLeft/delete", async (id, thunkApi) => {
  try {
    await removeHeroLeft(id);
    return id;
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const flipHeroLeftVisibility = createAsyncThunk(
  "heroLeft/visibility",
  async (id, thunkApi) => {
    try {
      return await toggleHeroLeftVisibility(id);
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const flipHeroLeftPublish = createAsyncThunk("heroLeft/publish", async (id, thunkApi) => {
  try {
    return await toggleHeroLeftPublish(id);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

const initialState = {
  rows: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  loading: false,
  error: "",
  mutationLoading: false,
  mutationError: "",
};

const heroLeftSlice = createSlice({
  name: "heroLeft",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadHeroLeftList.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loadHeroLeftList.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload?.rows || [];
        state.pagination = action.payload?.pagination || initialState.pagination;
      })
      .addCase(loadHeroLeftList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load hero left sections";
      });

    const pendingMutation = (state) => {
      state.mutationLoading = true;
      state.mutationError = "";
    };
    const rejectedMutation = (state, action) => {
      state.mutationLoading = false;
      state.mutationError = action.payload || "Operation failed";
    };
    const fulfilledMutation = (state) => {
      state.mutationLoading = false;
      state.mutationError = "";
    };

    builder
      .addCase(addHeroLeft.pending, pendingMutation)
      .addCase(addHeroLeft.fulfilled, fulfilledMutation)
      .addCase(addHeroLeft.rejected, rejectedMutation)
      .addCase(editHeroLeft.pending, pendingMutation)
      .addCase(editHeroLeft.fulfilled, fulfilledMutation)
      .addCase(editHeroLeft.rejected, rejectedMutation)
      .addCase(deleteHeroLeft.pending, pendingMutation)
      .addCase(deleteHeroLeft.fulfilled, fulfilledMutation)
      .addCase(deleteHeroLeft.rejected, rejectedMutation)
      .addCase(flipHeroLeftVisibility.pending, pendingMutation)
      .addCase(flipHeroLeftVisibility.fulfilled, fulfilledMutation)
      .addCase(flipHeroLeftVisibility.rejected, rejectedMutation)
      .addCase(flipHeroLeftPublish.pending, pendingMutation)
      .addCase(flipHeroLeftPublish.fulfilled, fulfilledMutation)
      .addCase(flipHeroLeftPublish.rejected, rejectedMutation);
  },
});

export default heroLeftSlice.reducer;
