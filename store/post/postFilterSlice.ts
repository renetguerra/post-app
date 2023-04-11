import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetState } from '../actions';

interface PostFilterState {    
    textFilter: string;
  }

  const initialState: PostFilterState = {
    textFilter: ''
  };

export const postFilterSlice = createSlice({
   name: 'postFilter',
   initialState,
   reducers: {
       setTextFilter: (state, action: PayloadAction<{ textFilter: string }>) => {                
        state.textFilter = action.payload?.textFilter
       },
       resetTextFilter: (state) => {                        
        state.textFilter = ''
       },
    },
    // extraReducers(builder) {     
    //     builder.addCase(resetState, () => initialState)
    // }
});


// Action creators are generated for each case reducer function
export const { setTextFilter, resetTextFilter } = postFilterSlice.actions;