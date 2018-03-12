export const selectedUser = (state={},action) => {
    const GETSELECTEDUSER = "GETSELECTEDUSER"
    switch (action.type) {
        case GETSELECTEDUSER:
            return action.data;
        default:
            return state
    }
}