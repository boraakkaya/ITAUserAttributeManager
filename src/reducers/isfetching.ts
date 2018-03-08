export function isfetching(state=false,action)
{
    const FETCH = "FETCH";
    switch(action.type)
    {
        case FETCH:return action.data
        default : return state

    } 
}