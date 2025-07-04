import { configureStore } from '@reduxjs/toolkit'
import cartCounter from '../slices/counter/cartCounter'

export const store = configureStore({
  reducer: {
    counter: cartCounter,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch