import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../api/axios';

export default function Responses() {
  const [responses, setResponses] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/responses/all').then(r => setResponses(r.data));
  }, []);

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2>Respostas das Lojas</h2>
          <p>{responses.length} resposta(s) registrada(s)</p>
        </div>
      </div>

      <div className="card">
        {responses.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>Nenhuma resposta ainda</h3>
            <p>As lojas ainda nao preencheram nenhum checklist.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Checklist</th>
                  <th>Loja</th>
                  <th>E-mail</th>
                  <th>Status</th>
                  <th>Concluido em</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {responses.map(r => (
                  <tr key={r.id}>
                    <td>{r.checklist_title}</td>
                    <td>{r.loja_name}</td>
                    <td>{r.loja_email}</td>
                    <td><span className={`badge badge-${r.status}`}>{r.status === 'completed' ? 'Concluido' : 'Pendente'}</span></td>
                    <td>{r.completed_at ? new Date(r.completed_at).toLocaleString('pt-BR') : '-'}</td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => setSelected(selected?.id === r.id ? null : r)}>
                        {selected?.id === r.id ? 'Fechar' : 'Ver itens'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="card mt-4">
          <h3 style={{ marginBottom: 16 }}>Itens - {selected.checklist_title} ({selected.loja_name})</h3>
          {selected.items.length === 0 ? (
            <p className="text-muted">Nenhum item respondido ainda.</p>
          ) : (
            selected.items.map((item, i) => (
              <div className={`checklist-item ${item.checked ? 'checked' : ''}`} key={i}>
                <input type="checkbox" checked={!!item.checked} readOnly />
                <label>{item.text}</label>
              </div>
            ))
          )}
        </div>
      )}
    </Layout>
  );
}
