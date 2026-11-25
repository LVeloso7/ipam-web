import type { ProblemDetail, Vrf } from './tipos'

export class ErroApi extends Error {
  readonly status: number
  readonly erros?: Record<string, string>

  constructor(problema: ProblemDetail) {
    super(problema.detail ?? problema.title)
    this.name = 'ErroApi'
    this.status = problema.status
    this.erros = problema.erros
  }
}

async function requisicao<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const resposta = await fetch(`/api${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...opcoes.headers,
    },
  })

  if (!resposta.ok) {
    let problema: ProblemDetail
    try {
      problema = (await resposta.json()) as ProblemDetail
    } catch {
      problema = { status: resposta.status, title: resposta.statusText || 'Erro na requisição' }
    }
    throw new ErroApi(problema)
  }

  if (resposta.status === 204) {
    return undefined as T
  }
  return (await resposta.json()) as T
}

export const api = {
  listarVrfs: () => requisicao<Vrf[]>('/vrfs'),
}