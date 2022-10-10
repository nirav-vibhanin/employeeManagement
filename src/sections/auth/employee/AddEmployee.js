import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFormik } from "formik";
// @mui
import { Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import {addEmployee} from '../../../action/employee.action'
import {getDepartmentList} from '../../../action/department.action'
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid';
import {
  Select,
  MenuItem
} from '@mui/material';


function AddNewEmployee() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const {employeeListData} = useSelector(state => state.employeeReducer)
  const {departmentListData} = useSelector(state => state.departmentReducer)
  const [showPassword, setShowPassword] = useState(false);
  const [options, setOption] = useState([])
  const [selected, setSelected] = useState()

  const employeeSchema = Yup.object().shape({
    employeefirstName: Yup.string().required('Employee First name required'),
    employeelastName: Yup.string().required('Employee Last name required'),
    dob: Yup.string().required('DOB is required'),
    employeeSalary: Yup.number().required('Employee Salary is required'),
    department: Yup.string().required('Department is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    dob: '',
    employeeSalary: '',
    department:''
  };

  const methods = useForm({
    resolver: yupResolver(employeeSchema),
    defaultValues,
  });

  const {
    setError,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  const test = () => {
    setValue('department', selected)
  }

  const onSubmit = async (data) => {
    if(data) {
      let empData = {...data, id: uuid()}
      const duplicate = employeeListData.filter(a => a.employeefirstName == data.employeefirstName)
      if(duplicate.length == 0) {
        await dispatch(addEmployee(empData))
        navigate('/dashboard/employee', { replace: true });
      } else {
        setError('employeefirstName', { type: 'custom', message: `${data.employeefirstName} name already exist` })
      }
    }
  };
  const inputClass = !selected && errors.department ? "MuiOutlinedInput-root MuiInputBase-root MuiInputBase-colorPrimary Mui-error MuiInputBase-fullWidth MuiInputBase-formControl css-6c8syq-MuiInputBase-root-MuiOutlinedInput-root"
  : "MuiOutlinedInput-root MuiInputBase-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-6c8syq-MuiInputBase-root-MuiOutlinedInput-root"
  useEffect(() => {
    if(departmentListData && departmentListData.length > 0) {
      let array = []
      departmentListData.map((a,i) => {
        let obj = {value: a.departmentName, label: a.departmentName}
        array.push(obj)
      })
      setOption(array)
    }
  }, [departmentListData])

  useEffect(() => {
    let depList = JSON.parse(window.localStorage.getItem('departmentList'))
    if(depList){
      dispatch(getDepartmentList(depList))
    }
  }, [window.localStorage.getItem('departmentList')])

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, test)}>
      <h1>Add Employee</h1>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="employeefirstName" label="Employee First name" />
          <RHFTextField name="employeelastName" label="Employee Last name" />
        </Stack>

        <RHFTextField name="dob"  label="DOB" type="date"/>

        <RHFTextField
          name="employeeSalary"
          label="Employee Salary"
          type="number"
        />
          <Select
            defaultValue={"Select Department"}
            className={inputClass}
            name="department"
            label="department"
            selected={selected}
            placeholder="Select Department..."
            label="Department"
            onChange={(a) => {
              setSelected(a.target.value)
              console.log('212121212', a.target.value)
              setValue('department', a.target.value)
            }}
          >
            {options.map(e => {
              return(
                <MenuItem value={e.value}>{e.label}</MenuItem>
              )
            })}
          </Select>
          {errors.department && !selected && <p style={{color: "#FF4842", fontSize: '12px'}}
          // class="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-16d5wub-MuiFormHelperText-root"
          >{errors.department.message}</p>}

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Submit
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

export default AddNewEmployee;
