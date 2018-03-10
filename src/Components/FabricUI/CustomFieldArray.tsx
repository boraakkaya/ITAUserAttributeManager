import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import styles from '../../webparts/itaUserAttributeManager/ItaUserAttributeManagerWebPart.module.scss';
export interface CustomFieldArrayProps {
    fields:any;
    meta:any;
    title:string;
};

export interface CustomFieldArrayState {};
const deleteIcon = require('./../../Assets/delete.png');
class CustomFieldArray extends React.Component<CustomFieldArrayProps & WrappedFieldProps, CustomFieldArrayState> {
    public render(): JSX.Element {
        
        return (<div>            
            {this.props.fields.map((item,index)=>{                
                return <div key={index} className={styles.custominput}><Field name={item} component="input" type="text" />
                <img width="25px" src={deleteIcon} onClick={() => this.props.fields.remove(index)} />
                </div>
            })}
            <div>
            <div className={styles.addnewitem} onClick={() => this.props.fields.push()}>Add New</div>
            </div>
        </div>);
    }
}
export default CustomFieldArray;
