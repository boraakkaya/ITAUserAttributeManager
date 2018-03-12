import * as React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, ConfigProps, DecoratedComponentClass, GenericField,FieldArray  } from 'redux-form'
import UITextField from './../Components/FabricUI/UITextField';
import styles from '../webparts/itaUserAttributeManager/ItaUserAttributeManagerWebPart.module.scss';
import { Button, autobind, IPersonaProps, Dropdown, DatePicker } from 'office-ui-fabric-react';
import { IUserProfile } from '../Interfaces/IUserProfile';
import FetchBox from './FetchBox';
import UserDetail from './UserDetail';
import { ITAPeoplePicker, ITAPersonaProps } from './ITAPeoplePicker';
import store from '../Store';
import { getSelectedUser, emptySelectedUser } from '../Actions';

interface ManagerFormProps {
    currentTab:string;
    loggedInUser:IUserProfile;
    isfetching:boolean;
    change:any;
    selectedUser:IUserProfile;
    userForm:IUserProfile;
};

interface ManagerFormState {};

class ManagerForm extends React.Component<ManagerFormProps, ManagerFormState> {
    pickerDefault:ITAPersonaProps[] = []
    componentWillMount()
    {
        if(this.props.selectedUser.emailAddress != undefined)
        {
        this.pickerDefault.push({primaryText:this.props.selectedUser.firstName + " "  + this.props.selectedUser.lastName,
    secondaryText: this.props.selectedUser.emailAddress,
imageUrl: `https://boraakkaya.sharepoint.com/_layouts/15/userphoto.aspx?size=M&username=${this.props.selectedUser.emailAddress}`, imageInitials:"JD", tertiaryText: 'In a meeting',
optionalText: 'Available at 4:00pm',userID:1})
        }
    }

    public render(): JSX.Element {
        console.log("Re-rendering!!", this.props);
        let accountExpirationDate = this.props.userForm.accountExpiration;
        return (<div className={styles.forms}>
            <h2>Update Employee Profile</h2>            
            <div>
                <div>
                    <br/>
                    <span>Select Direct Report Employee</span>
                <ITAPeoplePicker defaultItems={this.pickerDefault} spContext={(window as any).spfxContext} onChange={(a: ITAPersonaProps[])=>{this.handleEmployeePickerChange(a)}} itemLimit={1}  />
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
                    <div className={styles.readonlyelement}>CSAT Completion Date : {this.props.selectedUser.CSATCompletion.toDateString()}</div>
                    <div className={styles.readonlyelement}>Mailing Address : {this.props.selectedUser.mailingAddress.addressLine1} {this.props.selectedUser.mailingAddress.addressLine2} {this.props.selectedUser.mailingAddress.city} {this.props.selectedUser.mailingAddress.state} {this.props.selectedUser.mailingAddress.zipCode} {this.props.selectedUser.mailingAddress.country}</div>
                    <div className={styles.readonlyelement}>Cell Phone : {this.props.selectedUser.cellPhone}</div>              
                    <Field name="workPhone" component={UITextField} type="text"  label="Work Phone" props={{errorMessage:"Required",required:true}}  />

                    <div style={{paddingLeft:"12px", margin:"10px 0px"}}>                    
                    <Field name="employeeType" component={Dropdown} label="Employee Type" props={{options:[{key:"Regular Employee",text:"Regular Employee"},{key:"Contractor",text:"Contractor"},{key:"Intern",text:"Intern"}],defaultSelectedKey:this.props.selectedUser.employeeType == undefined ? undefined : this.props.selectedUser.employeeType,onChanged:(e)=>{console.log("EEEEEEEEEEE ",e);this.props.change("employeeType",e.text);}}} />                    
                    </div>

                    <div style={{paddingLeft:"12px", margin:"0px 0px 10px 0px"}}>   
                    Manager                 
                    <br/>
                    <Field name="manager" component={ITAPeoplePicker} label="Manager" props={{defaultItems: this.props.selectedUser.manager.displayName !="" ? [{primaryText:this.props.selectedUser.manager.displayName,secondaryText:this.props.selectedUser.manager.email}] : [] ,
                    spContext: (window as any).spfxContext,
                    itemLimit:1,onChange:(e)=>{console.log("EEEEEEEEEEE ",e);
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
                    <Field name="accountExpiration" component={DatePicker} label="Account Expiration" props={{
                        value:accountExpirationDate,
                        //value:new Date("10/10/2018"),
                        onSelectDate:(e)=>{this.props.change("accountExpiration",e);console.log("Changed",e);}
                    }} />                    
                    </div>

                    

                    <Field name="officeRegion" component={UITextField} type="text"  label="Office Location" props={{errorMessage:"Required",required:true}}  />
                    <Field name="officeNumber" component={UITextField} type="text"  label="Office Number" props={{errorMessage:"Required",required:true}}  />
                    
                    </div>

                </div>

                <div className={styles.formsection}>
                    <h1>Country Specialities</h1>
                    <div>
                        {this.props.selectedUser.countrySpecialities.map((country,index)=>{
                            return <span>{country}, </span>
                        })}
                    </div>
                </div>
                <div className={styles.formsection}>
                    <h1>Industry Specialities</h1>
                    <div>
                    {this.props.selectedUser.industrySpecialities.map((industry,index)=>{
                            return <span>{industry}, </span>
                        })}
                    </div>
                </div>
                <div className={styles.formsection}>
                    <h1>Education Information</h1>
                    <div>
                    {this.props.selectedUser.education.map((education,index)=>{
                            return <div>{education.schoolName}, {education.degree}, {education.year} </div>
                        })}
                    
                    </div>
                </div>
                <div className={styles.formsection}>
                    <h1>Certification Information</h1>
                    <div>
                    {this.props.selectedUser.certifications.map((certification,index)=>{
                            return <div>{certification.title}, {certification.organization}, {certification.year} </div>
                        })}
                    
                    </div>
                </div>
                <div className={styles.formsection}>
                    <h1>Emergency Contact Information</h1>
                    <div>
                    {this.props.selectedUser.emergencyContactInformation.map((contact,index)=>{
                            return <div>{contact.firstName} {contact.lastName}, {contact.phoneNumber}, {contact.emailAddress} </div>
                        })}
                    </div>
                </div>



                <div className={styles.buttonsbar}>
                <Button text="Update Employee Profile" />  
                </div>
          </form>
          </div>
          
          </div>}


          </div>
        </div>);
    }

    @autobind
    handleEmployeePickerChange(user:ITAPersonaProps[])
    {
        if(user.length > 0)
        {
        let pickerSelection = user[0];
        let pickerEmail = pickerSelection.secondaryText;
        store.dispatch(getSelectedUser(pickerEmail));
        }
        else
        {
            //empty picker
            emptySelectedUser();
        }
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        currentTab:state.currentTab,
        loggedInUser:state.loggedInUser,
        isfetching:state.isfetching,
        selectedUser:state.selectedUser,
        userForm: state.form.userForm.values
    }
}
export default reduxForm({
    form:'userForm',
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount    
})(connect(mapStateToProps)(ManagerForm))
