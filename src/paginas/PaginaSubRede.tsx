import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { api, mensagemDeErro } from '../api/cliente'
import type { ProximoIp } from '../api/tipos'
import { BarraOcupacao } from '../components/BarraOcupacao'
import { Cidr } from '../components/Cidr'
import { SeloStatus } from '../components/SeloStatus'
import { formatarData } from '../formatar'
import { useCarregar } from '../useCarregar'

export function PaginaSubRede() {
  const { subRedeId } = useParams()
  const id = Number(subRedeId)

  const subRede = useCarregar(() => api.buscarSubRede(id), [id])
  const ips = useCarregar(() => api.listarIpsDaSubRede(id), [id])
  const filhas = useCarregar(() => api.listarFilhas(id), [id])

  const [proximo, setProximo] = useState<ProximoIp | null>(null)
  const [erroProximo, setErroProximo] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)

  async function sugerirProximo() {
    setErroProximo(null)
    setCopiado(false)
    try {
      setProximo(await api.proximoIpLivre(id))
    } catch (e) {
      setProximo(null)
      setErroProximo(mensagemDeErro(e))
    }
  }

  async function copiar(endereco: string) {
    try {
      await navigator.clipboard.writeText(endereco)
      setCopiado(true)
    } catch {
      setErroProximo('Não foi possível copiar. Selecione o endereço e copie manualmente.')
    }
  }

  if (subRede.erro) return <p className="alerta" role="alert">{subRede.erro}</p>
  if (subRede.carregando || !subRede.dados) return <p className="vazio">Carregando...</p>

  const s = subRede.dados
  const proximoDestaSubRede = proximo?.subRedeId === id ? proximo : null

  return (
    <section>
      <nav className="migalhas" aria-label="Localização">
        <Link to={`/secoes/${s.secaoId}`}>{s.secaoNome}</Link>
        {s.paiId !== null && (
          <>
            <span aria-hidden="true">/</span>
            <Link to={`/sub-redes/${s.paiId}`}>Sub-rede superior</Link>
          </>
        )}
      </nav>

      <h1 className="titulo titulo--cidr">
        <Cidr cidr={s.cidr} />
      </h1>
      <p className="subtitulo">{s.descricao ?? 'Sem descrição'}</p>

      <dl className="atributos">
        <div>
          <dt>VLAN</dt>
          <dd>{s.vlanNumero !== null ? `${s.vlanNumero} (${s.vlanNome})` : 'Não informada'}</dd>
        </div>
        <div>
          <dt>VRF</dt>
          <dd>{s.vrfNome}</dd>
        </div>
        <div>
          <dt>Unidade</dt>
          <dd>{s.unidade ?? 'Não informada'}</dd>
        </div>
        <div>
          <dt>Cadastrada</dt>
          <dd>{formatarData(s.criadoEm)} por {s.criadoPor}</dd>
        </div>
      </dl>

      <div className="bloco">
        <h2 className="bloco__titulo">Ocupação</h2>
        <BarraOcupacao ocupacao={s.ocupacao} detalhada />
      </div>

      <div className="bloco">
        <div className="proximo-livre">
          <button type="button" className="botao" onClick={sugerirProximo}>
            Sugerir próximo IP livre
          </button>
          {proximoDestaSubRede && (
            <>
              <output className="proximo-livre__endereco">{proximoDestaSubRede.endereco}</output>
              <button
                type="button"
                className="botao botao--secundario"
                onClick={() => copiar(proximoDestaSubRede.endereco)}
              >
                {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </>
          )}
        </div>
        {erroProximo && <p className="alerta" role="alert">{erroProximo}</p>}
      </div>

      {filhas.dados && filhas.dados.length > 0 && (
        <div className="bloco">
          <h2 className="bloco__titulo">Sub-redes contidas</h2>
          <div className="tabela-rolagem">
            <table className="tabela">
              <thead>
                <tr>
                  <th scope="col">Sub-rede</th>
                  <th scope="col">Descrição</th>
                  <th scope="col">Ocupação</th>
                </tr>
              </thead>
              <tbody>
                {filhas.dados.map((filha) => (
                  <tr key={filha.id}>
                    <td>
                      <Link to={`/sub-redes/${filha.id}`} className="cidr">
                        <Cidr cidr={filha.cidr} />
                      </Link>
                    </td>
                    <td>{filha.descricao ?? '—'}</td>
                    <td><BarraOcupacao ocupacao={filha.ocupacao} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bloco">
        <h2 className="bloco__titulo">
          Endereços cadastrados {ips.dados && `(${ips.dados.length})`}
        </h2>
        {ips.erro && <p className="alerta" role="alert">{ips.erro}</p>}
        {ips.dados && ips.dados.length === 0 && (
          <p className="vazio">Nenhum endereço cadastrado diretamente nesta sub-rede.</p>
        )}
        {ips.dados && ips.dados.length > 0 && (
          <div className="tabela-rolagem">
            <table className="tabela">
              <thead>
                <tr>
                  <th scope="col">Endereço</th>
                  <th scope="col">Hostname</th>
                  <th scope="col">MAC</th>
                  <th scope="col">Status</th>
                  <th scope="col">Descrição</th>
                  <th scope="col">Última alteração</th>
                </tr>
              </thead>
              <tbody>
                {ips.dados.map((ip) => (
                  <tr key={ip.id}>
                    <td className="numerico">{ip.endereco}</td>
                    <td>{ip.hostname ?? '—'}</td>
                    <td className="numerico">{ip.mac ?? '—'}</td>
                    <td><SeloStatus status={ip.status} /></td>
                    <td>{ip.descricao ?? '—'}</td>
                    <td>
                      {formatarData(ip.atualizadoEm ?? ip.criadoEm)} por{' '}
                      {ip.atualizadoPor ?? ip.criadoPor}
                    </td>
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