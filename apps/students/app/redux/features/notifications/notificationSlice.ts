import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notifications: [
        {
            id: 1,
            title: "Add a bank account to receive payouts",
            description: "Add a bank acc receive payouts Your Balance account couldn't be opened at this time. Add a bank account to start getting paid for sales made with Shopify Payments",
            date: "May 18, 2024 at 11:20:56 PM",
        },
        {
            id: 2,
            title: "Action: update inventory 2",
            description: "Course sync is successfully completed",
            date: "May 18, 2024 at 11:20:56 PM",
        },
        {
            id: 145,
            title: "Add a bank account to receive payouts",
            description: "Add a bank acc receive payouts Your Balance account couldn't be opened at this time. Add a bank account to start getting paid for sales made with Shopify Payments",
            date: "May 18, 2024 at 11:20:56 PM",
        },
        {
            id: 3,
            title: "Action: update inventory 3",
            description: "Course sync is successfully completed",
            date: "May 18, 2024 at 11:20:56 PM",
        },
        {
            id: 551,
            title: "Add a bank account to receive payouts",
            description: "Add a bank acc receive payouts Your Balance account couldn't be opened at this time. Add a bank account to start getting paid for sales made with Shopify Payments",
            date: "May 18, 2024 at 11:20:56 PM",
        },
        {
            id: 4,
            title: "Action: update inventory 4",
            description: "Course sync is successfully completed",
            date: "May 18, 2024 at 11:20:56 PM",
        },
        {
            id: 154,
            title: "Add a bank account to receive payouts",
            description: "Add a bank acc receive payouts Your Balance account couldn't be opened at this time. Add a bank account to start getting paid for sales made with Shopify Payments",
            date: "May 18, 2024 at 11:20:56 PM",
        },
        {
            id: 50,
            title: "Action: update inventory 5",
            description: "Course sync is successfully completed",
            date: "May 18, 2024 at 11:20:56 PM",
        },
        {
            id: 100,
            title: "Add a bank account to receive payouts",
            description: "Add a bank acc receive payouts Your Balance account couldn't be opened at this time. Add a bank account to start getting paid for sales made with Shopify Payments",
            date: "May 18, 2024 at 11:20:56 PM",
        },
    ],
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        removeNotification(state, action) {
            const id = action.payload;
            state.notifications = state.notifications.filter((notification) => notification.id !== id);
        },
        addNotification(state, action) {
            state.notifications.push(action.payload);
        },
        clearAllNotifications(state) {
            state.notifications = [];
        },
    },
});

export const { removeNotification, addNotification, clearAllNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;