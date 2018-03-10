import * as React from 'react';
import { connect } from 'react-redux';
import { Dropdown, TextField, ChoiceGroup, autobind } from 'office-ui-fabric-react';
export interface AutoCompleteProps {    
    /**Default value to display on the textbox */
    defaultValue? : string,
    /**String array that will be used as datasource for auto complete */
    autoCompleteArray: string[],
    /**Call back returning selected or typed value of the textbox. */
    handleChange : (e)=> void
};
export interface AutoCompleteState {
    selectedValue : string,
    searchKeyword : string,
    filteredItems : Array<string>
}
export default class AutoComplete extends React.Component<AutoCompleteProps, AutoCompleteState> {
    txtBOX;
    defaultProps = 
    {
        defaultValue :""
    }
    constructor(props)
    {
        super(props);        
        this.state = {filteredItems:[],searchKeyword:"", selectedValue:this.props.defaultValue}
    }        
    public render(): JSX.Element {        
        return (<div>                        
            <input type="text"
            placeholder="Start typing for suggestions"
            onChange={(e)=>{this.handleTxtBoxChange(e)}}
            onKeyPress = {(e)=>{this.handleKeyPress(e)}}
            value = {this.state.selectedValue}
            ref={(txtbox)=>{this.txtBOX = txtbox}}
            />
            {
                this.state.filteredItems.length > 0 && this.state.searchKeyword != "" &&
            <div><div>
            <div style={{border:'1px solid #ccc', padding:'3px'}} tabIndex={-100}>
                {this.state.filteredItems.map((item,index)=>{
                    return <div style={{backgroundColor:'#fff'}} onMouseOver={(e)=>{e.currentTarget.attributes.getNamedItem('style').nodeValue='background-color:#ddd'}}
                    onMouseOut={(e)=>{e.currentTarget.attributes.getNamedItem('style').nodeValue='background-color:#fff'}}
                     key={index} onKeyPress={(e)=>{if(e.charCode==13){
                        this.setTextBoxValue(item);
                     }}}  onClick={()=>{this.setTextBoxValue(item)}} tabIndex={0}>{item}</div>
                })}   
            </div></div></div>
            }            
        </div>);
    }
    @autobind
    setTextBoxValue(val)
    {    
        this.setState({selectedValue:"",searchKeyword:"",filteredItems:[]});
        this.txtBOX.focus();
        this.props.handleChange(val);
    }
    @autobind
    handleTxtBoxChange(e)
    {   
        if(e.currentTarget.value.length > 2)
        {     
        let _filtered = this.props.autoCompleteArray.filter((item,index)=>{            
            if(item.toLowerCase().indexOf(e.currentTarget.value.toLowerCase())!= -1)
            {
                return true;
            }
        });        
        this.setState({selectedValue:e.currentTarget.value,searchKeyword:e.currentTarget.value,filteredItems:_filtered});
        }
        else
        {
            this.setState({selectedValue:e.currentTarget.value,searchKeyword:e.currentTarget.value,filteredItems:[]});
        }
    }
    @autobind
    handleKeyPress(e)
    {
        if(e.charCode == 13 && e.currentTarget.value!= "")
        {
            this.setTextBoxValue(e.currentTarget.value);
        }
    }
}