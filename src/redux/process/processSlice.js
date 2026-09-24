import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createProcess,
  fetchProcessList,
  removeProcess,
  toggleProcessPublish,
  toggleProcessVisibility,
  updateProcess,
} from "../../services/processService.js";

export const loadProcessList = createAsyncThunk("process/loadList", async (params, thunkApi) => {
  try {
    return await fetchProcessList(params);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const addProcess = createAsyncThunk("process/add", async (payload, thunkApi) => {
  try {
    return await createProcess(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const editProcess = createAsyncThunk("process/edit", async ({ id, payload }, thunkApi) => {
  try {
    return await updateProcess(id, payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const deleteProcess = createAsyncThunk("process/delete", async (id, thunkApi) => {
  try {
    await removeProcess(id);
    return id;
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const flipProcessVisibility = createAsyncThunk("process/visibility", async (id, thunkApi) => {
  try {
    return await toggleProcessVisibility(id);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const flipProcessPublish = createAsyncThunk("process/publish", async (id, thunkApi) => {
  try {
    return await toggleProcessPublish(id);
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
};

const processSlice = createSlice({
  name: "process",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProcessList.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loadProcessList.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload?.rows || [];
        state.pagination = action.payload?.pagination || initialState.pagination;
      })
      .addCase(loadProcessList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load process sections";
      });

    const pendingMutation = (state) => {
      state.mutationLoading = true;
    };
    const fulfilledMutation = (state) => {
      state.mutationLoading = false;
    };
    const rejectedMutation = (state) => {
      state.mutationLoading = false;
    };

    builder
      .addCase(addProcess.pending, pendingMutation)
      .addCase(addProcess.fulfilled, fulfilledMutation)
      .addCase(addProcess.rejected, rejectedMutation)
      .addCase(editProcess.pending, pendingMutation)
      .addCase(editProcess.fulfilled, fulfilledMutation)
      .addCase(editProcess.rejected, rejectedMutation)
      .addCase(deleteProcess.pending, pendingMutation)
      .addCase(deleteProcess.fulfilled, fulfilledMutation)
      .addCase(deleteProcess.rejected, rejectedMutation)
      .addCase(flipProcessVisibility.pending, pendingMutation)
      .addCase(flipProcessVisibility.fulfilled, fulfilledMutation)
      .addCase(flipProcessVisibility.rejected, rejectedMutation)
      .addCase(flipProcessPublish.pending, pendingMutation)
      .addCase(flipProcessPublish.fulfilled, fulfilledMutation)
      .addCase(flipProcessPublish.rejected, rejectedMutation);
  },
});

export default processSlice.reducer;
