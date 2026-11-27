interface Props {
  nivel: number
  ultima: boolean
  continuacoes: boolean[]
}

export function ConectorArvore({ nivel, ultima, continuacoes }: Props) {
  if (nivel === 0) return null

  return (
    <span className="conector" aria-hidden="true">
      {continuacoes.slice(1).map((continua, indice) => (
        <span
          key={indice}
          className={continua ? 'conector__guia conector__guia--linha' : 'conector__guia'}
        />
      ))}
      <span className={ultima ? 'conector__cotovelo conector__cotovelo--ultimo' : 'conector__cotovelo'} />
    </span>
  )
}