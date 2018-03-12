import {Environment,EnvironmentType} from '@microsoft/sp-core-library';
import { IUserProfile } from './../Interfaces/IUserProfile';
import { mockUsers } from './../Data/Mock';
import store from '../Store';
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
//To Do get User Profiles using Graph API
async function getLoggedInUserAsync():Promise<IUserProfile>
{    
    var result:IUserProfile|any = {};
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    await sleep(2000).then(()=>{
        result =  mockUsers[2]
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
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    await sleep(1000).then(()=>{
        var mockedUserArray = mockUsers.filter((val:IUserProfile,index)=>{
            return val.emailAddress == userEmail ? true:false
        });
        var mockedUser = mockedUserArray[0];
        result =  mockedUser;
    })    
    return result;
}

export function isfetching(status)
{
   return status == true ? {type:"FETCH",data:true} : {type:"FETCH",data:false}
}
