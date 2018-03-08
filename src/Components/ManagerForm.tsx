import * as React from 'react';
import { connect } from 'react-redux';
import styles from '../webparts/itaUserAttributeManager/ItaUserAttributeManagerWebPart.module.scss';

interface ManagerFormProps {};

interface ManagerFormState {};

class ManagerForm extends React.Component<ManagerFormProps, ManagerFormState> {
    public render(): JSX.Element {
        return (<div className={styles.forms}>
            <h2>Update Employee Profile</h2>


        </div>);
    }
}

export default connect(
    (state) => ({
        // Map state to props
    }),
    {
        // Map dispatch to props
    })(ManagerForm);
