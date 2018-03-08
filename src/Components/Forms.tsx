import * as React from 'react';
import { connect } from 'react-redux';
import { ITabs } from '../reducers/currentTab';
import ManagerForm from './ManagerForm';
import UserForm from './UserForm';

interface FormsProps {
    currentTab:ITabs;
};

interface FormsState {};

class Forms extends React.Component<FormsProps, FormsState> {
    public render(): JSX.Element {
        return (<div>
            {this.props.currentTab == ITabs.userTab && <UserForm />}
            {this.props.currentTab == ITabs.managerTab && <ManagerForm />}
        </div>);
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        currentTab: state.currentTab
    }
}
export default connect(mapStateToProps)(Forms);
