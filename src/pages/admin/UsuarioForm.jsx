import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function UsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('loja');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      api.get('/auth/users').then(r => {
        const user = r.data.find(u => String(u.id) === String(id));
        if (user) {
          setName(user.name);
          setEmail(user.email);
          setRole(user.role);
        }
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email) return setError('Nome e e-mail são obrigatórios.');
    if (!isEdit && !password) return setError('Senha é obrigatória.');

    setLoading(true);
    try {
      if (isEdit) {
        const payload = { name, email, role };
        if (password) payload.password = password;
        await api.put(`/auth/users/${id}`, payload);
      } else {
        await api.post('/auth/users', { name, email, password, role });
      }
      navigate('/admin/usuarios');
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
          <h2>{isEdit ? 'Editar Usuário' : 'Novo Usuário'}</h2>
          <p>{isEdit ? 'Atualize os dados do usuário.' : 'Cadastre um novo usuário no sistema.'}</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Loja Joaçaba"
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@boticario.com"
            />
          </div>

          <div className="form-group">
            <label>{isEdit ? 'Nova senha (deixe em branco para manter)' : 'Senha'}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={isEdit ? 'Digite para alterar' : 'Senha de acesso'}
            />
          </div>

          <div className="form-group">
            <label>Perfil</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="loja">Loja</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar Usuário'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/usuarios')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
