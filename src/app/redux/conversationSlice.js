import { createSlice } from '@reduxjs/toolkit';

// Conversation slice
const initialConversationState = {
    selectedConversation: null,
};

const conversationSlice = createSlice({
    name: 'conversation',
    initialState: initialConversationState,
    reducers: {
        setSelectedConversation: (state, action) => {
            state.selectedConversation = action.payload || null;
        },
        clearSelectedConversation: (state) => {
            state.selectedConversation = null;
        },
    },
});

// Chat slice
const initialChatState = {
    messagesByGroup: {},
    newMessage: '',
};

const chatSlice = createSlice({
    name: 'chat',
    initialState: initialChatState,
    reducers: {
        setMessagesByGroup: (state, action) => {
            state.messagesByGroup = {
                ...state.messagesByGroup,
                ...action.payload,
            };
        },
        addMessageToGroup: (state, action) => {
            const { groupId, message } = action.payload;
            if (!state.messagesByGroup[groupId]) {
                state.messagesByGroup[groupId] = [];
            }
            state.messagesByGroup[groupId].push(message);
        },
        setNewMessage: (state, action) => {
            state.newMessage = action.payload;
        },
        clearChatState: () => initialChatState, // ✅ Reset chat slice
    },
});


export const { setMessagesByGroup, setNewMessage, addMessageToGroup, clearChatState } = chatSlice.actions;

export const { setSelectedConversation, clearSelectedConversation } = conversationSlice.actions;
export default conversationSlice.reducer;

export const chatReducer = chatSlice.reducer;
