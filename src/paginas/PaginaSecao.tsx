import { useMemo } from 'react'
import { Link, useParams } from 'react-router'
import { api } from '../api/cliente'
import { achatar, montarArvore } from '../arvore'
import { BarraOcupacao } from '../components/BarraOcupacao'
import { Cidr } from '../components/Cidr'
import { ConectorArvore } from '../components/ConectorArvore'
import { EsqueletoTabela, EsqueletoTitulo } from '../components/Esqueleto'
import { useCarregar } from '../useCarregar'

export function PaginaSecao() {
  const { secaoId } = useParams()
  const id = Number(secaoId)

  // Hooks sempre antes de qualquer return.
  const secao = useCarregar(() => api.buscarSecao(id), [id])
  const subRedes = useCarregar(() => api.listarSubRedesDaSecao(id), [id])

  const linhas = useMemo(
    () => (subRedes.dados ? achatar(montarArvore(subRedes.dados)) : []),
    [subRedes.dados],
  )

  if (secao.erro) {
    return <p className="alerta" role="alert">{secao.erro}</p>
  }

  if (secao.carregando || subRedes.carregando) {
    return (
      <>
        <EsqueletoTitulo />
        <EsqueletoTabela />
      </>
    )
  }

  return (
    <section>
      <h1 className="titulo">{secao.dados?.nome}</h1>
      {secao.dados?.descricao && <p className="subtitulo">{secao.dados.descricao}</p>}

      {subRedes.erro && <p className="alerta" role="alert">{subRedes.erro}</p>}

      {linhas.length === 0 ? (
        <p className="vazio">
          Nenhuma sub-rede cadastrada nesta seção. Cadastre a primeira para começar a montar a hierarquia.
        </p>
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
              {linhas.map(({ subRede, nivel, ultima, continuacoes }) => (
                <tr key={subRede.id}>
                  <td className="celula-arvore">
                    <ConectorArvore nivel={nivel} ultima={ultima} continuacoes={continuacoes} />
                    <Link
                      to={`/sub-redes/${subRede.id}`}
                      className="cidr"
                      style={{ paddingLeft: `${nivel * 1.25}rem` }}
                    >
                      <Cidr cidr={subRede.cidr} />
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
