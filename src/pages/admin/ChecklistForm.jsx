import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function ChecklistForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [items, setItems] = useState(['']);
  const [isGlobal, setIsGlobal] = useState(true);
  const [lojas, setLojas] = useState([]);
  const [selectedLojas, setSelectedLojas] = useState([]);
  const [recurrence, setRecurrence] = useState('none');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/checklists/lojas').then(r => setLojas(r.data));
    if (isEdit) {
      api.get(`/checklists/${id}`).then(r => {
        setTitle(r.data.title);
        setItems(r.data.items.map(i => i.text));
        setIsGlobal(Number(r.data.is_global) === 1);
        setSelectedLojas(r.data.assigned_lojas || []);
        setRecurrence(r.data.recurrence || 'none');
      });
    }
  }, [id]);

  const addItem = () => setItems([...items, '']);
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx, val) => setItems(items.map((it, i) => i === idx ? val : it));

  const toggleLoja = (lojaId) => {
    setSelectedLojas(prev =>
      prev.includes(lojaId) ? prev.filter(id => id !== lojaId) : [...prev, lojaId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const cleanItems = items.filter(i => i.trim());
    if (!title.trim()) return setError('Titulo e obrigatorio.');
    if (cleanItems.length === 0) return setError('Adicione pelo menos um item.');
    if (!isGlobal && selectedLojas.length === 0) return setError('Selecione pelo menos uma loja.');

    setLoading(true);
    try {
      const payload = {
        title,
        items: cleanItems,
        is_global: isGlobal,
        assigned_lojas: isGlobal ? [] : selectedLojas,
        recurrence,
      };
      if (isEdit) {
        await api.put(`/checklists/${id}`, payload);
      } else {
        await api.post('/checklists', payload);
      }
      navigate('/admin/checklists');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>{isEdit ? 'Editar Checklist' : 'Novo Checklist'}</h2>
          <p>{isEdit ? 'Atualize o titulo e os itens.' : 'Crie um novo checklist para as lojas.'}</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titulo do Checklist</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Checklist de Abertura"
            />
          </div>

          <div className="form-group">
            <label>Recorrencia</label>
            <select value={recurrence} onChange={e => setRecurrence(e.target.value)}>
              <option value="none">Sem recorrencia (unico)</option>
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
            </select>
          </div>

          <div className="form-group">
            <label>Destinatario</label>
            <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="radio" checked={isGlobal} onChange={() => setIsGlobal(true)} />
                Todas as lojas
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="radio" checked={!isGlobal} onChange={() => setIsGlobal(false)} />
                Lojas especificas
              </label>
            </div>
          </div>

          {!isGlobal && (
            <div className="form-group">
              <label>Selecione as lojas</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {lojas.map(loja => (
                  <label key={loja.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '8px 12px', border: '1.5px solid #D1D5DB', borderRadius: 8, background: selectedLojas.includes(Number(loja.id)) ? '#E8F5F0' : '#fff' }}>
                    <input
                      type="checkbox"
                      checked={selectedLojas.includes(Number(loja.id))}
                      onChange={() => toggleLoja(Number(loja.id))}
                    />
                    {loja.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Itens</label>
            {items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  value={item}
                  onChange={e => updateItem(idx, e.target.value)}
                  placeholder={`Item ${idx + 1}`}
                  style={{ flex: 1 }}
                />
                {items.length > 1 && (
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(idx)}>X</button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-outline btn-sm mt-4" onClick={addItem}>
              + Adicionar item
            </button>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Salvando...' : isEdit ? 'Salvar alteracoes' : 'Criar Checklist'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/checklists')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
