import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from './Dashboard';
import Products from './Products';
import AdminOrders from './AdminOrders';
import Users from './Users';
import Content from './Content';
import System from './System';

const Admin = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<AdminOrders />} />
        <Route path="/users" element={<Users />} />
        <Route path="/content" element={<Content />} />
        <Route path="/system" element={<System />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;