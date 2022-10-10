import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';

import EmployeeList from './pages/employeeList';
import NotFound from './pages/Page404';
import DepartmentList from './pages/DepartmentList';
import AddNewEmployee from './sections/auth/employee/AddEmployee';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'employee', element: <EmployeeList /> },
        { path: 'department', element: <DepartmentList /> },
        { path: 'addEmployee', element: <AddNewEmployee /> },
      ],
    },
    {
      path: '/',
      children: [
        { path: '/', element: <Navigate to="/dashboard/employee" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
