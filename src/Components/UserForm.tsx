import * as React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form'
import styles from '../webparts/itaUserAttributeManager/ItaUserAttributeManagerWebPart.module.scss';
import { IUserProfile } from '../Interfaces/IUserProfile';
import UserDetail from './UserDetail';
import FetchBox from '../../lib/Components/FetchBox';
import store from '../Store';
interface UserFormProps {
    currentTab:string;
    loggedInUser:IUserProfile;
    isfetching:boolean;
    initialize:(IUserProfile)=>{};
    initialValues:IUserProfile;
};
interface UserFormState {};
class UserForm extends React.Component<UserFormProps, UserFormState> {    
    componentWillMount()
    {
        console.log("Component Will Mount");
        this.props.initialize(this.props.loggedInUser);
    }
    componentWillReceiveProps(a,b)
    {
        console.log("Component Will Receive Props");
    }
    componentDidMount()
    {
        console.log("Component Did Mount");
    }
    componentDidUpdate()
    {
        console.log("Component Did Update");
    }
    componentWillUnmount()
    {
        console.log("Component Will Unmount");

    }
    componentWillUpdate()
    {
        console.log("Component Will Update");
    }
    public render(): JSX.Element {        
        return (<div className={styles.forms}>
            <h2>Update My Profile</h2>
            {this.props.isfetching && <FetchBox />}
            {!this.props.isfetching &&<div>
                <UserDetail user={this.props.loggedInUser} />
                <div>
                <form>
                <Field name="firstName" component="input" type="text" placeholder="First Name" />
                <Field name="middleName" component="input" type="text" placeholder="First Name" />
                <Field name="lastName" component="input" type="text" placeholder="First Name" />          
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
        isfetching:state.isfetching,
        initialValues: state.loggedInUser,
    }
}
export default reduxForm({
    form:'userForm',
    destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  //initialValues : (store.getState() as any).loggedInUser
})(connect(mapStateToProps)(UserForm))