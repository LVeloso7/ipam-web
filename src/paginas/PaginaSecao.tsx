import { useMemo } from 'react'
import { Link, useParams } from 'react-router'
import { api } from '../api/cliente'
import { achatar, montarArvore } from '../arvore'
import { BarraOcupacao } from '../components/BarraOcupacao'
import { useCarregar } from '../useCarregar'

export function PaginaSecao() {
  const { secaoId } = useParams()
  const id = Number(secaoId)

  const secao = useCarregar(() => api.buscarSecao(id), [id])
  const subRedes = useCarregar(() => api.listarSubRedesDaSecao(id), [id])

  const linhas = useMemo(
    () => (subRedes.dados ? achatar(montarArvore(subRedes.dados)) : []),
    [subRedes.dados],
  )

  if (secao.erro) return <p className="alerta" role="alert">{secao.erro}</p>
  if (secao.carregando || subRedes.carregando) return <p className="vazio">Carregando...</p>

  return (
    <section>
      <h1 className="titulo">{secao.dados?.nome}</h1>
      {secao.dados?.descricao && <p className="subtitulo">{secao.dados.descricao}</p>}

      {subRedes.erro && <p className="alerta" role="alert">{subRedes.erro}</p>}

      {linhas.length === 0 ? (
        <p className="vazio">Nenhuma sub-rede cadastrada nesta seção.</p>
      ) : (
        <div className="tabela-rolagem">
          <table className="tabela">
            <thead>
              <tr>
                <th scope="col">Sub-rede</th>
                <th scope="col">Descrição</th>
                <th scope="col">VLAN</th>
                <th scope="col">VRF</th>
                <th scope="col">Ocupação</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map(({ subRede, nivel }) => {
                const [rede, mascara] = subRede.cidr.split('/')
                return (
                  <tr key={subRede.id}>
                    <td>
                      <Link
                        to={`/sub-redes/${subRede.id}`}
                        className="cidr"
                        style={{ paddingLeft: `${nivel * 1.25}rem` }}
                      >
                        {rede}
                        <span className="cidr__mascara">/{mascara}</span>
                      </Link>
                    </td>
                    <td>{subRede.descricao ?? '—'}</td>
                    <td>
                      {subRede.vlanNumero !== null ? (
                        <>
                          <span className="vlan__numero">{subRede.vlanNumero}</span>{' '}
                          <span className="vlan__nome">{subRede.vlanNome}</span>
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>{subRede.vrfNome}</td>
                    <td>
                      <BarraOcupacao ocupacao={subRede.ocupacao} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}