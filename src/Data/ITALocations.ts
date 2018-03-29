export interface IITALocation
{
    Department:{Label:string,TermGuid:string},
    Country:string,
    State:string,
    AddressLine1:string;
    AddressLine2:string;
    City:string;
    ZIPCode:string;
}

export const ITALocations:Array<IITALocation> = [
    {Department:{Label:"46",TermGuid:"36037310-544c-4a50-94b3-2152dff2936d"},Country:"United States", State:"San Fransisco",City:"Oakland", AddressLine1:"123 Test Road Lane", AddressLine2:"Unit 324", ZIPCode:"123456"},
    {Department:{Label:"47",TermGuid:"b8b2e04c-9bc7-4d8e-b240-26894f24c67b"},Country:"Germany", State:"",City:"Berlin", AddressLine1:"Somewhere in Berlin 789456", AddressLine2:"Unit 3478", ZIPCode:"987-789"}
]