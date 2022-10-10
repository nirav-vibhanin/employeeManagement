import {
    DEPARTMENT_LIST,
    DEPARTMENT_ADD,
    DELETE_DEPARTMENT
} from '../action/reducer.types'
      
    export default function (state = {departmentListData:[]}, action) {
        switch (action.type) {
        case DEPARTMENT_LIST:
            return {
            ...state,
            departmentListData: action.payload
            }
        case DEPARTMENT_ADD:
            state.departmentListData.push(action.payload)
            window.localStorage.setItem('departmentList', JSON.stringify(state.departmentListData))
            return {
                ...state,
                departmentListData: state.departmentListData
            }
        case DELETE_DEPARTMENT:
            const remove = state.departmentListData.filter(a => a.id !== action.payload.id)
            window.localStorage.setItem('departmentList', JSON.stringify(remove))
            return {
                ...state,
                departmentListData: remove
            }
        default:
            return state
        }
    }
      