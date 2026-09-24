import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createFaq,
  fetchFaqList,
  removeFaq,
  toggleFaqPublish,
  toggleFaqVisibility,
  updateFaq,
} from "../../services/faqService.js";

export const loadFaqList = createAsyncThunk("faq/loadList", async (params, thunkApi) => {
  try {
    return await fetchFaqList(params);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const addFaq = createAsyncThunk("faq/add", async (payload, thunkApi) => {
  try {
    return await createFaq(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const editFaq = createAsyncThunk("faq/edit", async ({ id, payload }, thunkApi) => {
  try {
    return await updateFaq(id, payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const deleteFaq = createAsyncThunk("faq/delete", async (id, thunkApi) => {
  try {
    await removeFaq(id);
    return id;
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const flipFaqVisibility = createAsyncThunk("faq/visibility", async (id, thunkApi) => {
  try {
    return await toggleFaqVisibility(id);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const flipFaqPublish = createAsyncThunk("faq/publish", async (id, thunkApi) => {
  try {
    return await toggleFaqPublish(id);
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

const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFaqList.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loadFaqList.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload?.rows || [];
        state.pagination = action.payload?.pagination || initialState.pagination;
      })
      .addCase(loadFaqList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load FAQ sections";
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
      .addCase(addFaq.pending, pendingMutation)
      .addCase(addFaq.fulfilled, fulfilledMutation)
      .addCase(addFaq.rejected, rejectedMutation)
      .addCase(editFaq.pending, pendingMutation)
      .addCase(editFaq.fulfilled, fulfilledMutation)
      .addCase(editFaq.rejected, rejectedMutation)
      .addCase(deleteFaq.pending, pendingMutation)
      .addCase(deleteFaq.fulfilled, fulfilledMutation)
      .addCase(deleteFaq.rejected, rejectedMutation)
      .addCase(flipFaqVisibility.pending, pendingMutation)
      .addCase(flipFaqVisibility.fulfilled, fulfilledMutation)
      .addCase(flipFaqVisibility.rejected, rejectedMutation)
      .addCase(flipFaqPublish.pending, pendingMutation)
      .addCase(flipFaqPublish.fulfilled, fulfilledMutation)
      .addCase(flipFaqPublish.rejected, rejectedMutation);
  },
});

export default faqSlice.reducer;
