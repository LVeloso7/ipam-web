import { type FormEvent, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import { LayoutDashboard, Moon, Network, Search, Sun } from 'lucide-react'
import { api } from '../api/cliente'
import { useCarregar } from '../useCarregar'
import { useTema } from '../useTema'

export function Layout() {
  const secoes = useCarregar(() => api.listarSecoes(), [])
  const { tema, alternar } = useTema()
  const navegar = useNavigate()
  const [filtro, setFiltro] = useState('')
  const [termo, setTermo] = useState('')

  const visiveis = useMemo(() => {
    const busca = filtro.trim().toLocaleLowerCase('pt-BR')
    return (secoes.dados ?? []).filter((secao) =>
      secao.nome.toLocaleLowerCase('pt-BR').includes(busca))
  }, [secoes.dados, filtro])

  function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const texto = termo.trim()
    if (texto.length >= 2) {
      navegar(`/busca?q=${encodeURIComponent(texto)}`)
    }
  }

  const proximoTema = tema === 'claro' ? 'escuro' : 'claro'

  return (
    <div className="app">
      <header className="topo">
        <Link to="/" className="topo__nome">IPAM</Link>
        <span className="topo__descricao">Endereçamento de rede</span>

        <form className="busca" role="search" onSubmit={buscar}>
          <Search size={16} className="busca__icone" aria-hidden="true" />
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
        </form>

        <button
          type="button"
          className="tema-alternar"
          onClick={alternar}
          aria-label={`Ativar tema ${proximoTema}`}
          title={`Ativar tema ${proximoTema}`}
        >
          {tema === 'claro'
            ? <Moon size={18} aria-hidden="true" />
            : <Sun size={18} aria-hidden="true" />}
        </button>
      </header>

      <aside className="lateral">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? 'lateral__link lateral__link--ativo' : 'lateral__link'}
        >
          <LayoutDashboard size={16} aria-hidden="true" />
          Visão geral
        </NavLink>

        <label className="filtro">
          <span className="lateral__titulo">
            <Network size={16} aria-hidden="true" />
            Seções
          </span>
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