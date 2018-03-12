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
import { Button } from 'office-ui-fabric-react';
import CustomFieldArray3 from './FabricUI/CustomFieldArray3';
interface UserFormProps {
    currentTab:string;
    loggedInUser:IUserProfile;
    isfetching:boolean;
    initialize:(IUserProfile)=>{};    
    
};
interface UserFormState {};
class UserForm extends React.Component<UserFormProps, UserFormState> {    
    
    componentWillMount()
    {
        this.props.initialize(this.props.loggedInUser);
    }
    public render(): JSX.Element {  
             
        return (<div className={styles.forms}>
            <h2>Update My Profile</h2>
            {this.props.isfetching && <FetchBox />}
            {!this.props.isfetching &&<div>
                <UserDetail user={this.props.loggedInUser} />
                
                <div>
                <div>
                <div><b>Employee ID</b></div><div style={{display:"inline-block"}}>{this.props.loggedInUser.employeeID} </div>
                </div>
                <div>
                <div><b>Manager</b></div><div style={{display:"inline-block"}}>{this.props.loggedInUser.manager.displayName} </div>
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
                    <FieldArray name="industrySpecialities" component={CustomFieldArray3}  props={{title:"Industry Specialities"}}/>
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
                <Button text="Update My Profile" />
                </div>  
          </form>
          </div>
          </div>}
        </div>);
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        currentTab:state.currentTab,
        loggedInUser:state.loggedInUser,
        isfetching:state.isfetching
    }
}
export default reduxForm({
    form:'userForm',
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount    
})(connect(mapStateToProps)(UserForm))