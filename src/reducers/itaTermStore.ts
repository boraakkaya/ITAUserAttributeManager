export const itaTermStore = (state={},action) => {
    const GETTERMSTORE = "GETTERMSTORE"
    switch (action.type) {
        case GETTERMSTORE:
            return action.data;
        default:
            return state
    }
}