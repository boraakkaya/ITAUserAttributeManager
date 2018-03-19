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
import { getSelectedUser, emptySelectedUser, isfetching, updateUserProfileAsync } from '../Actions';
import Modal from 'office-ui-fabric-react/lib/Modal';
import store from '../Store';
import CustomDatePicker from './FabricUI/CustomDatePicker';

interface ManagerFormProps {
    currentTab:string;
    loggedInUser:IUserProfile;
    isfetching:boolean;
    change:any;
    selectedUser:IUserProfile;
    selectedUserForm:IUserProfile;
    initialize:(IUserProfile)=>{};
    
};

interface ManagerFormState {
    showModalDirectReports:boolean;
    ModalResponseStatus:{active:boolean, message:string};
};

class ManagerForm extends React.Component<ManagerFormProps, ManagerFormState> {

    pickerDefault:ITAPersonaProps[] = []
    constructor(props)
    {        
        super(props);
        console.log("Constructor");
        this.state={showModalDirectReports:false, ModalResponseStatus:{active:false,message:""}};
    }
    componentWillMount()
    {
        console.log("Component Will Mount");
    }
    
    componentWillUpdate(props,state,ctx)
    {
        console.log("Component Will Update");
        if(props.selectedUser.emailAddress != undefined)
        {
        //    this.pickerDefault = [];
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
    public render(): JSX.Element {
        
        console.log("Re-rendering!!", this.props);
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
                return <div className="modalitem" onClick={()=>{
                    store.dispatch(getSelectedUser(item.email)).then(()=>{
                        this.props.initialize(this.props.selectedUser);
                        this.setState({showModalDirectReports:false});
                    });
                }}>{item.displayName}</div>
            })}
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
                    <Field name="employeeType" component={Dropdown} label="Employee Type" props={{options:[{key:"Regular Employee",text:"Regular Employee"},{key:"Contractor",text:"Contractor"},{key:"Intern",text:"Intern"}],defaultSelectedKey:this.props.selectedUser.employeeType == undefined ? undefined : this.props.selectedUser.employeeType,onChanged:(e)=>{console.log("EEEEEEEEEEE ",e);this.props.change("employeeType",e.text);}}} />                    
                    </div>

                    <Field name="jobTitle" component={UITextField} type="text"  label="Job Title" props={{errorMessage:"Required",required:true}}  />

                    <Field name="department" component={UITextField} type="text"  label="Department" props={{errorMessage:"Required",required:true}}  />

                    <div style={{paddingLeft:"12px", margin:"0px 0px 10px 0px"}}>   
                    Manager                 
                    <br/>
                    <Field name="manager" component={ITAPeoplePicker} label="Manager" props={{defaultItems: this.props.selectedUser.manager.displayName !="" ? [{primaryText:this.props.selectedUser.manager.displayName,secondaryText:this.props.selectedUser.manager.email}] : [] ,
                    spContext: (window as any).spfxContext,
                    itemLimit:1,onChange:(e)=>{
                        console.log("EEEEEEEEEEEEEEEEEEEEEEEE",e)
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
                    {/* <Field name="accountExpiration" component={DatePicker} label="Account Expiration" props={{
                        //value:accountExpirationDate,
                        //value:new Date("10/10/2018"),
                        onSelectDate:(e)=>{
                            console.log(this.props);
                            this.props.change("accountExpiration",e);console.log("Changed",e);}
                    }} />  */}

                    <Field name="accountExpiration" component={CustomDatePicker} label="Account Expiration" props={{
                        onSelectDate:(e)=>{
                            console.log(this.props);
                            this.props.change("accountExpiration",e.toLocaleDateString());console.log("Changed",e.toLocaleDateString())}
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
                    {this.props.selectedUser.education && this.props.selectedUser.education.map((education,index)=>{
                            return <div>{education.schoolName}, {education.degree}, {education.year} </div>
                        })}
                    </div>
                </div>
                <div className={styles.formsection}>
                    <h1>Certification Information</h1>
                    <div>
                    {this.props.selectedUser.certifications && this.props.selectedUser.certifications.map((certification,index)=>{
                            return <div>{certification.title}, {certification.organization}, {certification.year} </div>
                        })}
                    
                    </div>
                </div>
                <div className={styles.formsection}>
                    <h1>Emergency Contact Information</h1>
                    <div>
                    {this.props.selectedUser.emergencyContactInformation && this.props.selectedUser.emergencyContactInformation.map((contact,index)=>{
                            return <div>{contact.firstName} {contact.lastName}, {contact.phoneNumber}, {contact.emailAddress} </div>
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
        store.dispatch(getSelectedUser(pickerEmail)).then(()=>{
            this.props.initialize(this.props.selectedUser);
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
        selectedUser:state.selectedUser
    }
}
export default reduxForm({
    form:'selectedUserForm',
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount    
})(connect(mapStateToProps)(ManagerForm))
