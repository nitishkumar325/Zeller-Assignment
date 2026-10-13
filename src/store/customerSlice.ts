import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {
  createCustomer,
  deleteCustomer,
  loadCustomersFromApi,
  updateCustomer,
} from '../db/customerRepository';
import type { Customer, CustomerInput } from '../types';
import { getOpenRealm } from './realmHolder';

export type CustomerState = {
  customers: Customer[];
  refreshing: boolean;
  refreshError: string | null;
};

const initialState: CustomerState = {
  customers: [],
  refreshing: false,
  refreshError: null,
};

/**
 * Loads the customer list from the GraphQL API and stores it in Realm.
 * Called when the app opens, and again when the list is pulled to refresh.
 */
export const refreshCustomers = createAsyncThunk(
  'customers/refresh',
  async () => {
    await loadCustomersFromApi(getOpenRealm());
  },
);

/** Saves a person typed into the form. They only exist in Realm. */
export function addLocalCustomer(input: CustomerInput) {
  return () => {
    createCustomer(getOpenRealm(), input);
  };
}

/** Updates a row and marks it so the next refresh will not revert it. */
export function editLocalCustomer(id: string, input: CustomerInput) {
  return () => {
    updateCustomer(getOpenRealm(), id, input);
  };
}

/** Removes a user from the phone. A server row stays deleted across refreshes. */
export function removeLocalCustomer(id: string) {
  return () => {
    deleteCustomer(getOpenRealm(), id);
  };
}

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    // Used when Realm reports a change, and for the first read after boot.
    customersLoaded(state, action: PayloadAction<Customer[]>) {
      state.customers = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(refreshCustomers.pending, state => {
        state.refreshing = true;
        state.refreshError = null;
      })
      .addCase(refreshCustomers.fulfilled, state => {
        state.refreshing = false;
      })
      .addCase(refreshCustomers.rejected, (state, action) => {
        state.refreshing = false;
        state.refreshError = action.error.message ?? 'Could not refresh users';
      });
  },
});

export const { customersLoaded } = customerSlice.actions;
export default customerSlice.reducer;
