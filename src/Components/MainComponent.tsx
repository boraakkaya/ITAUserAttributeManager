import * as React from 'react';
import { connect } from 'react-redux';
import Tabs from './Tabs';
import styles from '../webparts/itaUserAttributeManager/ItaUserAttributeManagerWebPart.module.scss';
import Forms from './Forms';
import FetchBox from './..//Components/FetchBox';

interface MainComponentProps {
    isfetching:boolean;
}
interface MainComponentState {}
class MainComponent extends React.Component<MainComponentProps, MainComponentState> {
    public render(): JSX.Element {
        return (<div className={styles.maincomponent}>        
        <Tabs/>
        <Forms />
        </div>);
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        isfetching: state.isfetching
    }
}
export default connect(mapStateToProps)(MainComponent);
