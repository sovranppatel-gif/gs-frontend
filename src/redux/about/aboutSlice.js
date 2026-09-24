import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createAbout,
  fetchAboutList,
  removeAbout,
  toggleAboutPublish,
  toggleAboutVisibility,
  updateAbout,
} from "../../services/aboutService.js";

export const loadAboutList = createAsyncThunk("about/loadList", async (params, thunkApi) => {
  try {
    return await fetchAboutList(params);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const addAbout = createAsyncThunk("about/add", async (payload, thunkApi) => {
  try {
    return await createAbout(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const editAbout = createAsyncThunk("about/edit", async ({ id, payload }, thunkApi) => {
  try {
    return await updateAbout(id, payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const deleteAbout = createAsyncThunk("about/delete", async (id, thunkApi) => {
  try {
    await removeAbout(id);
    return id;
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const flipAboutVisibility = createAsyncThunk("about/visibility", async (id, thunkApi) => {
  try {
    return await toggleAboutVisibility(id);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const flipAboutPublish = createAsyncThunk("about/publish", async (id, thunkApi) => {
  try {
    return await toggleAboutPublish(id);
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

const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {
    clearAboutMutationError(state) {
      state.mutationError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAboutList.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loadAboutList.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload?.rows || [];
        state.pagination = action.payload?.pagination || initialState.pagination;
      })
      .addCase(loadAboutList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load about sections";
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
      .addCase(addAbout.pending, pendingMutation)
      .addCase(addAbout.fulfilled, fulfilledMutation)
      .addCase(addAbout.rejected, rejectedMutation)
      .addCase(editAbout.pending, pendingMutation)
      .addCase(editAbout.fulfilled, fulfilledMutation)
      .addCase(editAbout.rejected, rejectedMutation)
      .addCase(deleteAbout.pending, pendingMutation)
      .addCase(deleteAbout.fulfilled, fulfilledMutation)
      .addCase(deleteAbout.rejected, rejectedMutation)
      .addCase(flipAboutVisibility.pending, pendingMutation)
      .addCase(flipAboutVisibility.fulfilled, fulfilledMutation)
      .addCase(flipAboutVisibility.rejected, rejectedMutation)
      .addCase(flipAboutPublish.pending, pendingMutation)
      .addCase(flipAboutPublish.fulfilled, fulfilledMutation)
      .addCase(flipAboutPublish.rejected, rejectedMutation);
  },
});

export const { clearAboutMutationError } = aboutSlice.actions;
export default aboutSlice.reducer;
