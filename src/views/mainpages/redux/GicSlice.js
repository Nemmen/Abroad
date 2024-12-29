import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get } from '../services/ApiEndpoint';


export const Gic = createAsyncThunk('GetGIC', async () => {
	try {
	  const request = await get('/auth/viewAllGicForm');
	  const response = request.data.gicForms;
	  return response;
	} catch (error) {
	  throw error;
	}
  });

const initialState = {
	loading: null,
	error: null,
	gic: [],
};

const GicSlice = createSlice({
	name: 'Gic',
	initialState: initialState,
	reducers: {
		SetGic: (state, action) => {
			state.gic = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(Gic.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(Gic.fulfilled, (state, action) => {
			state.loading = null;
			state.gic = action.payload;
		});
		builder.addCase(Gic.rejected, (state, action) => {
			state.loading = null;
			state.error = action.error.message;
			state.gic = [];
		});
	},
});

export const { SetGic } = GicSlice.actions;

export default GicSlice.reducer;
  