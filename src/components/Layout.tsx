import { type FormEvent, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import { api } from '../api/cliente'
import { useCarregar } from '../useCarregar'


export function Layout() {
  const secoes = useCarregar(() => api.listarSecoes(), [])
  const [filtro, setFiltro] = useState('')
  const navegar = useNavigate()
  const [termo, setTermo] = useState('')

  function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const texto = termo.trim()
    if (texto.length >= 2) {
      navegar(`/busca?q=${encodeURIComponent(texto)}`)
    }
  }

  const visiveis = useMemo(() => {
    const termo = filtro.trim().toLocaleLowerCase('pt-BR')
    return (secoes.dados ?? []).filter((secao) =>
      secao.nome.toLocaleLowerCase('pt-BR').includes(termo))
  }, [secoes.dados, filtro])

  return (
    <div className="app">
           <header className="topo">
        <Link to="/" className="topo__nome">IPAM</Link>
        <span className="topo__descricao">Endereçamento de rede</span>

        <form className="busca" role="search" onSubmit={buscar}>
          <label htmlFor="campo-busca" className="visualmente-oculto">
            Buscar IP, CIDR, hostname ou descrição
          </label>
          <input
            id="campo-busca"
            type="search"
            value={termo}
            onChange={(evento) => setTermo(evento.target.value)}
            placeholder="IP, CIDR, hostname ou descrição"
          />
          <button type="submit" className="botao botao--claro">Buscar</button>
        </form>
      </header>

      <aside className="lateral">
        <label className="filtro">
          <span className="filtro__rotulo">Seções</span>
          <input
            type="search"
            value={filtro}
            onChange={(evento) => setFiltro(evento.target.value)}
            placeholder="Filtrar por nome"
          />
        </label>

        {secoes.erro && <p className="alerta" role="alert">{secoes.erro}</p>}

        <nav aria-label="Seções">
          <ul className="secoes">
            {visiveis.map((secao) => (
              <li key={secao.id}>
                <NavLink
                  to={`/secoes/${secao.id}`}
                  className={({ isActive }) => (isActive ? 'secao secao--ativa' : 'secao')}
                >
                  {secao.nome}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="painel">
        <Outlet />
      </main>
    </div>
  )
}