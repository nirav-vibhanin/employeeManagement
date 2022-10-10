import {
    EMPLOYEE_LIST,
    DELETE_EMPLOYEE,
    UPDATE_EMPLOYEE,
    ADD_EMPLOYEE,
} from './reducer.types';

export const addEmployee = (data) => ({
    type: ADD_EMPLOYEE,
    payload: data
})

export const updateEmployee = (data) => ({
    type: UPDATE_EMPLOYEE,
    payload: data
})

export const deleteEmployee = (data) => ({
    type: DELETE_EMPLOYEE,
    payload: data
})

export const getEmployeeList = (data) => ({
    type: EMPLOYEE_LIST,
    payload: data
})