import {Environment,EnvironmentType} from '@microsoft/sp-core-library';
import { IUserProfile } from './../Interfaces/IUserProfile';
import { mockUsers } from './../Data/Mock';
import store from '../Store';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { HttpClient } from '@microsoft/sp-http';
import { ITAMockTermStore } from '../Data/MockTaxonomy';
import { IITATermStore } from '../Interfaces/ITermStore';
const mockedLoggedInUser = mockUsers[1];
export function getLoggedInUser()
{
    return async dispatch => 
    { 
          if(Environment.type == EnvironmentType.Local)
          {
              dispatch({type:"GETLOGGEDINUSER",data:mockedLoggedInUser})
          }
          if(Environment.type == EnvironmentType.SharePoint)
          {
              dispatch(isfetching(true));
              await getLoggedInUserAsync().then(async (data)=>{
                  console.log("Data is ", data);
                  await dispatch({type:"GETLOGGEDINUSER",data:data});
                  await dispatch(isfetching(false));
              })
          }     
    }; 
}

export function getTermStore()
{
    return async dispatch =>
    {
        if(Environment.type == EnvironmentType.Local)
          {
              dispatch({type:"GETTERMSTORE",data:ITAMockTermStore})
          }
          if(Environment.type == EnvironmentType.SharePoint)
          {
              dispatch(isfetching(true));
              await getTermStoreAsync().then(async (data)=>{
                  console.log("Data is ", data);
                  await dispatch({type:"GETTERMSTORE",data:data});
                  await dispatch(isfetching(false));
              })
          }   

    };
}
async function getTermStoreAsync():Promise<IITATermStore>
{
    var result:IITATermStore|any ={};
    var ctx:IWebPartContext = (window as any).spfxContext;
       await ctx.httpClient.get(`https://itauserprofilemanager.azurewebsites.net/api/GetTermStore`,HttpClient.configurations.v1,{}).then(async(response)=>{           
           await response.json().then(async(data)=>{
                await console.log("Term Store Result is ", data);
                result=data;
            })
        })
    return result;
}
//To Do get User Profiles using Graph API
async function getLoggedInUserAsync():Promise<IUserProfile>
{    
    var result:IUserProfile|any = {};
    var ctx:IWebPartContext = (window as any).spfxContext;
    var loggedInUserEmail = (window as any).loggedInUser.email;
    var account = "i:0#.f|membership|" + loggedInUserEmail; //has to be in form of i%3A0%23.f%7Cmembership%7Cbora%40itadev.onmicrosoft.com    
       await ctx.httpClient.get(`https://itauserprofilemanager.azurewebsites.net/api/GetUserProfile?account=${encodeURIComponent(account)}`,HttpClient.configurations.v1,{}).then(async(response)=>{           
           await response.json().then(async(data)=>{
                await console.log("Result is ", data);
                result=data;
            })
        })    
    return result;
}

export function getSelectedUser(userEmail)
{
    console.log(userEmail);
    return async dispatch =>{
        if(Environment.type == EnvironmentType.Local)
          {
              var mockedUserArray = mockUsers.filter((val:IUserProfile,index)=>{
                return val.emailAddress == userEmail ? true:false
            });
            var mockedUser = mockedUserArray[0];
            console.log("MOCKED USER ", mockedUser);
              dispatch({type:"GETSELECTEDUSER",data:mockedUser});
          }
          if(Environment.type == EnvironmentType.SharePoint)
          {
              dispatch(isfetching(true));
              await getSelectedUserAsync(userEmail).then(async (data)=>{
                  console.log("Data is ", data);
                  await dispatch({type:"GETSELECTEDUSER",data:data});
                  await dispatch(isfetching(false));
              })
          } 
    };
}
export function emptySelectedUser()
{
    store.dispatch({type:"GETSELECTEDUSER",data:{}});
}
export async function getSelectedUserAsync(userEmail):Promise<IUserProfile>
{
    var result:IUserProfile|any = {};
    var ctx:IWebPartContext = (window as any).spfxContext;    
    var account = "i:0#.f|membership|" + userEmail; //has to be in form of i%3A0%23.f%7Cmembership%7Cbora%40itadev.onmicrosoft.com    
       await ctx.httpClient.get(`https://itauserprofilemanager.azurewebsites.net/api/GetUserProfile?account=${encodeURIComponent(account)}`,HttpClient.configurations.v1,{}).then(async(response)=>{           
           await response.json().then(async(data)=>{
                await console.log("Result is ", data);
                result=data;
            })
        })    
    return result;
}

export async function updateUserProfileAsync(userEmail,data):Promise<any>
{
    console.log("Send data is : ",data);
    var result = {};
    var ctx:IWebPartContext = (window as any).spfxContext;    
    var account = "i:0#.f|membership|" + userEmail; //has to be in form of i%3A0%23.f%7Cmembership%7Cbora%40itadev.onmicrosoft.com    
       await ctx.httpClient.post(`https://itauserprofilemanager.azurewebsites.net/api/UpdateUserProfile?account=${encodeURIComponent(account)}`,HttpClient.configurations.v1,{
           body:JSON.stringify(data),
           headers: { 'Content-Type': 'application/json' },
       }).then(async(response)=>{
                   
           await response.json().then(async(responseData)=>{
                await console.log("responseData is ", responseData);
                result=responseData;
            })
        }).catch((error)=>{
            result = error;
        })    
    return result;
}

export function isfetching(status)
{
   return status == true ? {type:"FETCH",data:true} : {type:"FETCH",data:false}
}
