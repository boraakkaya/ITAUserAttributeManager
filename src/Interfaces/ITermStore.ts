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
    CustomProps?:Array<{key?:string,value?:string}>,
    Id?:string,
    Name?:string,
    Terms?:ITerms[]
    Type?:string
}
export interface ITerms{
    CustomProps?:Array<{key?:string,value?:string}>,
    Id:string,
    Labels?: Array<string>,
    Name:string
    Terms?:ITerms[],
    Type?:string
}
export interface ISuggestedTerms extends ITerms{
    location:string;
}