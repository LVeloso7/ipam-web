import type { Ocupacao } from '../api/tipos'

interface Props {
  ocupacao: Ocupacao
  detalhada?: boolean
}

function formatarQuantidade(valor: string): string {
  return BigInt(valor).toLocaleString('pt-BR')
}

export function BarraOcupacao({ ocupacao, detalhada = false }: Props) {
  const { percentual } = ocupacao
  const nivel = percentual >= 85 ? 'critico' : percentual >= 70 ? 'atencao' : 'normal'
  const textoPercentual = percentual.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  return (
    <div className={detalhada ? 'ocupacao ocupacao--detalhada' : 'ocupacao'}>
      <div
        className="ocupacao__trilho"
        role="meter"
        aria-label="Ocupação da sub-rede"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentual}
      >
        <div
          className={`ocupacao__preenchimento ocupacao__preenchimento--${nivel}`}
          style={{ width: `${Math.min(percentual, 100)}%` }}
        />
      </div>
      <span className="ocupacao__percentual">{textoPercentual}%</span>
      {detalhada && (
        <span className="ocupacao__detalhe">
          {formatarQuantidade(ocupacao.ocupados)} de {formatarQuantidade(ocupacao.total)} endereços
        </span>
      )}
    </div>
  )
}