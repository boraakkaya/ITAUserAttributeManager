import * as React from 'react';
import styles from './pickerstyles.module.scss';
import { ITerms, ISuggestedTerms } from '../../Interfaces/ITermStore';
import Modal from 'office-ui-fabric-react/lib/Modal';
import { autobind, Button } from 'office-ui-fabric-react';
export interface DepartmentPickerProps {
    label:string;
    termSource:ITerms;
    defaultSelectedTerms?:Array<ITerms>;    
};
export interface DepartmentPickerState {
    modalActive:boolean;
    selectedTerms:Array<ITerms>;
    currentSelection?:ITerms | undefined;
};
export class DepartmentPicker extends React.Component<DepartmentPickerProps, DepartmentPickerState> {
    static defaultProps = {defaultSelectedTerms:[]}
    public constructor(props)
    {
        super(props);
        console.log("xyzConstructor", this.props);
        this.state = {modalActive:false, selectedTerms:this.props.defaultSelectedTerms, currentSelection:undefined}
    }
    componentDidMount()
    {
        console.log("xyzMounted.....");
    }
    handleOnTermSelect(term:ITerms)
    {
        this.setState({currentSelection:term});
    }
    @autobind
    pushSelectedTerm()
    {
        if(this.state.currentSelection != undefined)
        {
        var nextState = this.state.selectedTerms;
        nextState.push(this.state.currentSelection);
        this.setState({selectedTerms:nextState});
        this.setState({currentSelection:undefined});
        }
    }
    public render(): JSX.Element {
        return (<div className={styles.wrapper}>
        <Modal
          isOpen={ this.state.modalActive }
          onDismiss={ this._closeModal }
          isBlocking={ false }
          containerClassName="pickermodalcontainer"
        >
          <div className="pickermodalheader">
            <span>Select {this.props.label}</span>
          </div>
          <div className="pickermodalbody">
                <div className="termtree">
                    <div className="treeNodeDiv">
                        <div className="parentNode">
                            {/* <img src="https://itadev.sharepoint.com/_layouts/15/images/MDNExpanded.png"/> */} 
                            <img src="https://itadev.sharepoint.com/_layouts/15/Images/EMMTermSet.png" width="16" />
                            {this.props.label}
                            {this.props.termSource.Terms && this.props.termSource.Terms.map((term:ITerms,index)=>{
                                return <Term term={term} key={term.Id} onSelect={(term:ITerms)=>{ console.log("Selected Term ",term);this.handleOnTermSelect(term)}}/>
                            })}
                        </div>
                    </div>
                </div>
                {/* Start Select Button and TextBox */}
                <div className="controlbar">
                    <Button text="Select >>" onClick={this.pushSelectedTerm} />
                    <TaxonomyTextBox selectedTerms={this.state.selectedTerms} onUpdateSelectedItems={(updatedArray)=>{this.setState({selectedTerms:updatedArray})}} termSource={this.props.termSource} />
                </div>

                 <Button className="closebutton" text="X" onClick={(e)=>{this._closeModal()}} />


          </div>
        </Modal>
            <div className={styles.label}>{this.props.label}</div>
            <div>
                <div className={styles.selections}>
                    <div className={styles.inputbox}>
                        <TaxonomyTextBox selectedTerms={this.state.selectedTerms}
                        onUpdateSelectedItems={(updatedArray)=>{
                            console.log("Getting New State : ", updatedArray);
                            this.setState({selectedTerms:updatedArray});

                            }} termSource={this.props.termSource} />
                        <img aria-hidden="true" src="https://spoprod-a.akamaihd.net/files/odsp-next-prod_2018-03-09-sts_20180314.001/odsp-media/images/taxonomy/taxonomycopyterm.png" alt="Select : Managed" onClick={this.displayTermPicker} />
                    </div>
                </div>                
            </div>
        </div>);
    }
    public _closeModal()
    {
        this.setState({modalActive:false});
    }
    @autobind
    displayTermPicker()
    {
        this.setState({modalActive:true});
    }

}
//export default DepartmentPicker;

export interface TermProps {
    term:ITerms;
    key:string;
    onSelect: (e:ITerms)=> any;
};

export interface TermState {
    expanded:boolean;
};
export class Term extends React.Component<TermProps, TermState> {
    constructor()
    {
        super();
        this.state= {expanded:false}
    }
    public render(): JSX.Element {
        const imgSrc= this.state.expanded ? "https://itadev.sharepoint.com/_layouts/15/images/MDNExpanded.png" : "https://itadev.sharepoint.com//_layouts/15/images/MDNCollapsed.png";
        return (<div className="termitem" key={this.props.key}>
            <div>
                <div style={{width:"18px", display:"inline-block"}}>{this.props.term.Terms && <img onClick={this.toggleChildren} src={imgSrc} />}</div>
                
                <img src="https://itadev.sharepoint.com/_layouts/15/Images/EMMTerm.png"/>
                <span tabIndex={-1} onClick={(e)=>{this.props.onSelect(this.props.term);e.currentTarget.focus();}} >{this.props.term.Name}</span>
                {this.props.term.Terms && this.props.term.Terms.map((term:ITerms,index)=>{
                    let parent = this;
                    return this.state.expanded &&  <Term term={term} key={term.Id} onSelect={(term:ITerms)=>{ console.log("Sub Term ",term); parent.props.onSelect(term)}} />
                })}
            
            </div>

        </div>);
    }
    @autobind
    toggleChildren()
    {
        this.setState({expanded: !this.state.expanded});
    }

}

export interface TaxonomyTextBoxProps {
    selectedTerms?:Array<ITerms>;
    onUpdateSelectedItems:(e:Array<ITerms>)=>any;
    termSource:ITerms;
};
export interface TaxonomyTextBoxState {
    suggestedTerms?:Array<ISuggestedTerms> | undefined;
};
export class TaxonomyTextBox extends React.Component<TaxonomyTextBoxProps, TaxonomyTextBoxState> {
    txtBox:HTMLInputElement;
    constructor(props)
    {
        super(props);
        this.state= {suggestedTerms:undefined};        
    }
    public render(): JSX.Element {
        console.log("xyzRender ",this.state)
        return (<div className={styles.taxonomytextbox}>

        <input type="text" onChange={(e)=>{this.handleTermSearch(e.currentTarget.value)}}
             /* onBlur={()=>{this.setState({suggestedTerms:undefined})}} */
             ref={(a)=>{this.txtBox = a}}
              />


            <span>
            {this.props.selectedTerms && this.props.selectedTerms.map((term:ITerms,index)=>{
                return <span className={styles.selectedterm}>{term.Name} <span  className={styles.removeterm} onClick={()=>{this.removeTerm(term)}} >X</span></span> 
            })}
            </span>
            


            {this.state.suggestedTerms && <Suggestions suggestions = {this.state.suggestedTerms} onSelect={(term:ITerms)=>{
                var updatedTerms = this.props.selectedTerms;
                updatedTerms.push(term);
                console.log("Updated Termssssssss ", updatedTerms);
                this.props.onUpdateSelectedItems(updatedTerms);
                this.txtBox.value ="";
                this.setState({suggestedTerms:undefined});                
            }}  /> }
        </div>);
    }
    @autobind
    handleTermSearch(val:string)
    {
        if(val.length > 0)
        {
        let suggestionsArray:Array<ISuggestedTerms> = [];
        (this.props.termSource.Terms as Array<ISuggestedTerms>).map((term,index)=>{
            suggestionsArray = suggestionsArray.concat(this.getMatchingChildTerms(val,term,[],this.props.termSource.Name));
        });        
        this.setState({suggestedTerms:suggestionsArray});
        }
        else
        {
            this.setState({suggestedTerms:undefined});
        }
    }

    @autobind
    getMatchingChildTerms(val:string,term:ISuggestedTerms, result:Array<ISuggestedTerms>,location)
    {
        if(term.Name.toLowerCase().indexOf(val.toLowerCase()) > -1)
        {
            term.location = location;
            result.push(term);
        }
        if(term.Terms != undefined && term.Terms.length > 0)
        {
            (term.Terms as Array<ISuggestedTerms>).map((a,index)=>{
                this.getMatchingChildTerms(val,a,result,location + " > " + term.Name);
            })
        }
        return result;
    }
    @autobind
    removeTerm(term)
    {
        var reducedArray:Array<ITerms>;        
        reducedArray = this.props.selectedTerms.filter((val,index)=>{
           return val != term;
       })
        //this.setState({selectedTerms : reducedArray});
        this.props.onUpdateSelectedItems(reducedArray);
    }
}


export interface SuggestionsProps {
    suggestions:Array<ISuggestedTerms>;
    onSelect: (e:ITerms)=>any;
};
export interface SuggestionsState {};

export class Suggestions extends React.Component<SuggestionsProps, SuggestionsState> {
    public render(): JSX.Element {
        return (<div className={styles.suggestions}>
            {this.props.suggestions.map((term:ISuggestedTerms)=>{
                return <div className={styles.suggestion} onClick={()=>{this.props.onSelect(term)}}>
                    <div className={styles.suggestionheading}>{term.Name}</div>
                    <div className={styles.suggestionlocation}>{term.location}</div>

                </div>
            })}
            </div>);
    }
}


