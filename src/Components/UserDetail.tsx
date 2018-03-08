import * as React from 'react';
import { connect } from 'react-redux';
import { IUserProfile } from '../Interfaces/IUserProfile';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import styles from '../webparts/itaUserAttributeManager/ItaUserAttributeManagerWebPart.module.scss';
import { HttpClient, HttpClientConfiguration, SPHttpClient } from '@microsoft/sp-http';
interface UserDetailProps {
    user:IUserProfile;    
};
interface UserDetailState {
    userPictureURL:string;
};
class UserDetail extends React.Component<UserDetailProps, UserDetailState> {
    ctx:IWebPartContext = (window as any).spfxContext;
    constructor(props)
    {
        super(props);
        this.state = {userPictureURL : ""}
        this.getUserPictureURL(props);
    }
    async getUserPictureURL(props)
    {
        var pictureURL = `${this.ctx.pageContext.site.absoluteUrl}/_layouts/15/userphoto.aspx?size=L&username=${props.user.emailAddress}`;
        await this.ctx.spHttpClient.get(pictureURL,SPHttpClient.configurations.v1).then((data)=>{
            //console.log("Data is ", data);                        
            if(data.status == 200)
            {
                this.setState({userPictureURL:pictureURL})
            }            
        })
    }    
    //${this.ctx.pageContext.site.absoluteUrl}_layouts/15/userphoto.aspx?size=L&username=${this.props.user.emailAddress}
    public render(): JSX.Element {        
        return (<div className={styles.userdetail}>
            <div className={styles.userpicture} style={{backgroundImage:`url('${this.state.userPictureURL}')`}}>
            </div>
            <div>
            <span className={styles.userheader}>
            {this.props.user.firstName} {this.props.user.middleName} {this.props.user.lastName}
            </span>
            <br/>
            {this.props.user.emailAddress}
            <br/>
            {this.props.user.workPhone}
            <br/>
            {this.props.user.officeState},{this.props.user.officeCountry}
            </div>
            </div>);
    }
}
export default connect()(UserDetail);
