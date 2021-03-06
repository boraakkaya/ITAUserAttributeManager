import * as React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, ConfigProps, DecoratedComponentClass, GenericField,FieldArray  } from 'redux-form'
import styles from '../webparts/itaUserAttributeManager/ItaUserAttributeManagerWebPart.module.scss';
import { IUserProfile } from '../Interfaces/IUserProfile';
import UserDetail from './UserDetail';
import FetchBox from './../Components/FetchBox';
import store from '../Store';
import UITextField from './../Components/FabricUI/UITextField';
import MailingAddress from './FabricUI/MailingAddress';
import CustomFieldArray from './FabricUI/CustomFieldArray';
import { EmergencyContactInformation } from './FabricUI/EmergencyContactInformation';
import { EducationInformation } from './FabricUI/EducationInformation';
import { CertificationInformation } from './FabricUI/CertificationInformation';
import CustomFieldArray2 from './FabricUI/CustomFieldArray2';
import { Button, autobind } from 'office-ui-fabric-react';
import CustomFieldArray3 from './FabricUI/CustomFieldArray3';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import {HttpClient,HttpClientConfiguration} from '@microsoft/sp-http';
import { isfetching, updateUserProfileAsync, getChildTerms, getLoggedInUser } from '../Actions';
import Modal from 'office-ui-fabric-react/lib/Modal';
import { ITerms } from '../Interfaces/ITermStore';
import { TaxonomyPicker } from './TaxonomyPicker';

interface UserFormProps {
    currentTab:string;
    loggedInUser:IUserProfile;
    isfetching:boolean;
    initialize:(IUserProfile)=>{};    
    itaTermStore:ITerms,
    industryTerms:ITerms,
    change:any
    
};
interface UserFormState {
    ModalResponseStatus:{active:boolean, message:string};
    userIndustries:Array<ITerms>
};
class UserForm extends React.Component<UserFormProps, UserFormState> {    
    constructor(props)
    {        
        super(props);        
        this.state={ModalResponseStatus:{active:false,message:""}, userIndustries:[]};
    }

    componentWillMount()
    {
        this.props.initialize(this.props.loggedInUser);
        var userIndustryArray = [];
        this.props.industryTerms.Terms.map((term,index)=>{            
            this.props.loggedInUser.industrySpecialities.map((specialty,i)=>{                
                userIndustryArray = userIndustryArray.concat(getChildTerms(specialty,term,[]));                
            });            
        });                        
        this.setState({userIndustries:userIndustryArray});
    }

    public render(): JSX.Element {  
             
        return (<div className={styles.forms}>
            <h2>Update My Profile</h2>
            {this.props.isfetching && <FetchBox />}
            {!this.props.isfetching &&<div>
                <UserDetail user={this.props.loggedInUser} />
                
                <div>

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
            {this.state.ModalResponseStatus.message == "Success" ? <div>Successfully updated your user profile.</div> : <div>An error occured while updating user profile, please contact your SharePoint administrator.</div> }
            <br/>
            <br/>
            <div className={styles.buttonsbar}>
                <Button text="Close" onClick={(e)=>{this._closeModalResponseStatus()}} />  
                </div>
          </div>
        </Modal>


                <div>
                <div>Employee ID: {this.props.loggedInUser.employeeID} </div>
                </div>
                <div>
                <div>Employee Type: {this.props.loggedInUser.employeeType} </div>
                </div>
                <div>
                <div>Manager: {this.props.loggedInUser.manager.displayName} </div>
                </div>                
                <div>
                <div>Job Title: {this.props.loggedInUser.jobTitle} </div>
                </div>
                <form>                    
                <div className={styles.formsection}>
                    <h1>Phone Numbers</h1>
                    <div>
                    <Field name="cellPhone" component={UITextField} type="text"  label="Cell Phone" props={{errorMessage:"Required",required:true}}  />
                    </div>
                </div>
                <div className={styles.formsection}>
                    <h1>Mailing Address</h1>
                    <div>
                    <Field name="mailingAddress" component={MailingAddress} />
                    </div>
                </div>

                <div className={styles.formsection}>
                    <h1>Country Specialities</h1>
                    <div>
                    <FieldArray name="countrySpecialities" component={CustomFieldArray2} />
                    </div>
                </div>
                <div className={styles.formsection}>
                    <h1>Industry Specialities</h1>
                    <div>
                    {/* <FieldArray name="industrySpecialities" component={CustomFieldArray3}  props={{title:"Industry Specialities"}}/> */}
                    <Field name="industrySpecialities" component={TaxonomyPicker} props={{errorMessage:"Required",required:true, defaultSelectedTerms : this.state.userIndustries,termSource:this.props.industryTerms,allowMultipleSelection:true, onSelect:(terms:Array<ITerms>)=>{
                        if(terms != undefined && terms.length > 0)
                        {
                            var selectedTerms = [];
                            terms.map((term,index)=>{
                                selectedTerms.push(term.Name);
                            });
                            this.props.change("industrySpecialities",selectedTerms);
                            this.setState({userIndustries:terms});
                        }
                        else
                        {                           
                           this.props.change("industrySpecialities","");
                           this.setState({userIndustries:[]});
                        }                        
                    }}}  />
                    </div>
                </div>

                <div className={styles.formsection}>
                    <h1>Emergency Contact Information</h1>
                    <div>
                    <FieldArray name="emergencyContactInformation" component={EmergencyContactInformation}  props={{title:"Emergency Contact Information"}}/>
                    </div>
                </div>
                <div className={styles.formsection}>
                    <h1>Education Information</h1>
                    <div>
                    <FieldArray name="education" component={EducationInformation}  props={{title:"Education Information"}}/>
                    </div>
                </div>
                <div className={styles.formsection}>
                    <h1>Certification Information</h1>
                    <div>
                    <FieldArray name="certifications" component={CertificationInformation}  props={{title:"Certification Information"}}/>
                    </div>
                </div>
                <div className={styles.buttonsbar}>
                <Button text="Update My Profile" onClick={()=>{this.updateUserProfile(this.props.loggedInUser.emailAddress)}}  />
                </div>  
          </form>
          </div>
          </div>}
        </div>);
    }
    @autobind
    getUserProfile()
    {
        // sample account i:0#.f|membership|bora@itadev.onmicrosoft.com
        var ctx:IWebPartContext = (window as any).spfxContext;
        ctx.httpClient.get('https://itauserprofilemanager.azurewebsites.net/api/GetUserProfile?account=i%3A0%23.f%7Cmembership%7Cbora%40itadev.onmicrosoft.com',HttpClient.configurations.v1,{}).then((response)=>{
            response.json().then((result)=>{
                console.log("Result is ", result);
            })
        })
    }
    @autobind
    async reInitializeFormAfterUpdate()
    {
        console.log("Reinitializing.....");
        await store.dispatch(getLoggedInUser()).then(()=>
        {
            this.props.initialize(this.props.loggedInUser);
            console.log("Initialized");
            var userIndustryArray = [];
            this.props.industryTerms.Terms.map((term,index)=>{            
            this.props.loggedInUser.industrySpecialities.map((specialty,i)=>
            {
                userIndustryArray = userIndustryArray.concat(getChildTerms(specialty,term,[]));                
            });            
            });                        
            this.setState({userIndustries:userIndustryArray});
            console.log("Now state is ", this.state);
        })
    }
    @autobind
    _closeModalResponseStatus()
    {
        this.setState({ModalResponseStatus:{active:false,message:""}},()=>{this.reInitializeFormAfterUpdate();});
    }
    @autobind
    updateUserProfile(userEmail)
    {
        var storeState:any = store.getState();
        var data = storeState.form.userForm.values;
        store.dispatch(isfetching(true));
        
        updateUserProfileAsync(userEmail,data).then((result)=>{
            console.log("Async Result ", result);
            this.setState({ModalResponseStatus:{active:true,message:result.status}});
        }).catch((ex)=>{
            this.setState({ModalResponseStatus:{active:true,message:"Error"}});
        })
        store.dispatch(isfetching(false));
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        currentTab:state.currentTab,
        loggedInUser:state.loggedInUser,
        isfetching:state.isfetching,
        itaTermStore : state.itaTermStore,
        industryTerms : state.itaTermStore.ITATermGroupList[0].TermSets[1]
    }
}
export default reduxForm({
    form:'userForm',
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount    
})(connect(mapStateToProps)(UserForm))