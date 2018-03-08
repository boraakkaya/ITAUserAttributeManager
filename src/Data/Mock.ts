import { IUserProfile, EmployeeTypes } from "../Interfaces/IUserProfile";

export const mockUsers: IUserProfile[] = [
    {
        firstName: "John",
        middleName: "Jack",
        lastName: "Doe",
        suffix: "Mr",
        workPhone: "212-555-6678",
        cellPhone: "571-888-9900",
        emailAddress: "johndoe@boraakkaya.onmicrosoft.com",
        officeRegion: "North America - East",
        officeCountry: "U.S.A",
        officeState: "Washington D.C",
        mailingAddress: { addressLine1: "Parkway Lane ", addressLine2: "Unit 1254", state: "VA",city:"Arlington", zipCode: "22200", country: "U.S.A" },
        officeNumber: "19119",
        manager: { displayName: "Michael Brockman", email: "michael.brockman@trade.gov" },
        employeeID: "012345",
        employeeType: EmployeeTypes.Contractor,
        accountExpiration: new Date("06/15/2018"),
        countrySpecialities: ["France", "Germany", "Brazil", "Peru"],
        industrySpecialities: ["Steel", "Auto", "Chemistry"],
        CSATCompletion: new Date("02/05/2018"),
        emergencyContactInformation: [{ firstName: "Jane", lastName: "Doe", emailAddress: "jane.doe@gmail.com", phoneNumber: "555-444-3322" }, { firstName: "Berry", lastName: "Stone", emailAddress: "berry.stone@hotmail.com", phoneNumber: "888-777-4466" }],
        education: [{ schoolName: "Harvard University", degree: "MBA", year: "2002" }, { schoolName: "Yale University", degree: "Bachelors", year: "2010" }],
        certifications: [{ title: "Microsoft Technology Specialist", organization: "Microsoft", year: "2012" }, { title: "Database Administrator", organization: "Oracle", year: "2015" }]
    },
    {
        firstName: "Janette",
        middleName: "",
        lastName: "Lowes",
        suffix: "Mrs",
        workPhone: "214-565-8475", //mngr
        cellPhone: "897-412-2356", //user
        emailAddress: "janette.lowes@trade.gov", 
        officeRegion: "North America - West", //mngr
        officeCountry: "U.S.A", //mngr
        officeState: "California", //mngr
        mailingAddress: { addressLine1: "One Technology Dr.", addressLine2: "Apt #1424", state: "CA", city:"Oakland", zipCode: "84211", country: "U.S.A" },//user
        officeNumber: "3545", //mngr
        manager: { displayName: "Bora Akkaya", email: "boraakkaya@boraakkaya.onmicrosoft.com" }, //mngr
        employeeID: "98765", //readonly display
        employeeType: EmployeeTypes.RegularEmployee, //mngr
        accountExpiration: new Date("05/20/2019"), //mngr
        countrySpecialities: ["Italy", "Spain", "Portugal", "Greece"], //user
        industrySpecialities: ["Textile", "Energy", "Health"], //user
        CSATCompletion: new Date("01/01/2018"), //only show both user and mngr read-only
        emergencyContactInformation: [{ firstName: "Demi", lastName: "Dorotyh", emailAddress: "demi.dorothy@gmail.com", phoneNumber: "111-222-3344" }, { firstName: "Brian", lastName: "McCarty", emailAddress: "brian.mccarty@hotmail.com", phoneNumber: "666-111-3388" }], //user update and visible to manager only
        education: [{ schoolName: "UCLA", degree: "Bachelors", year: "1998" }], //user 
        certifications: [] //user
    },
    {
        firstName: "Bora",
        middleName: "",
        lastName: "Akkaya",
        suffix: "Mr",
        workPhone: "111-222-333",
        cellPhone: "444-555-6666",
        emailAddress: "boraakkaya@boraakkaya.onmicrosoft.com",
        officeRegion: "North America - East",
        officeCountry: "U.S.A",
        officeState: "Washington D.C",
        mailingAddress: { addressLine1: "950 N. Randolph St.", addressLine2: "Apt #1424 Arlington", state: "VA", city:"Arlington", zipCode: "22203", country: "U.S.A" },
        officeNumber: "11111",
        manager: { displayName: "Michael Brockman", email: "michael.brockman@trade.gov" },
        employeeID: "5555",
        employeeType: EmployeeTypes.Contractor,
        accountExpiration: new Date("05/20/2019"),
        countrySpecialities: ["Turkey", "Spain", "United Kingdom", "Canada"],
        industrySpecialities: ["Energy", "Automotive"],
        CSATCompletion: new Date("01/01/2018"),
        emergencyContactInformation: [{ firstName: "Andrew", lastName: "Smith", emailAddress: "andrew.smith@gmail.com", phoneNumber: "666-777-8844" }, { firstName: "John", lastName: "Haley", emailAddress: "john.haley@hotmail.com", phoneNumber: "444-321-4567" }],
        education: [{ schoolName: "Mersin University", degree: "Bachelors", year: "2002" }],
        certifications: [{ title: "Microsoft Technology Specialist", organization: "Microsoft", year: "2012" }, { title: "Web Development with HTML5 and CSS3", organization: "Microsoft", year: "2015" }]
    }
]