import * as React from 'react';
import { DatePicker } from 'office-ui-fabric-react';

export interface CustomDatePickerProps {
    input:{value:any};
    onSelectDate:(e)=>{};
    label:string;
    
};

export interface CustomDatePickerState {};

class CustomDatePicker extends React.Component<CustomDatePickerProps, CustomDatePickerState> {
    public render(): JSX.Element {
        return (<div>
            <DatePicker label={this.props.label}  value={new Date(this.props.input.value)} onSelectDate={(e)=>{this.props.onSelectDate(e)}} />
        </div>);
    }
}

export default CustomDatePicker;
