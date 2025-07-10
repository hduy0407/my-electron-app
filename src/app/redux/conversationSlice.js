import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedConversation: null,
};

const conversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        setSelectedConversation: (state, action) => {
            state.selectedConversation = action.payload;
        },
    },
});

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messagesByGroup: {},
        newMessage: '',
    },
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
    },
});

export const { setMessagesByGroup, setNewMessage, addMessageToGroup } = chatSlice.actions;

export const { setSelectedConversation } = conversationSlice.actions;
export default conversationSlice.reducer;
