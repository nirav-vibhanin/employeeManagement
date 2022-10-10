import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import moment from 'moment';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Select,
  MenuItem,
  TableHead,
  TextField,
  InputAdornment
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import { useDispatch, useSelector } from 'react-redux';
import {updateEmployee, deleteEmployee, getEmployeeList} from '../action/employee.action'

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const style ={
  color : "red"
}

function EmployeeList() {
  const dispatch = useDispatch()
  const {employeeListData} = useSelector(state => state.employeeReducer)
  const {departmentListData} = useSelector(state => state.departmentReducer)
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editEmployee, setEditEmployee] = useState()
  const [selected, setSelected] = useState()
  const [options, setOptions] = useState([])
  const navigate = useNavigate()

  const defaultValues = {
    employeefirstName: '',
    employeelastName: '',
    dob:'',
    employeeSalary:'',
    department:''
  };

  const [employeeList, setEmployeeList] = useState([])

  const employeeSchema = Yup.object().shape({
    employeefirstName: Yup.string().required('Employee First name required'),
    employeelastName: Yup.string().required('Employee Last name required'),
    dob: Yup.string().required('DOB is required'),
    employeeSalary: Yup.number().required('Employee Salary is required'),
    department: Yup.string().required('Department Salary is required'),
  });

  const methods = useForm({
    resolver: yupResolver(employeeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;


  const onClickToEdit = (data) => {
    if(data) {
      reset(data)
      setEditEmployee(data)
    }
  }

  const onHandleUpdate = async (data) => {
     if(data) {
      let empData = {...data, id: editEmployee.id}
      let emp = employeeList.filter(a => a.id == empData.id)
      if(emp.length > 0) {
        await dispatch(updateEmployee(empData))
        setEditEmployee()
        reset()
     } else {
       setError()
     }
  }
 }

  const onHandleDelete = (id) => {
    if(id) {
      dispatch(deleteEmployee({id}))
    }
  }
  useEffect(() => {
    if(departmentListData && departmentListData.length > 0) {
      let array = []
      departmentListData.map((a,i) => {
        let obj = {value: a.departmentName, label: a.departmentName}
        array.push(obj)
      })
      setOptions(array)
    }
  }, [departmentListData])

  useEffect(() => {
    let empList = JSON.parse(window.localStorage.getItem('employeeList'))
    if(empList){
      dispatch(getEmployeeList(empList))
    }
  }, [window.localStorage.getItem('employeeList')])

  useEffect(() => {
    if(employeeListData) {
      setEmployeeList(employeeListData)
    }
  }, [employeeListData])


  const onHandleSearchInput = useDebouncedCallback(async (q) => {
    let filterData = employeeListData.filter(r => r.employeefirstName.includes(q) || r.employeelastName.includes(q))
    setEmployeeList(filterData)
  }, 500);

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <TextField
          placeholder="Search post..."
          onChange={(e) => {
            onHandleSearchInput(e.target.value)
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
          <Typography variant="h4" gutterBottom>
            Employee List
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => navigate("/dashboard/addEmployee")}
          >
            Add New Employee
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Date of Birth</TableCell>
                    <TableCell>Employee Salary</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeList.length > 0 && employeeList.map((e, idx) => {
                    return(
                      <TableRow key={idx}>
                        {!(e.employeefirstName == editEmployee?.employeefirstName) ? (<>
                          <TableCell>{e.employeefirstName}</TableCell>
                          <TableCell>{e.employeelastName}</TableCell>
                          <TableCell>{e.dob}</TableCell>
                          <TableCell>{e.employeeSalary}</TableCell>
                          <TableCell>{e.department}</TableCell>
                        </>) : (<>
                          <TableCell>
                            <TextField name="employeefirstName" type='text' {...register("employeefirstName")} 
                            />
                            {errors.employeefirstName && <p style={style}>{errors.employeefirstName.message}</p>}
                          </TableCell>
                          <TableCell>
                            <TextField name="employeelastName" type='text' {...register("employeelastName")} />
                            {errors.employeelastName && <p style={style}>{errors.employeelastName.message}</p>}
                          </TableCell>
                          <TableCell>
                            <TextField name="dob" type='text' {...register("dob")} />
                            {errors.dob && <p style={style}>{errors.dob.message}</p>}
                          </TableCell>
                          <TableCell>
                            <TextField name="employeeSalary" type='text' {...register("employeeSalary")} />
                            {errors.employeeSalary && <p style={style}>{errors.employeeSalary.message}</p>}
                          </TableCell>
                          <TableCell>
                          <Select
                              name="department"
                              selected={selected}
                              defaultValue={e.department}
                              // {...register("department")}
                              placeholder="Select Department..."
                              label="Department"
                              onChange={(a) => {
                                setValue('department', a.target.value)
                                setSelected(a.target.value)
                              }}
                            >
                              {options.map(e => {
                                return(
                                  <MenuItem value={e.value}>{e.label}</MenuItem>
                                )
                              })}
                            </Select>
                            {errors.department && <p style={style}>{errors.department.message}</p>}
                          </TableCell>
                        </>)}
                        <TableCell>
                          {editEmployee ? <Button type="button" onClick={handleSubmit(onHandleUpdate)}>update</Button> 
                          : <Button type="button" onClick={() =>onClickToEdit(e)}>Edit</Button>}
                          <Button type="button" onClick={() => onHandleDelete(e.id)}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
          </Scrollbar>

        </Card>
      </Container>
    </Page>
  );
}


export default EmployeeList;
