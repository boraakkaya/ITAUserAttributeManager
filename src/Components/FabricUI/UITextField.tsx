import * as React from 'react';
import {TextField, ITextFieldProps} from 'office-ui-fabric-react';
import { WrappedFieldProps } from 'redux-form';
import { autobind } from '@uifabric/utilities';
import styles from '../../webparts/itaUserAttributeManager/ItaUserAttributeManagerWebPart.module.scss';
export interface UITextFieldProps {
    required?:boolean
    errorMessage?:string;
    label:string;
    input:{value:any,label:any}
    meta:{}
};
export interface P extends UITextFieldProps, WrappedFieldProps {}
export interface UITextFieldState {};
class UITextField extends React.Component<P> {
    defaultProps={required:false}
    public render(): JSX.Element {
        return (
            <TextField label={this.props.label} required={this.props.required} underlined {...this.props.input} {...this.props.meta} defaultValue=""  validateOnLoad={false} validateOnFocusIn={false} validateOnFocusOut={true} onGetErrorMessage={this.setErrorMessage}   />
        );
    }
    @autobind
    setErrorMessage(value):string
    {
        return value.length > 0 ? "" : this.props.errorMessage;
    }
    
}

export default UITextField;
