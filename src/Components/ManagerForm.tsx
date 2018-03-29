import * as React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, ConfigProps, DecoratedComponentClass, GenericField,FieldArray  } from 'redux-form'
import UITextField from './../Components/FabricUI/UITextField';
import styles from '../webparts/itaUserAttributeManager/ItaUserAttributeManagerWebPart.module.scss';
import { Button, autobind, IPersonaProps, Dropdown, DatePicker, Label } from 'office-ui-fabric-react';
import { IUserProfile } from '../Interfaces/IUserProfile';
import FetchBox from './FetchBox';
import UserDetail from './UserDetail';
import { ITAPeoplePicker, ITAPersonaProps } from './ITAPeoplePicker';
import { getSelectedUser, emptySelectedUser, isfetching, updateUserProfileAsync } from '../Actions';
import Modal from 'office-ui-fabric-react/lib/Modal';
import store from '../Store';
import CustomDatePicker from './FabricUI/CustomDatePicker';
import OfficeLocations from './OfficeLocations';
import { TaxonomyPicker } from './TaxonomyPicker';
import { ITerms } from '../Interfaces/ITermStore';
import { IITALocation, ITALocations } from '../Data/ITALocations';
import { EnvironmentType, Environment } from '@microsoft/sp-core-library';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import {SPHttpClient} from '@microsoft/sp-http';
interface ManagerFormProps {
    currentTab:string;
    loggedInUser:IUserProfile;
    isfetching:boolean;
    change:any;
    selectedUser:IUserProfile;
    selectedUserForm:IUserProfile;
    initialize:(IUserProfile)=>{};
    departmentTerms:ITerms;
    
};

interface ManagerFormState {
    showModalDirectReports:boolean;
    ModalResponseStatus:{active:boolean, message:string};
    userDepartment:Array<ITerms>;
    departmentLocation:string;
};

class ManagerForm extends React.Component<ManagerFormProps, ManagerFormState> {

    pickerDefault:ITAPersonaProps[] = []    
    constructor(props)
    {        
        super(props);
        console.log("ManagerForm Constructor");
        this.state={showModalDirectReports:false, ModalResponseStatus:{active:false,message:""},userDepartment:[], departmentLocation:""};
    }
    componentWillMount()
    {
        console.log("ManagerForm Component Will Mount");
    }    
    componentWillUpdate(props,state,ctx)
    {
        console.log("ManagerForm Component Will Update");
        if(props.selectedUser.emailAddress != undefined)
        {
        this.pickerDefault=[{primaryText:props.selectedUser.firstName + " "  + props.selectedUser.lastName,
    secondaryText: props.selectedUser.emailAddress,
imageUrl: `https://boraakkaya.sharepoint.com/_layouts/15/userphoto.aspx?size=M&username=${props.selectedUser.emailAddress}`,userID:1}];
console.log("PickerDefault is : ",this.pickerDefault);
        }
        else
        {
            this.pickerDefault = [];
        }
    }

    @autobind
    public getChildTerms(val:string,term:ITerms, result:Array<ITerms>)
    {
        console.log("Value passd : ",val, " -  ResultSet : ", result);
        if(term.Name.toLowerCase()==val.toLowerCase())
        {            
            result.push(term);
        }
        if(term.Terms != undefined && term.Terms.length > 0)
        {
            (term.Terms as Array<ITerms>).map((a,index)=>{
                this.getChildTerms(val,a,result);
            })
        }
        return result;
    }
    public render(): JSX.Element {
        
        console.log("ManagerForm Rendering!!", this.props);
        var storeState:any = store.getState();
        let accountExpirationDate = storeState.form.selectedUserForm ? storeState.form.selectedUserForm.values.accountExpiration : undefined;
        
        return (<div className={styles.forms}>
            <h2>Update Employee Profile</h2> 
            <div>
                <div>
                    <br/>
                    <span>Select Direct Report Employee</span>
                <div>
                <div style={{width:"350px",display:"block"}}>
                <ITAPeoplePicker selectedItems={this.pickerDefault} defaultItems={this.pickerDefault} spContext={(window as any).spfxContext} onChange={(a: ITAPersonaProps[])=>{this.handleEmployeePickerChange(a)}} itemLimit={1}  />
                </div>
                <div style={{width:"150px",display:"block",marginTop:"5px"}}>
                <Button styles={{label:{fontWeight:"normal"}}} style={{backgroundColor:"#06B2AA",color:"#fff",padding:"3px 10px",width:"200px"}} text="View All Direct Reports" onClick={()=>{this.setState({showModalDirectReports:true})}} />
                </div>
                </div>
                <Modal
          isOpen={ this.state.showModalDirectReports }
          onDismiss={ this._closeModalDirectReports }
          isBlocking={ false }
          containerClassName="modalcontainer"
        >
          <div className="modalheader">
            <span>All Direct Reports</span>
          </div>
          <div className="modalbody">
            {this.props.loggedInUser.directReports.map((item,index)=>{
                return <div key={index} className="modalitem" onClick={()=>{
                    store.dispatch(getSelectedUser(item.email)).then(async()=>{
                        this.props.initialize(this.props.selectedUser);
                        this.setState({showModalDirectReports:false});
                        var userDepartment = [];
                        this.props.departmentTerms.Terms.map((term,index)=>{
                            console.log("YYYYYYYYY", userDepartment);
                            userDepartment = userDepartment.concat(this.getChildTerms(this.props.selectedUser.taxonomyDepartment,term,[]));
                        });                        
                        this.setState({userDepartment:userDepartment});
                        await this.getOfficeLocation(userDepartment[0].Id).then((location)=>{
                            let strLocation = `${location.AddressLine1} ${location.AddressLine2} ${location.City} ${location.State} ${location.Country} ${location.ZIPCode}`;
                            this.setState({departmentLocation : strLocation});
                        });
                    });
                }}>{item.displayName}</div>
            })}
            <Button className="closebutton" text="X" onClick={(e)=>{this._closeModalDirectReports()}} />
          </div>
        </Modal>
        <Modal
          isOpen={ this.state.ModalResponseStatus.active }
          onDismiss={ this._closeModalResponseStatus }
          isBlocking={ false }
          containerClassName="modalcontainer"
        >
          <div className="modalheader">
            <span>{this.state.ModalResponseStatus.message}</span>
          </div>
          <div className="modalbody">
            {this.state.ModalResponseStatus.message == "Success" ? <div>Successfully updated user profile.</div> : <div>An error occured while updating user profile, please contact your SharePoint administrator.</div> }
            <br/>
            <br/>
            <div className={styles.buttonsbar}>
                <Button text="Close" onClick={(e)=>{this._closeModalResponseStatus()}} />  
                </div>
          </div>
        </Modal>


                </div>
                {this.props.isfetching && <FetchBox />}
                {this.props.selectedUser.emailAddress != undefined  && !this.props.isfetching && <div>
                <UserDetail user={this.props.selectedUser} />                
                <div>
                <form>
                <div className={styles.formsection}>
                    <h1>Account Information</h1>
                    <div>
                    <div className={styles.readonlyelement}>Employee ID : {this.props.selectedUser.employeeID}</div>
                    <div className={styles.readonlyelement}>CSAT Completion Date : {this.props.selectedUser.CSATCompletion != null ?this.props.selectedUser.CSATCompletion.toDateString() : ""}</div>
                    <div className={styles.readonlyelement}>Mailing Address : {this.props.selectedUser.mailingAddress.addressLine1} {this.props.selectedUser.mailingAddress.addressLine2} {this.props.selectedUser.mailingAddress.city} {this.props.selectedUser.mailingAddress.state} {this.props.selectedUser.mailingAddress.zipCode} {this.props.selectedUser.mailingAddress.country}</div>
                    <div className={styles.readonlyelement}>Cell Phone : {this.props.selectedUser.cellPhone}</div>              
                    <Field name="workPhone" component={UITextField} type="text"  label="Work Phone" props={{errorMessage:"Required",required:true}}  />

                    <div style={{paddingLeft:"12px", margin:"10px 0px"}}>                    
                    <Field name="employeeType" component={Dropdown} label="Employee Type" props={{options:[{key:"Regular Employee",text:"Regular Employee"},{key:"Contractor",text:"Contractor"},{key:"Intern",text:"Intern"}],defaultSelectedKey:this.props.selectedUser.employeeType == undefined ? undefined : this.props.selectedUser.employeeType,onChanged:(e)=>{this.props.change("employeeType",e.text);}}} />
                    </div>
                    <Field name="jobTitle" component={UITextField} type="text"  label="Job Title" props={{errorMessage:"Required",required:true}}  />

                    {/* <Field name="department" component={UITextField} type="text"  label="Department" props={{errorMessage:"Required",required:true}}  />
                    <DepartmentPicker label="Department" termSource={this.props.departmentTerms}  allowMultipleSelection={false} /> */}

                    <Field name="department" component={TaxonomyPicker} label="Department" props={{errorMessage:"Required",required:true, defaultSelectedTerms : this.state.userDepartment,termSource:this.props.departmentTerms,allowMultipleSelection:false, onSelect:(terms:Array<ITerms>)=>{
                        if(terms != undefined && terms.length > 0)
                        {
                        this.props.change("department",terms[0].Labels.length > 1 ? terms[0].Labels[1] : terms[0].Name);
                        this.props.change("taxonomyDepartment",terms[0].Name);                        
                        this.getOfficeLocation(terms[0].Id).then((location)=>{
                            let strLocation = `${location.AddressLine1} ${location.AddressLine2} ${location.City} ${location.State} ${location.Country} ${location.ZIPCode}`;
                            this.setState({departmentLocation : strLocation});
                        });
                        this.setState({userDepartment:terms});
                        }
                        else
                        {
                            this.props.change("department","");
                            this.props.change("taxonomyDepartment","");
                            this.setState({userDepartment:[]});
                        }                        
                    }}}  />
                    <div className={styles.readonlyelement}>Department Location :{this.state.departmentLocation}</div>
                    
                    <Field name="taxonomyDepartment" component="input" type="text" style={{display:"none"}} />
                    <Field name="officeNumber" component={UITextField} type="text"  label="Office Number" props={{errorMessage:"Required",required:true}}  />

                    <div style={{paddingLeft:"12px", margin:"0px 0px 10px 0px"}}>   
                    Manager                 
                    <br/>
                    <Field name="manager" component={ITAPeoplePicker} label="Manager" props={{defaultItems: this.props.selectedUser.manager.displayName !="" ? [{primaryText:this.props.selectedUser.manager.displayName,secondaryText:this.props.selectedUser.manager.email}] : [] ,
                    spContext: (window as any).spfxContext,
                    itemLimit:1,onChange:(e)=>{                        
                    if(e.length > 0)
                    {
                        this.props.change("manager",{displayName:e[0].primaryText,email:e[0].secondaryText});
                    }
                    else
                    {
                        this.props.change("manager",{displayName:"",email:""});
                    }
                    }}} />                    
                    </div>
                    <div style={{paddingLeft:"12px", margin:"0px 0px 10px 0px"}}>
                    <Field name="accountExpiration" component={CustomDatePicker} label="Account Expiration" props={{
                        onSelectDate:(e)=>{
                            console.log(this.props);
                            this.props.change("accountExpiration",e.toLocaleDateString());console.log("Changed",e.toLocaleDateString())}
                    }} />                  
                    </div>
                    </div>

                </div>

                <div className={styles.formsection}>
                    <h1>Country Specialities</h1>
                    <div>
                        {this.props.selectedUser.countrySpecialities.map((country,index)=>{
                            return <span key={index}>{country}, </span>
                        })}
                    </div>
                </div>
                <div className={styles.formsection}>
                    <h1>Industry Specialities</h1>
                    <div>
                    {this.props.selectedUser.industrySpecialities.map((industry,index)=>{
                            return <span key={index}>{industry}, </span>
                        })}
                    </div>
                </div>
                <div className={styles.formsection}>
                    <h1>Education Information</h1>
                    <div>
                    {this.props.selectedUser.education && this.props.selectedUser.education.map((education,index)=>{
                            return <div key={index}>{education.schoolName}, {education.degree}, {education.year} </div>
                        })}
                    </div>
                </div>
                <div className={styles.formsection}>
                    <h1>Certification Information</h1>
                    <div>
                    {this.props.selectedUser.certifications && this.props.selectedUser.certifications.map((certification,index)=>{
                            return <div key={index}>{certification.title}, {certification.organization}, {certification.year} </div>
                        })}
                    
                    </div>
                </div>
                <div className={styles.formsection}>
                    <h1>Emergency Contact Information</h1>
                    <div>
                    {this.props.selectedUser.emergencyContactInformation && this.props.selectedUser.emergencyContactInformation.map((contact,index)=>{
                            return <div key={index}>{contact.firstName} {contact.lastName}, {contact.phoneNumber}, {contact.emailAddress} </div>
                        })}
                    </div>
                </div>
                <div className={styles.buttonsbar}>
                <Button text="Update Employee Profile" onClick={(e)=>{this.updateUserProfile(this.props.selectedUser.emailAddress)}} />  
                </div>
          </form>
          </div>
          
          </div>}


          </div>
        </div>);
    }

    @autobind
    updateUserProfile(userEmail)
    {
        var storeState:any = store.getState();
        var data = storeState.form.selectedUserForm.values;
        store.dispatch(isfetching(true));
        
        updateUserProfileAsync(userEmail,data).then((result)=>{
            console.log("Async Result ", result);
            this.setState({ModalResponseStatus:{active:true,message:result.status}});
        }).catch((ex)=>{
            this.setState({ModalResponseStatus:{active:true,message:"Error"}});
        });
        store.dispatch(isfetching(false));
    }

    @autobind
    async getOfficeLocation(termID):Promise<IITALocation>
    {
        var location:IITALocation| any;
        var locationsArray:Array<IITALocation>;
        if(Environment.type == EnvironmentType.Local)
        {
            await new Promise((resolve)=>{
                window.setTimeout(()=>{
                    resolve();
                },2000);
            }).then((async)=>{                
                locationsArray = ITALocations;
                locationsArray = locationsArray.filter((location:IITALocation,index)=>{
                return location.Department.TermGuid == termID ? true : false;
            });
                location = locationsArray[0];
            })
        }
        else
        {
            var ctx:IWebPartContext = (window as any).spfxContext;
            await ctx.spHttpClient.get(`https://itadev.sharepoint.com/_api/web/lists/getbytitle('ITA%20Locations')/items`,SPHttpClient.configurations.v1,{}).then(async (response)=>{
                await response.json().then(async (data)=>{
                if(data.value && data.value.length > 0)
                {
                    locationsArray = data.value;
                    locationsArray = locationsArray.filter((a:IITALocation,index)=>{
                    return a.Department.TermGuid == termID ? true : false;
                    });
                    location = {};
                    location.AddressLine1 = locationsArray[0].AddressLine1 == null ? "" : locationsArray[0].AddressLine1;
                    location.AddressLine2 = locationsArray[0].AddressLine2 == null ? "" : locationsArray[0].AddressLine2;
                    location.City = locationsArray[0].City == null ? "" : locationsArray[0].City;
                    location.State = locationsArray[0].State == null ? "" : locationsArray[0].State;
                    location.Country = locationsArray[0].Country == null ? "" : locationsArray[0].Country;
                    location.ZIPCode = locationsArray[0].ZIPCode == null ? "" : locationsArray[0].ZIPCode;
                    location.Department = locationsArray[0].Department;
                }
                else
                {
                location = {AddressLine1:"", AddressLine2:"", Country:"", State:"", City:"",ZIPCode:"", Department:{Label:"",TermGuid:""}}   }
                })}).catch(()=>{
                location = {AddressLine1:"", AddressLine2:"", Country:"", State:"", City:"",ZIPCode:"", Department:{Label:"",TermGuid:""}}
            })
        }
        return location;
    }

    @autobind
    _closeModalDirectReports()
    {
        this.setState({showModalDirectReports:false});
    }
    @autobind
    _closeModalResponseStatus()
    {
        this.setState({ModalResponseStatus:{active:false,message:""}});

    }
    @autobind
    handleEmployeePickerChange(user:ITAPersonaProps[])
    {
        console.log("On Handle Employee Picker Change");
        if(user.length > 0)
        {
        let pickerSelection = user[0];
        let pickerEmail = pickerSelection.secondaryText;
        store.dispatch(getSelectedUser(pickerEmail)).then(async()=>{
            this.props.initialize(this.props.selectedUser);
            //
            var userDepartment:Array<ITerms> = [];
            this.props.departmentTerms.Terms.map((term,index)=>{
            console.log("ZZZZZZZZZ", userDepartment);
            userDepartment = userDepartment.concat(this.getChildTerms(this.props.selectedUser.taxonomyDepartment,term,[]));
            });                        
            this.setState({userDepartment:userDepartment});
            await this.getOfficeLocation(userDepartment[0].Id).then((location)=>{
                let strLocation = `${location.AddressLine1} ${location.AddressLine2} ${location.City} ${location.State} ${location.Country} ${location.ZIPCode}`;
                this.setState({departmentLocation : strLocation});
            });
            //
        });
        
        }
        else
        {
            //empty picker
            emptySelectedUser();
            this.props.initialize({});
        }
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        currentTab:state.currentTab,
        loggedInUser:state.loggedInUser,
        isfetching:state.isfetching,
        selectedUser:state.selectedUser,
        departmentTerms : state.itaTermStore.ITATermGroupList[1].TermSets["0"].Terms[1]
    }
}
export default reduxForm({
    form:'selectedUserForm',
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount    
})(connect(mapStateToProps)(ManagerForm))
