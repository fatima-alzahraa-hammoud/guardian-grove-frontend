import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import familyReducer from './slices/familySlice';
import chatReducer from './slices/chatSlice';
import messageReducer from './slices/messageSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    family: familyReducer,
    chat: chatReducer,
    messages: messageReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
