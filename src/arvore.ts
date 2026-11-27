import type { SubRede } from './api/tipos'

export interface NoSubRede {
  subRede: SubRede
  filhas: NoSubRede[]
}

// Converte a lista plana (com paiId) em árvore. A ordem numérica da API é preservada.
export function montarArvore(subRedes: SubRede[]): NoSubRede[] {
  const nos = new Map<number, NoSubRede>()
  for (const subRede of subRedes) {
    nos.set(subRede.id, { subRede, filhas: [] })
  }

  const raizes: NoSubRede[] = []
  for (const subRede of subRedes) {
    const no = nos.get(subRede.id)
    if (!no) continue

    const pai = subRede.paiId !== null ? nos.get(subRede.paiId) : undefined
    if (pai) {
      pai.filhas.push(no)
    } else {
      raizes.push(no)
    }
  }
  return raizes
}

export interface LinhaArvore {
  subRede: SubRede
  nivel: number
}

// Percorre a árvore em profundidade, na ordem em que as linhas devem aparecer na tabela.
export function achatar(nos: NoSubRede[], nivel = 0): LinhaArvore[] {
  return nos.flatMap((no) => [
    { subRede: no.subRede, nivel },
    ...achatar(no.filhas, nivel + 1),
  ])
}