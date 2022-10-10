// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'employeeList',
    path: '/dashboard/employee',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'departmentList',
    path: '/dashboard/department',
    icon: getIcon('eva:shopping-bag-fill'),
  }
];

export default navConfig;
