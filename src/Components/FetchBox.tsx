import * as React from 'react';
import { connect } from 'react-redux';
import {
    Spinner,
    SpinnerSize
} from 'office-ui-fabric-react/lib/Spinner';
export interface FetchBoxProps {    
    message?:string;
};
export interface FetchBoxState {};
export default class FetchBox extends React.Component<FetchBoxProps> {
    static defaultProps = {message:"Please wait while content loads..."}
    constructor(props)
    {
        super(props);        
    }
    public render(): JSX.Element {        
        return (<div style={{margin:"40px"}}>
                <Spinner size={SpinnerSize.large} label={this.props.message} ariaLive='assertive' />
                </div>);
    }    
}
