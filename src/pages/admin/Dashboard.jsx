import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [checklists, setChecklists] = useState([]);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    api.get('/checklists').then(r => setChecklists(r.data));
    api.get('/responses/all').then(r => setResponses(r.data));
  }, []);

  const total = checklists.length;
  const completed = responses.filter(r => r.status === 'completed').length;
  const pending = responses.filter(r => r.status === 'pending').length;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Visao geral do sistema</p>
        </div>
        <Link to="/admin/checklists/novo" className="btn btn-primary">+ Novo Checklist</Link>
      </div>

      <div className="grid grid-3 mb-4">
        {[
          { label: 'Checklists criados', value: total, icon: '☑' },
          { label: 'Respostas concluidas', value: completed, icon: '✅' },
          { label: 'Em andamento', value: pending, icon: '⏳' },
        ].map(s => (
          <div className="card stat-card" key={s.label}>
            <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="card mt-4">
        <h3 style={{ marginBottom: 16 }}>Ultimas respostas</h3>
        {responses.length === 0 ? (
          <p className="text-muted">Nenhuma resposta ainda.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Checklist</th>
                  <th>Loja</th>
                  <th>Status</th>
                  <th>Concluido em</th>
                </tr>
              </thead>
              <tbody>
                {responses.slice(0, 10).map(r => (
                  <tr key={r.id}>
                    <td>{r.checklist_title}</td>
                    <td>{r.loja_name}</td>
                    <td>
                      <span className={`badge badge-${r.status}`}>
                        {r.status === 'completed' ? 'Concluido' : 'Pendente'}
                      </span>
                    </td>
                    <td>{r.completed_at ? new Date(r.completed_at).toLocaleString('pt-BR') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
