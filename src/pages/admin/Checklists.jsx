import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function AdminChecklists() {
  const [checklists, setChecklists] = useState([]);
  const [lojas, setLojas] = useState([]);

  const load = () => {
    api.get('/checklists').then(r => setChecklists(r.data));
    api.get('/checklists/lojas').then(r => setLojas(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Excluir este checklist?')) return;
    await api.delete(`/checklists/${id}`);
    load();
  };

  const getNomesLojas = (cl) => {
    if (Number(cl.is_global) === 1) return 'Todas as lojas';
    if (!cl.assigned_lojas || cl.assigned_lojas.length === 0) return 'Nenhuma loja';
    return cl.assigned_lojas
      .map(id => lojas.find(l => Number(l.id) === Number(id))?.name || id)
      .join(', ');
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Checklists</h2>
          <p>{checklists.length} checklist(s) criado(s)</p>
        </div>
        <Link to="/admin/checklists/novo" className="btn btn-primary">+ Novo</Link>
      </div>

      {checklists.length === 0 ? (
        <div className="empty-state">
          <div className="icon">☑</div>
          <h3>Nenhum checklist criado</h3>
          <p>Crie o primeiro checklist para as lojas preencherem.</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {checklists.map(cl => (
            <div className="card" key={cl.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{cl.title}</h3>
                <span className="badge" style={{ background: Number(cl.is_global) === 1 ? '#D1FAE5' : '#EDE9FE', color: Number(cl.is_global) === 1 ? '#065F46' : '#5B21B6', whiteSpace: 'nowrap' }}>
                  {Number(cl.is_global) === 1 ? '🌍 Global' : '🏪 Especifico'}
                </span>
              </div>
              <p style={{ fontSize: '.78rem', color: '#6B7280', marginBottom: 8 }}>
                📍 {getNomesLojas(cl)}
              </p>
              <p className="text-muted" style={{ fontSize: '.8rem', marginBottom: 12 }}>
                {cl.items.length} item(s) · Criado em {new Date(cl.created_at).toLocaleDateString('pt-BR')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
                {cl.items.slice(0, 3).map((it, i) => (
                  <span key={i} style={{ fontSize: '.8rem', color: '#6B7280' }}>• {it.text}</span>
                ))}
                {cl.items.length > 3 && <span style={{ fontSize: '.8rem', color: '#9CA3AF' }}>+ {cl.items.length - 3} mais...</span>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/admin/checklists/${cl.id}/editar`} className="btn btn-outline btn-sm">Editar</Link>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cl.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
