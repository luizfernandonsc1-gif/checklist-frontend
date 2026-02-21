import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function LojaDashboard() {
  const { user } = useAuth();
  const [checklists, setChecklists] = useState([]);
  const [myResponses, setMyResponses] = useState([]);

  useEffect(() => {
    api.get('/checklists').then(r => setChecklists(r.data));
    api.get('/responses/my').then(r => setMyResponses(r.data));
  }, []);

  const getStatus = (clId) => myResponses.find(r => r.checklist_id === clId);

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Ola, {user?.name} 👋</h2>
          <p>Preencha os checklists atribuidos a sua loja.</p>
        </div>
      </div>

      {checklists.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🌿</div>
          <h3>Nenhum checklist disponivel</h3>
          <p>Aguarde o administrador criar checklists para voce preencher.</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {checklists.map(cl => {
            const resp = getStatus(cl.id);
            const status = resp?.status || 'not_started';
            return (
              <div className="card" key={cl.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{cl.title}</h3>
                  <span className={`badge ${status === 'completed' ? 'badge-completed' : status === 'pending' ? 'badge-pending' : ''}`}
                    style={status === 'not_started' ? { background: '#F3F4F6', color: '#6B7280' } : {}}>
                    {status === 'completed' ? 'Concluido' : status === 'pending' ? 'Em andamento' : 'Nao iniciado'}
                  </span>
                </div>
                <p className="text-muted" style={{ fontSize: '.8rem', marginBottom: 12 }}>
                  {cl.items.length} item(s)
                </p>
                {resp?.completed_at && (
                  <p style={{ fontSize: '.78rem', color: '#059669', marginBottom: 8 }}>
                    Concluido em {new Date(resp.completed_at).toLocaleString('pt-BR')}
                  </p>
                )}
                <Link
                  to={`/loja/checklist/${cl.id}`}
                  className={`btn btn-sm ${status === 'completed' ? 'btn-outline' : 'btn-primary'}`}
                >
                  {status === 'completed' ? 'Ver respostas' : status === 'pending' ? 'Continuar' : 'Iniciar'}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
