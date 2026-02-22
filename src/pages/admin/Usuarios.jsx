import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function Usuarios() {
  const [users, setUsers] = useState([]);

  const load = () => api.get('/auth/users').then(r => setUsers(r.data));
  useEffect(() => { load(); }, []);

  const handleToggle = async (user) => {
    const acao = Number(user.active) === 1 ? 'desativar' : 'ativar';
    if (!confirm(`Deseja ${acao} o usuário ${user.name}?`)) return;
    await api.patch(`/auth/users/${user.id}/toggle`);
    load();
  };

  const admins = users.filter(u => u.role === 'admin');
  const lojas = users.filter(u => u.role === 'loja');

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Usuários</h2>
          <p>{lojas.length} loja(s) cadastrada(s)</p>
        </div>
        <Link to="/admin/usuarios/novo" className="btn btn-primary">+ Novo Usuário</Link>
      </div>

      <div className="card mb-4">
        <h3 style={{ marginBottom: 16, fontSize: '1rem', fontWeight: 600 }}>Administradores</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${Number(u.active) === 1 ? 'badge-completed' : 'badge-pending'}`}>
                      {Number(u.active) === 1 ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <Link to={`/admin/usuarios/${u.id}/editar`} className="btn btn-outline btn-sm">Editar</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16, fontSize: '1rem', fontWeight: 600 }}>Lojas</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lojas.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${Number(u.active) === 1 ? 'badge-completed' : 'badge-pending'}`}>
                      {Number(u.active) === 1 ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/admin/usuarios/${u.id}/editar`} className="btn btn-outline btn-sm">Editar</Link>
                    <button
                      className={`btn btn-sm ${Number(u.active) === 1 ? 'btn-danger' : 'btn-outline'}`}
                      onClick={() => handleToggle(u)}
                    >
                      {Number(u.active) === 1 ? 'Desativar' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
