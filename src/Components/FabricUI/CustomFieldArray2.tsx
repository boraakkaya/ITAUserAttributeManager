import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import styles from '../../webparts/itaUserAttributeManager/ItaUserAttributeManagerWebPart.module.scss';
import { connect } from 'react-redux';
import AutoComplete from './AutoComplete';
//import {countriesList} from './../../Data/Countries'
export interface CustomFieldArray2Props {
    fields:any;
    meta:any;
    title:string;
    values:string[];
    termStorecountries : [{Name:string, Id:string}]
};
export interface CustomFieldArray2State {};
const deleteIcon = require('./../../Assets/delete.png');
class CustomFieldArray2 extends React.Component<CustomFieldArray2Props & WrappedFieldProps, CustomFieldArray2State> {
    countriesList = [];
    constructor(prop)
    {
        super(prop);
        this.props.termStorecountries.map((country)=>{
            this.countriesList.push(country.Name);
        }); 
    }
    public render(): JSX.Element {        
        return (<div className={styles.customselectorWrapper}>
            <div className={styles.customtextselector}>
            {this.props.fields.map((item,index)=>{                
                return <div key={index}>
                <div>{this.props.values[index]} <div onClick={() => this.props.fields.remove(index)}>X</div></div>
                </div>
            })}
            {/* <div><input type="text" onKeyPress={(e)=>{
                if(e.charCode == 13 && e.currentTarget.value !="")
                {                
                console.log(e);
                console.log(e.currentTarget.value);
                console.log(e.charCode);
                this.props.fields.push(e.currentTarget.value);
                e.currentTarget.value ="";
                }
            }} /></div> */}
            </div>
            <AutoComplete autoCompleteArray={this.countriesList} handleChange={(val)=>{
                this.props.fields.push(val);                
            }} />
        </div>);
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        values: state.form.userForm.values.countrySpecialities,
        termStorecountries: state.itaTermStore.ITATermGroupList[0].TermSets[0].Terms


    }
}
export default connect(mapStateToProps)(CustomFieldArray2);

