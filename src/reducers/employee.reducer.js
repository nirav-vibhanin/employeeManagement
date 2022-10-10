import {
    EMPLOYEE_LIST,
    DELETE_EMPLOYEE,
    UPDATE_EMPLOYEE,
    ADD_EMPLOYEE
} from '../action/reducer.types'
      
      export default function (state = {employeeListData:[]}, action) {
        switch (action.type) {
          case EMPLOYEE_LIST:
            return {
              ...state,
              employeeListData: action.payload
            }
          case ADD_EMPLOYEE:
            state.employeeListData.push(action.payload)
            window.localStorage.setItem('employeeList', JSON.stringify(state.employeeListData))
            return {
              ...state,
              employeeListData: state.employeeListData
            }
          case DELETE_EMPLOYEE:
            let remove = state.employeeListData.filter(a => a.id !== action.payload.id)
            window.localStorage.setItem('employeeList', JSON.stringify(remove))
            return {
              ...state,
              employeeListData: remove
            }
          case UPDATE_EMPLOYEE:
            let array = []
            state.employeeListData.map((c, i) => {
                if(c.id == action.payload.id) {
                  array.push(action.payload)
                } else {
                  array.push(c)
                }
                return array
            })
            window.localStorage.setItem('employeeList', JSON.stringify(array))
            return {
              ...state,
              employeeListData: array
            }
          default:
            return state
        }
      }
      