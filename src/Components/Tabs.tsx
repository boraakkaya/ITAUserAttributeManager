import * as React from 'react';
import { connect } from 'react-redux';
import styles from '../webparts/itaUserAttributeManager/ItaUserAttributeManagerWebPart.module.scss';
import {ITabs} from './../reducers/currentTab';
import store from '../Store';
interface TabsProps {
    currentTab:string;
};

interface TabsState {};

class Tabs extends React.Component<TabsProps, TabsState> {
    public render(): JSX.Element {        
        return (<div className={styles.tabs}>
            <div 
            onClick={()=>{store.dispatch({type:ITabs.userTab,data:""})}} 
            className={`${styles.tab} ${this.props.currentTab==ITabs.userTab ? styles.active:""}`}>My Profile</div>
            <div
            onClick={()=>{store.dispatch({type:ITabs.managerTab,data:""})}} 
            className={`${styles.tab} ${this.props.currentTab==ITabs.managerTab ? styles.active:""}`}>Manage Direct Reports</div>
        </div>);
    }
}
//{styles.tab && this.props.currentTab==ITabs.userTab ? styles.active:""}
const mapStateToProps = (state, ownProps) => {
    return {
        currentTab: state.currentTab
    }
}
export default connect(mapStateToProps)(Tabs);
