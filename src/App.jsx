import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/global.css';

import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminChecklists from './pages/admin/Checklists';
import ChecklistForm from './pages/admin/ChecklistForm';
import Responses from './pages/admin/Responses';
import LojaDashboard from './pages/loja/Dashboard';
import ChecklistFill from './pages/loja/ChecklistFill';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/checklists" element={<ProtectedRoute role="admin"><AdminChecklists /></ProtectedRoute>} />
          <Route path="/admin/checklists/novo" element={<ProtectedRoute role="admin"><ChecklistForm /></ProtectedRoute>} />
          <Route path="/admin/checklists/:id/editar" element={<ProtectedRoute role="admin"><ChecklistForm /></ProtectedRoute>} />
          <Route path="/admin/responses" element={<ProtectedRoute role="admin"><Responses /></ProtectedRoute>} />

          <Route path="/loja" element={<ProtectedRoute role="loja"><LojaDashboard /></ProtectedRoute>} />
          <Route path="/loja/checklist/:id" element={<ProtectedRoute role="loja"><ChecklistFill /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
