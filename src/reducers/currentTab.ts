
export enum ITabs
{
    none ="none",
    userTab="userTAB",
    managerTab = "managerTAB"
}
const currentTabInitialState = ITabs.none;
export const currentTab = (state = currentTabInitialState, action) => {
    switch (action.type as ITabs) {
        case ITabs.managerTab:
            return ITabs.managerTab;
        case ITabs.userTab:
            return ITabs.userTab;
        default:
            return state
    }
}