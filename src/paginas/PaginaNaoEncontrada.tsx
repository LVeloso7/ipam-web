import { Link } from 'react-router'

export function PaginaNaoEncontrada() {
  return (
    <section>
      <h1 className="titulo">Página não encontrada</h1>
      <p className="subtitulo">
        O endereço acessado não existe. <Link to="/">Voltar ao início</Link>
      </p>
    </section>
  )
}