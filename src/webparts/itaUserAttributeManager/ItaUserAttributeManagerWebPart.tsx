import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './ItaUserAttributeManagerWebPart.module.scss';
import * as strings from 'ItaUserAttributeManagerWebPartStrings';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './../../Store';
import MainComponent from './../../Components/MainComponent';
import { getCurrentContext } from '../../reducers/context';
import { SPUser } from '@microsoft/sp-page-context';
import { getLoggedInUser } from '../../Actions';
import { ITabs } from '../../reducers/currentTab';
import { isfetching } from './../../Actions';
import FetchBox from '../../Components/FetchBox';

export interface IItaUserAttributeManagerWebPartProps {
  description: string;
}

export default class ItaUserAttributeManagerWebPart extends BaseClientSideWebPart<IItaUserAttributeManagerWebPartProps> {
  public render(): void {
    var storeState:any = store.getState();
    var fetchStatus = storeState.isfetching;
    const element = <Provider store={store}>
    <div>      
      <MainComponent className={styles.maincomponent}/>
    </div>
  </Provider>;
  ReactDOM.render(element, this.domElement);
  }
  protected async onInit(): Promise<void> {
    console.log("Current Store : " , store.getState());
    (window as any).spfxContext = this.context;  //redux dev tools is crashing when adding context to state - too big JSON to handle
    (window as any).loggedInUser = this.context.pageContext.user;
    store.dispatch(isfetching(true));
    await store.dispatch(getLoggedInUser()).then(()=>{
      console.log("Got Logged In User ..... ");
      store.dispatch({type:ITabs.userTab,data:""});
      store.dispatch(isfetching(false));
    }) 
    return super.onInit();
  }  
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }  
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}