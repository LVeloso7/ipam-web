interface PropsTabela {
  linhas?: number
  colunas?: number
}

export function EsqueletoTabela({ linhas = 6, colunas = 5 }: PropsTabela) {
  return (
    <div className="esqueleto" role="status" aria-label="Carregando">
      {Array.from({ length: linhas }, (_, i) => (
        <div
          key={i}
          className="esqueleto__linha"
          style={{ gridTemplateColumns: `repeat(${colunas}, 1fr)` }}
        >
          {Array.from({ length: colunas }, (_, j) => (
            <span key={j} className="esqueleto__bloco" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function EsqueletoTitulo() {
  return (
    <div className="esqueleto" role="status" aria-label="Carregando">
      <span className="esqueleto__bloco esqueleto__bloco--titulo" />
      <span className="esqueleto__bloco esqueleto__bloco--subtitulo" />
    </div>
  )
}