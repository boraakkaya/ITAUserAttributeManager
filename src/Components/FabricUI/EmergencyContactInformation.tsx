import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import styles from '../../webparts/itaUserAttributeManager/ItaUserAttributeManagerWebPart.module.scss';
import { IContact } from '../../Interfaces/IUserProfile';
import { TextField, ITextFieldProps } from 'office-ui-fabric-react/lib/TextField';
import { autobind } from '@uifabric/utilities';
export interface EmergencyContactInformationProps {
    fields:any;
    meta:any;
    title:string;
};
export interface EmergencyContactInformationState {};
const deleteIcon = require('./../../Assets/delete.png');
export class EmergencyContactInformation extends React.Component<EmergencyContactInformationProps  & WrappedFieldProps, EmergencyContactInformationState> {
    
    public render(): JSX.Element {
        
        return (<div>            
            {this.props.fields.map((item,index)=>{                
                return <div key={index} className={styles.formborderbox}>
                <div><img width="25px" src={deleteIcon} onClick={() => this.props.fields.remove(index)} /></div>
                <Field name={item} component={EmergencyContact} />                
                </div>
            })}
            <div className={styles.addnewitem} onClick={() => this.props.fields.push()}>Add New</div>
        </div>);
    }
}

export interface EmergencyContactProps {
    input:{value:IContact,label:any,onChange:any};
    meta:any;
};

export interface EmergencyContactState {};

export class EmergencyContact extends React.Component<EmergencyContactProps, EmergencyContactState> {
    public render(): JSX.Element {
        return (<div>
            
            <TextField underlined label="First Name" required  defaultValue={this.props.input.value.firstName} onChanged={(e)=>{this.props.input.onChange({...this.props.input.value,firstName:e})}} onGetErrorMessage={this.setErrorMessage} />
            <TextField underlined label="Last Name" required defaultValue={this.props.input.value.lastName} onChanged={(e)=>{this.props.input.onChange({...this.props.input.value,lastName:e})}} onGetErrorMessage={this.setErrorMessage} />
            <TextField underlined label="Phone Number" required defaultValue={this.props.input.value.phoneNumber} onChanged={(e)=>{this.props.input.onChange({...this.props.input.value,phoneNumber:e})}} onGetErrorMessage={this.setErrorMessage} />
            <TextField underlined label="Email Address" required defaultValue={this.props.input.value.emailAddress} onChanged={(e)=>{this.props.input.onChange({...this.props.input.value,emailAddress:e})}} onGetErrorMessage={this.setErrorMessage} />
        </div>);
    }
    @autobind
    setErrorMessage(value):string
    {
        return value.length > 0 ? "" : "Required!";
    }
    
}

