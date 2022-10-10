import {combineReducers} from 'redux'
import departmentReducer from './department.reducer'
import employeeReducer from './employee.reducer'


export default combineReducers({
    departmentReducer,
    employeeReducer
})