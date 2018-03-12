import { Store,createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import {spContext} from './../reducers/context';
import { currentTab } from '../reducers/currentTab';
import { loggedInUser } from '../reducers/loggedInUser';
import { isfetching } from '../reducers/isfetching';
import {selectedUser} from '../reducers/selectedUser';
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const loggerMiddleware = createLogger();  //Remember to remove logger for production 
const reducers = combineReducers({
  form: reduxFormReducer,  
  currentTab : currentTab,
  loggedInUser:loggedInUser,
  isfetching:isfetching,
  selectedUser:selectedUser 
});
//const store =  createStore(reducers,composeWithDevTools({serialize:undefined})(applyMiddleware(thunkMiddleware,loggerMiddleware)));
const store =  createStore(reducers,{},composeEnhancers(applyMiddleware(thunkMiddleware,loggerMiddleware)));
export default store;