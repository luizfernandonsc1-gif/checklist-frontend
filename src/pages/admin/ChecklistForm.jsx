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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      api.get(`/checklists/${id}`).then(r => {
        setTitle(r.data.title);
        setItems(r.data.items.map(i => i.text));
      });
    }
  }, [id]);

  const addItem = () => setItems([...items, '']);
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx, val) => setItems(items.map((it, i) => i === idx ? val : it));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const cleanItems = items.filter(i => i.trim());
    if (!title.trim()) return setError('Titulo e obrigatorio.');
    if (cleanItems.length === 0) return setError('Adicione pelo menos um item.');

    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/checklists/${id}`, { title, items: cleanItems });
      } else {
        await api.post('/checklists', { title, items: cleanItems });
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
