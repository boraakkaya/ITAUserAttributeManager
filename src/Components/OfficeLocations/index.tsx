import * as React from 'react';
import { connect } from 'react-redux';
import {OfficeLocations as locations} from './../../Data/OfficeLocations';
import Modal from 'office-ui-fabric-react/lib/Modal';
import { Button, autobind } from 'office-ui-fabric-react';
import styles from '../../webparts/itaUserAttributeManager/ItaUserAttributeManagerWebPart.module.scss';
import { ILocation } from '../../Interfaces/ILocation';
export interface OfficeLocationsProps {
    input:{value:string};
    label:string;
    handleChange:(val)=>any;
};
export interface OfficeLocationsState {
    locationsModal : {
        active:boolean,
        countrySelected:string,
        stateSelected:string,
        citySelected:string,
        addressSelected:string
    },
    defaultAddress:string
};

class OfficeLocations extends React.Component<OfficeLocationsProps, OfficeLocationsState> {
    
    constructor(props)
    {
        super(props);
        
        this.state= { defaultAddress:"", locationsModal:{active:false,countrySelected:"",citySelected:"",stateSelected:"",addressSelected:""}};
        
    }    
    componentWillReceiveProps(nextProps,nextCtx)
    {        
        this.getDefaultAddressById(nextProps.input.value);
    }
    public render(): JSX.Element {
        
        return (<div>
            <br/>
            <input type="text" value={this.props.input.value} readOnly style={{display:"none"}} />
            <div style={{borderBottom:"1px solid #a6a6a6", cursor:"pointer"}} onClick={()=>{this.openLocationsModal()}} >
            <div style={{display:"inline-block",marginRight:"10px",marginLeft:"12px", verticalAlign:"top"}}>{this.props.label} </div>
            <div style={{display:"inline-block",lineHeight:"36px"}}>{this.state.defaultAddress}</div>
            </div>
            <Modal
          isOpen={ this.state.locationsModal.active }
          onDismiss={ this.closeLocationsModal }
          isBlocking={ false }
          containerClassName="modalcontainer"
        >
          <div className="modalheader">
            <span>Please Select {this.state.locationsModal.countrySelected == "" ? "Country" : this.state.locationsModal.stateSelected == "" ? "State" : this.state.locationsModal.citySelected == "" ? "City" : "Address" }</span>
          </div>
          <div className="modalbody">
           
            <br/>
            {
                this.state.locationsModal.countrySelected == "" && <div>
                    {this.listCountries()}

            </div>
            }
            {
               this.state.locationsModal.countrySelected != "" && this.state.locationsModal.stateSelected == "" && <div>
                    {this.listStates(this.state.locationsModal.countrySelected)}

            </div>
            }
            {
               this.state.locationsModal.stateSelected != "" && this.state.locationsModal.citySelected == "" && <div>
                    {this.listCities(this.state.locationsModal.countrySelected,this.state.locationsModal.stateSelected)}

            </div>
            }
            {
               this.state.locationsModal.citySelected != "" && this.state.locationsModal.addressSelected == "" && <div>
                    {this.listAdresses(this.state.locationsModal.countrySelected,this.state.locationsModal.stateSelected,this.state.locationsModal.citySelected)}

            </div>
            }            
                <Button className="closebutton" text="X" onClick={(e)=>{this.closeLocationsModal()}} />  
          </div>
        </Modal>
        </div>);
    }
    @autobind
    closeLocationsModal()
    {
        this.setState({locationsModal:{...this.state.locationsModal,active:false}});
    }
    @autobind
    openLocationsModal()
    {
        this.setState({locationsModal:{active:true,countrySelected:"",citySelected:"",stateSelected:"",addressSelected:""}});
    }
    @autobind
    getDefaultAddressById(locationID)
    {
        var filteredLocation =  locations.filter((value,index)=>{
            return value.id == locationID
        });
        var address =  filteredLocation[0].address + " " + filteredLocation[0].city + " " + filteredLocation[0].state + " " + filteredLocation[0].zipCode + " " + filteredLocation[0].country;
        this.setState({defaultAddress:address});
    }
    @autobind
    listCountries()
    {
        let unique = this.removeDuplicates(locations,"country");
        return (<div>
        {unique.map((location,index)=>{
            return <div key={index} className="modalitem" onClick={()=>{this.setState({locationsModal:{...this.state.locationsModal,countrySelected:location.country}})}} >{location.country}</div>;
        })}        
        </div>);
    }
    @autobind
    listStates(country)
    {
        let filtered = locations.filter((location,index)=>{
            return location.country == country;
        })
        let unique = this.removeDuplicates(filtered,"state");
        return (<div>
            {unique.map((location,index)=>{
                return <div key={index} className="modalitem" onClick={()=>{this.setState({locationsModal:{...this.state.locationsModal,stateSelected:location.state}})}} >{location.state}</div>;
            })}
            <Button text="BACK" onClick={()=>{this.setState({locationsModal:{active:true,countrySelected:"",citySelected:"",stateSelected:"",addressSelected:""}})}} />
            </div>);
    } 
    @autobind
    listCities(country,state)
    {
        let filtered = locations.filter((location,index)=>{
            return location.country == country && location.state == state
        })
        let unique = this.removeDuplicates(filtered,"city");
        return (<div>
            {unique.map((location,index)=>{
                return <div key={index} className="modalitem" onClick={()=>{this.setState({locationsModal:{...this.state.locationsModal,citySelected:location.city}})}} >{location.city}</div>;
            })}
            <Button text="BACK" onClick={()=>{this.setState({locationsModal:{active:true,countrySelected:this.state.locationsModal.countrySelected,citySelected:"",stateSelected:"",addressSelected:""}})}} />

            </div>);
    }   
    @autobind
    listAdresses(country,state,city)
    {
        let filtered = locations.filter((location,index)=>{
            return location.country == country && location.state == state && location.city == city
        });        
        return (<div>
            {filtered.map((location,index)=>{
                return <div key={index} className="modalitem" onClick={()=>{this.updateOfficeAddress(location)}} >{location.address}</div>;
            })}
            <Button text="BACK" onClick={()=>{this.setState({locationsModal:{active:true,countrySelected:this.state.locationsModal.countrySelected,citySelected:"",stateSelected:this.state.locationsModal.stateSelected,addressSelected:""}})}} />

            </div>);
    }
    @autobind
    updateOfficeAddress(location:ILocation)
    {
        //this.dataInput.value = location.id.toString();
        this.props.handleChange(location.id);
        var updatedAddress = this.getDefaultAddressById(location.id);
        this.setState({locationsModal:{active:false,countrySelected:"",stateSelected:"",citySelected:"",addressSelected:""}});
    }
    removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }


}
export default OfficeLocations;


