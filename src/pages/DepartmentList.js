import { filter } from 'lodash';
import * as Yup from 'yup';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TextField,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TableHead,
} from '@mui/material';
import { FormProvider, RHFTextField, RHFCheckbox } from '../components/hook-form';
import uuid from 'react-uuid'
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import {addDepartment, deleteDepartment, getDepartmentList} from '../action/department.action'

// ----------------------------------------------------------------------

const style ={
  Color : "red"
}

const TABLE_HEAD = [
  { id: 'firstName', label: 'First Name', alignRight: false },
  { id: 'lastName', label: 'Last Name', alignRight: false },
  { id: 'dob', label: 'DOB', alignRight: false },
  { id: 'employeeSalary', label: 'Employee Salary', alignRight: false },
  { id: 'department', label: 'Department', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

function DepartmentList() {
  const [page, setPage] = useState(0);

  const dispatch = useDispatch()
  const {departmentListData} = useSelector(state => state.departmentReducer)

  const defaultValues = {
    departmentName: '',
    departmentDetail: '',
  };

  const [departmentList, setDepartmentList] = useState([defaultValues])

  const departmentSchema = Yup.object().shape({
    departmentName: Yup.string().required('Department Name is required'),
    departmentDetail: Yup.string().required('Department Detail is required'),
  });

  const methods = useForm({
    resolver: yupResolver(departmentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  
  const onHandleAdd = (data) => {
    let dmpData = {...data, id: uuid()}
    const idx = departmentList.length > 0 ? departmentList.length - 1 : 0
    const obj = {
      departmentName: "",
      departmentDetail: ""
    }
    reset({
      departmentName: "",
      departmentDetail:""
    })
    if(data) {
      dispatch(addDepartment(dmpData))
      departmentList[idx].departmentName = data.departmentName
      departmentList[idx].departmentDetail = data.departmentDetail
      setDepartmentList([...departmentList, obj])
    }
  }

  const onHandleDelete = (id) => {
    if(id) {
      const remove = departmentList.filter(a => a.id !== id)
      setDepartmentList(remove)
      dispatch(deleteDepartment({id}))
    }
  }


  useEffect(() => {
    let obj = {
      departmentName: "",
      departmentDetail: ""
    }
    if(departmentListData && departmentListData.length == 0) {
      setDepartmentList([obj])
    } else {
      setDepartmentList([...departmentListData, obj])
    }
  },[departmentListData])

  useEffect(() => {
    let depList = JSON.parse(window.localStorage.getItem('departmentList'))
    if(depList){
      dispatch(getDepartmentList(depList))
    }
  }, [window.localStorage.getItem('departmentList')])

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Department List
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Add
          </Button> */}
        </Stack>

        <Card>
          <Scrollbar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Department Name</TableCell>
                    <TableCell>Department Detail</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departmentList.length > 0 && departmentList.map((d, idx) => {
                    return(
                      <TableRow key={idx}>
                        {d.departmentName && d.departmentDetail ? (<>
                          <TableCell>{d.departmentName}</TableCell>
                          <TableCell>{d.departmentDetail}</TableCell>
                        </>): (<>
                          <TableCell>
                            <TextField name="departmentName" type='text' {...register("departmentName")} />
                            {errors.departmentName && <p style={style}>{errors.departmentName.message}</p>}
                          </TableCell>
                          <TableCell>
                            <TextField name="departmentDetail" type='text' {...register("departmentDetail")} />
                            {errors.departmentDetail && <p style={style}>{errors.departmentDetail.message}</p>}
                          </TableCell>
                        </>)}
                        <TableCell>
                          <Button type="button" loading={isSubmitting} onClick={handleSubmit(onHandleAdd)}>Add</Button>
                          <Button type="button" onClick={() => onHandleDelete(d.id)}>Delete</Button>
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
export default DepartmentList;