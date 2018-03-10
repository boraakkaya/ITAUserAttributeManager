import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import {TextField, ITextFieldProps} from 'office-ui-fabric-react/lib/TextField';
import { WrappedFieldProps } from 'redux-form';
import { IMailingAddress } from '../../Interfaces/IUserProfile';
import { autobind } from '@uifabric/utilities';
import styles from '../../webparts/itaUserAttributeManager/ItaUserAttributeManagerWebPart.module.scss';
export interface MailingAddressProps {
    input:{value:IMailingAddress,label:any}
    meta:{}
};
export interface MailingAddressState {};

class MailingAddress extends React.Component<MailingAddressProps & WrappedFieldProps, MailingAddressState> {
    public render(): JSX.Element {
        
        return (<div className={styles.mailingaddress}>            
            <TextField underlined label="Address Line 1" required defaultValue={this.props.input.value.addressLine1} onChanged={(e)=>{this.props.input.onChange({...this.props.input.value,addressLine1:e})}} onGetErrorMessage={this.setErrorMessage}  />
            <TextField underlined label="Address Line 2" defaultValue={this.props.input.value.addressLine2}  onChanged={(e)=>{this.props.input.onChange({...this.props.input.value,addressLine2:e})}}   />
            <TextField underlined label="City" required  defaultValue={this.props.input.value.city} onChanged={(e)=>{this.props.input.onChange({...this.props.input.value,city:e})}} onGetErrorMessage={this.setErrorMessage}  />
            <TextField underlined label="State" required defaultValue={this.props.input.value.state} onChanged={(e)=>{this.props.input.onChange({...this.props.input.value,state:e})}} onGetErrorMessage={this.setErrorMessage}  />
            <TextField underlined label="Zip Code" required defaultValue={this.props.input.value.zipCode} onChanged={(e)=>{this.props.input.onChange({...this.props.input.value,zipCode:e})}} onGetErrorMessage={this.setErrorMessage}  />
            <TextField underlined label="Country" required defaultValue={this.props.input.value.country} onChanged={(e)=>{this.props.input.onChange({...this.props.input.value,country:e})}} onGetErrorMessage={this.setErrorMessage}/>
        </div>);
    }
    @autobind
    setErrorMessage(value):string
    {
        return value.length > 0 ? "" : "Required!";
    }   
}

export default MailingAddress;
