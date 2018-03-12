import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import styles from '../../webparts/itaUserAttributeManager/ItaUserAttributeManagerWebPart.module.scss';
import { IContact, IEducation } from '../../Interfaces/IUserProfile';
import { TextField, ITextFieldProps } from 'office-ui-fabric-react';
import { autobind } from '@uifabric/utilities';
export interface EducationInformationProps {
    fields:any;
    meta:any;
    title:string;
};
export interface EducationInformationState {};
const deleteIcon = require('./../../Assets/delete.png');
export class EducationInformation extends React.Component<EducationInformationProps  & WrappedFieldProps, EducationInformationState> {
    
    public render(): JSX.Element {
        
        return (<div>            
            {this.props.fields.map((item,index)=>{                
                return <div key={index} className={styles.formborderbox}>
                <div><img width="25px" src={deleteIcon} onClick={() => this.props.fields.remove(index)} /></div>
                <Field name={item} component={Education} />                
                </div>
            })}
            <div className={styles.addnewitem} onClick={() => this.props.fields.push()}>Add New</div>
        </div>);
    }
}

export interface EducationProps {
    input:{value:IEducation,label:any,onChange:any};
    meta:any;
};

export interface EducationState {};

export class Education extends React.Component<EducationProps, EducationState> {
    public render(): JSX.Element {
        return (<div>            
            <TextField underlined label="School Name" required  defaultValue={this.props.input.value.schoolName} onChanged={(e)=>{this.props.input.onChange({...this.props.input.value,schoolName:e})}} onGetErrorMessage={this.setErrorMessage} />
            <TextField underlined label="Degree" required defaultValue={this.props.input.value.degree} onChanged={(e)=>{this.props.input.onChange({...this.props.input.value,degree:e})}} onGetErrorMessage={this.setErrorMessage} />
            <TextField underlined label="Year" required defaultValue={this.props.input.value.year} onChanged={(e)=>{this.props.input.onChange({...this.props.input.value,year:e})}} onGetErrorMessage={this.setErrorMessage} />
        </div>);
    }
    @autobind
    setErrorMessage(value):string
    {
        return value.length > 0 ? "" : "Required!";
    }
    
}

