import { configureStore } from '@reduxjs/toolkit';
import conversationReducer, {chatReducer} from './conversationSlice';

export const store = configureStore({
    reducer: {
        conversation: conversationReducer,
        chat: chatReducer,
    },
});
