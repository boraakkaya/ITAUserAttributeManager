import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import styles from '../../webparts/itaUserAttributeManager/ItaUserAttributeManagerWebPart.module.scss';
import { IContact, ICertification } from '../../Interfaces/IUserProfile';
import { TextField, ITextFieldProps } from 'office-ui-fabric-react/lib/TextField';
import { autobind } from '@uifabric/utilities';
export interface CertificationInformationProps {
    fields:any;
    meta:any;
    title:string;
};
export interface CertificationInformationState {};
const deleteIcon = require('./../../Assets/delete.png');
export class CertificationInformation extends React.Component<CertificationInformationProps  & WrappedFieldProps, CertificationInformationState> {
    
    public render(): JSX.Element {
        
        return (<div>            
            {this.props.fields.map((item,index)=>{                
                return <div key={index} className={styles.formborderbox}>
                <div><img width="25px" src={deleteIcon} onClick={() => this.props.fields.remove(index)} /></div>
                <Field name={item} component={Certification} />                
                </div>
            })}
            <div className={styles.addnewitem} onClick={() => this.props.fields.push()}>Add New</div>
        </div>);
    }
}

export interface CertificationProps {
    input:{value:ICertification,label:any,onChange:any};
    meta:any;
};

export interface CertificationState {};

export class Certification extends React.Component<CertificationProps, CertificationState> {
    public render(): JSX.Element {
        return (<div>            
            <TextField underlined label="Organization" required  defaultValue={this.props.input.value.organization} onChanged={(e)=>{this.props.input.onChange({...this.props.input.value,schoolName:e})}} onGetErrorMessage={this.setErrorMessage} />
            <TextField underlined label="Title" required defaultValue={this.props.input.value.title} onChanged={(e)=>{this.props.input.onChange({...this.props.input.value,degree:e})}} onGetErrorMessage={this.setErrorMessage} />
            <TextField underlined label="Year" required defaultValue={this.props.input.value.year} onChanged={(e)=>{this.props.input.onChange({...this.props.input.value,year:e})}} onGetErrorMessage={this.setErrorMessage} />
        </div>);
    }
    @autobind
    setErrorMessage(value):string
    {
        return value.length > 0 ? "" : "Required!";
    }
    
}

