export interface IITATermStore
{
    ITATermGroupList?:ITATermGroup[],
}
export interface ITATermGroup{
    Name:string,
    Id:string,
    TermSets:ITermSets[]
}

export interface ITermSets{
    Id?:string,
    Name?:string,
    Terms?:ITerms[]
}
export interface ITerms{
    Id?:string,
    Name?:string
}