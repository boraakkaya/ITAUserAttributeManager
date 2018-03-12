import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import styles from '../../webparts/itaUserAttributeManager/ItaUserAttributeManagerWebPart.module.scss';
import { autobind } from '@uifabric/utilities';
export interface CustomFieldArray3Props {
    fields:any;
    meta:any;
    title:string;
};
import {Industries} from './../../Data/Industries';
export interface CustomFieldArray3State {};
const deleteIcon = require('./../../Assets/delete.png');
class CustomFieldArray3 extends React.Component<CustomFieldArray3Props & WrappedFieldProps, CustomFieldArray3State> {
    
    public render(): JSX.Element {           
        return (<div>            
            {this.props.fields.map((item,index)=>{                
                return <div key={index} className={styles.custominput}>
                <Field name={item} component={IndustryPicker} type="text" />                
                <img width="25px" src={deleteIcon} onClick={() => this.props.fields.remove(index)} />                
                </div>
            })}
            <div>
            <div className={styles.addnewitem} onClick={() => this.props.fields.push()}>Add New</div>
            </div>
        </div>);
    }
   
}

export interface IndustryPickerProps {
    input:any;
    meta:any;
};
export interface IndustryPickerState {
    suggestions:string[]
};
export class IndustryPicker extends React.Component<IndustryPickerProps, IndustryPickerState> {
    constructor()
    {
        super();
        console.log("In Constructor");
        this.state={suggestions:[]};
    }
    public render(): JSX.Element {
        return (<div style={{display:"inline"}}>
            <input type="text" onChange={(e)=>{this.updateSuggestions(e.currentTarget.value);this.props.input.onChange(e)}} defaultValue={this.props.input.value} value={this.props.input.value} />
            {this.state.suggestions.length > 0 && <div style={{maxHeight:"145px", overflow:"auto",border:"1px solid #ddd"}}>
                    {this.state.suggestions.map((term,index)=>{
                        return <div key={index} style={{cursor:"pointer",lineHeight:"30px"}}>
                           <div
                           style={{backgroundColor:"#fff"}} onMouseOver={(e)=>{e.currentTarget.attributes.getNamedItem('style').nodeValue='background-color:#ddd'}}
                           onMouseOut={(e)=>{e.currentTarget.attributes.getNamedItem('style').nodeValue='background-color:#fff'}}
                            key={index} onKeyPress={(e)=>{if(e.charCode==13){
                                this.props.input.onChange(term);
                               this.setState({suggestions:[]});
                            }}}  
                            tabIndex={0}
                           onClick={()=>{
                               this.props.input.onChange(term);
                               this.setState({suggestions:[]});
                           }}
                           >{term}</div>
                        </div>

                    })}
                </div>}

        </div>);
    }
    @autobind
    updateSuggestions(term:string)
    {
        console.log("On Update Suggestions")
        let suggestions = Industries.filter((industry,index)=>{
            return industry.toLowerCase().indexOf(term.toLowerCase())>-1 ? true : false;
        })
        this.setState({suggestions:suggestions});        
    }
}




export default CustomFieldArray3;
