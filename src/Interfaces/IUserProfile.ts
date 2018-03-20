export interface IUserProfile
{
    firstName:string;
    middleName?:string;
    lastName:string;
    suffix?:string;
    workPhone:string;
    jobTitle:string;
    department:string;
    cellPhone:string;
    emailAddress:string;
    officeRegion:string;
    officeCountry:string;
    officeState:string;
    officeLocation?:number;
    mailingAddress:IMailingAddress;
    officeNumber:string;
    manager:IUser;
    employeeID:string;
    employeeType:EmployeeTypes;
    accountExpiration: string;
    countrySpecialities:Array<string>;
    industrySpecialities:Array<string>;
    CSATCompletion:Date | any;
    emergencyContactInformation:Array<IContact>;
    education:Array<IEducation>;
    certifications:Array<ICertification>;
    directReports?:IUser[];

}
export interface IMailingAddress
{
    addressLine1:string;
    addressLine2:string;
    state:string;
    city:string;
    zipCode:string;
    country:string;
}
export interface IUser
{
    displayName:string;
    email:string;
}
export enum EmployeeTypes
{
    RegularEmployee="Regular Employee",
    Contractor="Contractor",
    Intern = "Intern"
}
export interface IContact
{
    firstName:string;
    lastName:string;
    phoneNumber:string;
    emailAddress:string;
}
export interface IEducation
{
    schoolName:string;
    degree:string;
    year:string;
}
export interface ICertification
{
    title:string;
    organization:string;
    year:string;
}