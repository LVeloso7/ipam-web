import { Link, useSearchParams } from 'react-router'
import { api } from '../api/cliente'
import type { TipoBusca } from '../api/tipos'
import { BarraOcupacao } from '../components/BarraOcupacao'
import { Cidr } from '../components/Cidr'
import { SeloStatus } from '../components/SeloStatus'
import { useCarregar } from '../useCarregar'

const EXPLICACOES: Record<TipoBusca, string> = {
  IP: 'Endereço exato em todas as VRFs, e as sub-redes que o contêm.',
  CIDR: 'Sub-redes iguais ou contidas neste bloco.',
  PREFIXO: 'Endereços e sub-redes que começam com o termo.',
  TEXTO: 'Hostnames e descrições de sub-redes que contêm o termo.',
}

export function PaginaBusca() {
  const [parametros] = useSearchParams()
  const termo = parametros.get('q')?.trim() ?? ''

  const busca = useCarregar(
    () => (termo.length >= 2 ? api.buscar(termo) : Promise.resolve(null)),
    [termo],
  )

  if (termo.length < 2) {
    return <p className="vazio">Digite ao menos 2 caracteres no campo de busca.</p>
  }
  if (busca.erro) return <p className="alerta" role="alert">{busca.erro}</p>
  if (busca.carregando || !busca.dados) return <p className="vazio">Buscando...</p>

  const { tipo, subRedes, enderecos } = busca.dados
  const nadaEncontrado = subRedes.length === 0 && enderecos.length === 0

  return (
    <section>
      <h1 className="titulo">Resultados para “{termo}”</h1>
      <p className="subtitulo">{EXPLICACOES[tipo]}</p>

      {nadaEncontrado && (
        <p className="vazio">
          Nenhum resultado. Tente outra forma: um IP completo, um CIDR como 10.0.5.0/24,
          o início de um endereço ou parte de um hostname.
        </p>
      )}

      {enderecos.length > 0 && (
        <div className="bloco">
          <h2 className="bloco__titulo">Endereços IP ({enderecos.length})</h2>
          <div className="tabela-rolagem">
            <table className="tabela">
              <thead>
                <tr>
                  <th scope="col">Endereço</th>
                  <th scope="col">Hostname</th>
                  <th scope="col">Sub-rede</th>
                  <th scope="col">VRF</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {enderecos.map((ip) => (
                  <tr key={ip.id}>
                    <td className="numerico">{ip.endereco}</td>
                    <td>{ip.hostname ?? '—'}</td>
                    <td>
                      <Link to={`/sub-redes/${ip.subRedeId}`} className="cidr">
                        <Cidr cidr={ip.subRedeCidr} />
                      </Link>
                    </td>
                    <td>{ip.vrfNome}</td>
                    <td><SeloStatus status={ip.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subRedes.length > 0 && (
        <div className="bloco">
          <h2 className="bloco__titulo">Sub-redes ({subRedes.length})</h2>
          <div className="tabela-rolagem">
            <table className="tabela">
              <thead>
                <tr>
                  <th scope="col">Sub-rede</th>
                  <th scope="col">Descrição</th>
                  <th scope="col">Seção</th>
                  <th scope="col">VRF</th>
                  <th scope="col">Ocupação</th>
                </tr>
              </thead>
              <tbody>
                {subRedes.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <Link to={`/sub-redes/${s.id}`} className="cidr">
                        <Cidr cidr={s.cidr} />
                      </Link>
                    </td>
                    <td>{s.descricao ?? '—'}</td>
                    <td><Link to={`/secoes/${s.secaoId}`}>{s.secaoNome}</Link></td>
                    <td>{s.vrfNome}</td>
                    <td><BarraOcupacao ocupacao={s.ocupacao} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}