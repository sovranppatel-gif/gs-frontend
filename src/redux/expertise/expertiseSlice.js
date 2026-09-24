import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createExpertise,
  fetchExpertiseList,
  removeExpertise,
  toggleExpertisePublish,
  toggleExpertiseVisibility,
  updateExpertise,
} from "../../services/expertiseService.js";

export const loadExpertiseList = createAsyncThunk("expertise/loadList", async (params, thunkApi) => {
  try {
    return await fetchExpertiseList(params);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const addExpertise = createAsyncThunk("expertise/add", async (payload, thunkApi) => {
  try {
    return await createExpertise(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const editExpertise = createAsyncThunk(
  "expertise/edit",
  async ({ id, payload }, thunkApi) => {
    try {
      return await updateExpertise(id, payload);
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const deleteExpertise = createAsyncThunk("expertise/delete", async (id, thunkApi) => {
  try {
    await removeExpertise(id);
    return id;
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const flipExpertiseVisibility = createAsyncThunk(
  "expertise/visibility",
  async (id, thunkApi) => {
    try {
      return await toggleExpertiseVisibility(id);
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const flipExpertisePublish = createAsyncThunk("expertise/publish", async (id, thunkApi) => {
  try {
    return await toggleExpertisePublish(id);
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

const expertiseSlice = createSlice({
  name: "expertise",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadExpertiseList.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loadExpertiseList.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload?.rows || [];
        state.pagination = action.payload?.pagination || initialState.pagination;
      })
      .addCase(loadExpertiseList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load expertise sections";
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
      .addCase(addExpertise.pending, pendingMutation)
      .addCase(addExpertise.fulfilled, fulfilledMutation)
      .addCase(addExpertise.rejected, rejectedMutation)
      .addCase(editExpertise.pending, pendingMutation)
      .addCase(editExpertise.fulfilled, fulfilledMutation)
      .addCase(editExpertise.rejected, rejectedMutation)
      .addCase(deleteExpertise.pending, pendingMutation)
      .addCase(deleteExpertise.fulfilled, fulfilledMutation)
      .addCase(deleteExpertise.rejected, rejectedMutation)
      .addCase(flipExpertiseVisibility.pending, pendingMutation)
      .addCase(flipExpertiseVisibility.fulfilled, fulfilledMutation)
      .addCase(flipExpertiseVisibility.rejected, rejectedMutation)
      .addCase(flipExpertisePublish.pending, pendingMutation)
      .addCase(flipExpertisePublish.fulfilled, fulfilledMutation)
      .addCase(flipExpertisePublish.rejected, rejectedMutation);
  },
});

export default expertiseSlice.reducer;
