import { Link } from 'react-router'
import { api } from '../api/cliente'
import { BarraOcupacao } from '../components/BarraOcupacao'
import { Cidr } from '../components/Cidr'
import { useCarregar } from '../useCarregar'

export function PaginaPainel() {
  const resumo = useCarregar(() => api.resumo(), [])
  const criticas = useCarregar(() => api.listarCriticas(), [])

  const numeros = resumo.dados
    ? [
        { rotulo: 'Seções', valor: resumo.dados.secoes },
        { rotulo: 'Sub-redes', valor: resumo.dados.subRedes },
        { rotulo: 'VLANs', valor: resumo.dados.vlans },
        { rotulo: 'Endereços IP', valor: resumo.dados.enderecosIp },
        { rotulo: 'VRFs', valor: resumo.dados.vrfs },
      ]
    : []

  return (
    <section>
      <h1 className="titulo">Visão geral</h1>
      <p className="subtitulo">Endereçamento cadastrado e redes que precisam de atenção.</p>

      {resumo.erro && <p className="alerta" role="alert">{resumo.erro}</p>}

      <dl className="resumo">
        {numeros.map(({ rotulo, valor }) => (
          <div key={rotulo}>
            <dt>{rotulo}</dt>
            <dd>{valor.toLocaleString('pt-BR')}</dd>
          </div>
        ))}
      </dl>

      <div className="bloco">
        <h2 className="bloco__titulo">Sub-redes acima de 85% de ocupação</h2>

        {criticas.erro && <p className="alerta" role="alert">{criticas.erro}</p>}
        {criticas.carregando && <p className="vazio">Carregando...</p>}

        {criticas.dados && criticas.dados.length === 0 && (
          <p className="vazio">Nenhuma sub-rede acima do limite no momento.</p>
        )}

        {criticas.dados && criticas.dados.length > 0 && (
          <div className="tabela-rolagem">
            <table className="tabela">
              <thead>
                <tr>
                  <th scope="col">Sub-rede</th>
                  <th scope="col">Seção</th>
                  <th scope="col">Descrição</th>
                  <th scope="col">Ocupação</th>
                </tr>
              </thead>
              <tbody>
                {criticas.dados.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <Link to={`/sub-redes/${s.id}`} className="cidr">
                        <Cidr cidr={s.cidr} />
                      </Link>
                    </td>
                    <td>
                      <Link to={`/secoes/${s.secaoId}`}>{s.secaoNome}</Link>
                    </td>
                    <td>{s.descricao ?? '—'}</td>
                    <td><BarraOcupacao ocupacao={s.ocupacao} detalhada /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}