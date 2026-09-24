import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createServices,
  fetchServicesList,
  removeServices,
  toggleServicesPublish,
  toggleServicesVisibility,
  updateServices,
} from "../../services/servicesService.js";

export const loadServicesList = createAsyncThunk("services/loadList", async (params, thunkApi) => {
  try {
    return await fetchServicesList(params);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const addServices = createAsyncThunk("services/add", async (payload, thunkApi) => {
  try {
    return await createServices(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const editServices = createAsyncThunk("services/edit", async ({ id, payload }, thunkApi) => {
  try {
    return await updateServices(id, payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const deleteServices = createAsyncThunk("services/delete", async (id, thunkApi) => {
  try {
    await removeServices(id);
    return id;
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const flipServicesVisibility = createAsyncThunk("services/visibility", async (id, thunkApi) => {
  try {
    return await toggleServicesVisibility(id);
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

export const flipServicesPublish = createAsyncThunk("services/publish", async (id, thunkApi) => {
  try {
    return await toggleServicesPublish(id);
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

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadServicesList.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loadServicesList.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload?.rows || [];
        state.pagination = action.payload?.pagination || initialState.pagination;
      })
      .addCase(loadServicesList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load services sections";
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
      .addCase(addServices.pending, pendingMutation)
      .addCase(addServices.fulfilled, fulfilledMutation)
      .addCase(addServices.rejected, rejectedMutation)
      .addCase(editServices.pending, pendingMutation)
      .addCase(editServices.fulfilled, fulfilledMutation)
      .addCase(editServices.rejected, rejectedMutation)
      .addCase(deleteServices.pending, pendingMutation)
      .addCase(deleteServices.fulfilled, fulfilledMutation)
      .addCase(deleteServices.rejected, rejectedMutation)
      .addCase(flipServicesVisibility.pending, pendingMutation)
      .addCase(flipServicesVisibility.fulfilled, fulfilledMutation)
      .addCase(flipServicesVisibility.rejected, rejectedMutation)
      .addCase(flipServicesPublish.pending, pendingMutation)
      .addCase(flipServicesPublish.fulfilled, fulfilledMutation)
      .addCase(flipServicesPublish.rejected, rejectedMutation);
  },
});

export default servicesSlice.reducer;
