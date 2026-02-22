import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function ChecklistFill() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [checklist, setChecklist] = useState(null);
  const [checks, setChecks] = useState({});
  const [status, setStatus] = useState('not_started');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    Promise.all([
      api.get(`/checklists/${id}`),
      api.get(`/responses/${id}/mine`),
    ]).then(([clRes, respRes]) => {
      setChecklist(clRes.data);
      if (respRes.data) {
        setStatus(respRes.data.status);
        const init = {};
        respRes.data.items?.forEach(i => { init[i.item_id] = !!i.checked; });
        setChecks(init);
      }
    });
  }, [id]);

  const toggle = (itemId) => {
    if (status === 'completed') return;
    setChecks(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const buildPayload = () =>
    checklist.items.map(i => ({ item_id: i.id, checked: !!checks[i.id] }));

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      await api.post(`/responses/${id}/save`, { items: buildPayload() });
      setStatus('pending');
      setMsg('Progresso salvo!');
    } catch (e) {
      setMsg(e.response?.data?.message || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    if (!confirm('Confirmar envio? Apos isso nao sera possivel editar.')) return;
    setSaving(true);
    setMsg('');
    try {
      await api.post(`/responses/${id}/save`, { items: buildPayload() });
      await api.post(`/responses/${id}/complete`);
      setStatus('completed');
      setMsg('Checklist concluido com sucesso!');
    } catch (e) {
      setMsg(e.response?.data?.message || 'Erro ao concluir.');
    } finally {
      setSaving(false);
    }
  };

  if (!checklist) return <Layout><p>Carregando...</p></Layout>;

  const total = checklist.items.length;
  const done = checklist.items.filter(i => checks[i.id]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>{checklist.title}</h2>
          <p>{done}/{total} itens marcados</p>
        </div>
        {status === 'completed' && (
          <span className="badge badge-completed" style={{ fontSize: '.9rem', padding: '8px 16px' }}>
            Concluido
          </span>
        )}
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem', color: '#6B7280', marginBottom: 4 }}>
            <span>Progresso</span><span>{pct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {checklist.items.map(item => (
          <div
            key={item.id}
            className={`checklist-item ${checks[item.id] ? 'checked' : ''}`}
            onClick={() => toggle(item.id)}
            style={{ cursor: status === 'completed' ? 'default' : 'pointer' }}
          >
            <input
              type="checkbox"
              checked={!!checks[item.id]}
              onChange={() => toggle(item.id)}
              disabled={status === 'completed'}
            />
            <label style={{ cursor: 'inherit' }}>{item.text}</label>
          </div>
        ))}

        {msg && (
          <div style={{
            marginTop: 16, padding: '10px 14px', borderRadius: 8,
            background: msg.includes('Erro') ? '#FEE2E2' : '#D1FAE5',
            color: msg.includes('Erro') ? '#991B1B' : '#065F46',
            fontSize: '.875rem'
          }}>
            {msg}
          </div>
        )}

        {status !== 'completed' && (
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button className="btn btn-outline" onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar progresso'}
            </button>
            <button className="btn btn-primary" onClick={handleComplete} disabled={saving || done === 0}>
              {saving ? 'Enviando...' : 'Concluir checklist'}
            </button>
          </div>
        )}

        {status !== 'completed' && (
          <p style={{ marginTop: 12, fontSize: '.78rem', color: '#9CA3AF' }}>
            Voce pode salvar o progresso e voltar depois. Ao concluir, nao sera possivel editar.
          </p>
        )}
      </div>

      <button className="btn btn-outline btn-sm mt-4" onClick={() => navigate('/loja')}>
        Voltar
      </button>
    </Layout>
  );
}
