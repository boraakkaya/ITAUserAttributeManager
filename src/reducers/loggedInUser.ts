export const loggedInUser = (state={},action) => {
    const GETLOGGEDINUSER = "GETLOGGEDINUSER"
    switch (action.type) {
        case GETLOGGEDINUSER:
            return action.data;
        default:
            return state
    }
}