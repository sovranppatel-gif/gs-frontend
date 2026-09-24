import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createCaseStudy,
  fetchCaseStudyList,
  removeCaseStudy,
  toggleCaseStudyPublish,
  toggleCaseStudyVisibility,
  updateCaseStudy,
} from "../../services/caseStudyService.js";

export const loadCaseStudyList = createAsyncThunk("caseStudy/loadList", async (params, thunkApi) => {
  try {
    return await fetchCaseStudyList(params);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const addCaseStudy = createAsyncThunk("caseStudy/add", async (payload, thunkApi) => {
  try {
    return await createCaseStudy(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const editCaseStudy = createAsyncThunk("caseStudy/edit", async ({ id, payload }, thunkApi) => {
  try {
    return await updateCaseStudy(id, payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const deleteCaseStudy = createAsyncThunk("caseStudy/delete", async (id, thunkApi) => {
  try {
    await removeCaseStudy(id);
    return id;
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const flipCaseStudyVisibility = createAsyncThunk("caseStudy/visibility", async (id, thunkApi) => {
  try {
    return await toggleCaseStudyVisibility(id);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const flipCaseStudyPublish = createAsyncThunk("caseStudy/publish", async (id, thunkApi) => {
  try {
    return await toggleCaseStudyPublish(id);
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

const caseStudySlice = createSlice({
  name: "caseStudy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCaseStudyList.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loadCaseStudyList.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload?.rows || [];
        state.pagination = action.payload?.pagination || initialState.pagination;
      })
      .addCase(loadCaseStudyList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load case study strips";
      });

    const pendingMutation = (state) => {
      state.mutationLoading = true;
      state.mutationError = "";
    };
    const fulfilledMutation = (state) => {
      state.mutationLoading = false;
      state.mutationError = "";
    };
    const rejectedMutation = (state, action) => {
      state.mutationLoading = false;
      state.mutationError = action.payload || "Operation failed";
    };

    builder
      .addCase(addCaseStudy.pending, pendingMutation)
      .addCase(addCaseStudy.fulfilled, fulfilledMutation)
      .addCase(addCaseStudy.rejected, rejectedMutation)
      .addCase(editCaseStudy.pending, pendingMutation)
      .addCase(editCaseStudy.fulfilled, fulfilledMutation)
      .addCase(editCaseStudy.rejected, rejectedMutation)
      .addCase(deleteCaseStudy.pending, pendingMutation)
      .addCase(deleteCaseStudy.fulfilled, fulfilledMutation)
      .addCase(deleteCaseStudy.rejected, rejectedMutation)
      .addCase(flipCaseStudyVisibility.pending, pendingMutation)
      .addCase(flipCaseStudyVisibility.fulfilled, fulfilledMutation)
      .addCase(flipCaseStudyVisibility.rejected, rejectedMutation)
      .addCase(flipCaseStudyPublish.pending, pendingMutation)
      .addCase(flipCaseStudyPublish.fulfilled, fulfilledMutation)
      .addCase(flipCaseStudyPublish.rejected, rejectedMutation);
  },
});

export default caseStudySlice.reducer;
