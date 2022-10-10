import {
    DEPARTMENT_LIST,
    DELETE_DEPARTMENT,
    DEPARTMENT_ADD,
} from "./reducer.types"

export const addDepartment = (data) => ({
    type: DEPARTMENT_ADD,
    payload: data
})

export const deleteDepartment = (data) => ({
    type: DELETE_DEPARTMENT,
    payload: data
})

export const getDepartmentList = (data) => ({
    type: DEPARTMENT_LIST,
    payload: data
})