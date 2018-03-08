import {Environment,EnvironmentType} from '@microsoft/sp-core-library';
import { IUserProfile } from '../../lib/Interfaces/IUserProfile';
import { mockUsers } from '../../lib/Data/Mock';
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
    await sleep(3000).then(()=>{
        result =  mockUsers[2]
    })    
    return result;
}
export function isfetching(status)
{
   return status == true ? {type:"FETCH",data:true} : {type:"FETCH",data:false}
}
