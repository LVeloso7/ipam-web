import type {
  EnderecoIp, ProblemDetail, ProximoIp, Resumo, Secao, SubRede, Vrf, ResultadoBusca,
} from './tipos'

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
  buscar: (termo: string) =>
    requisicao<ResultadoBusca>(`/busca?q=${encodeURIComponent(termo)}`),

  resumo: () => requisicao<Resumo>('/painel/resumo'),

  listarVrfs: () => requisicao<Vrf[]>('/vrfs'),

  listarSecoes: () => requisicao<Secao[]>('/secoes'),
  buscarSecao: (id: number) => requisicao<Secao>(`/secoes/${id}`),
  listarSubRedesDaSecao: (secaoId: number) =>
    requisicao<SubRede[]>(`/secoes/${secaoId}/sub-redes`),

  buscarSubRede: (id: number) => requisicao<SubRede>(`/sub-redes/${id}`),
  listarCriticas: () => requisicao<SubRede[]>('/sub-redes/criticas'),

  listarIpsDaSubRede: (subRedeId: number) =>
    requisicao<EnderecoIp[]>(`/sub-redes/${subRedeId}/ips`),
  proximoIpLivre: (subRedeId: number) =>
    requisicao<ProximoIp>(`/sub-redes/${subRedeId}/ips/proximo-livre`),
  listarFilhas: (id: number) => requisicao<SubRede[]>(`/sub-redes/${id}/filhas`), 
}

// Converte qualquer erro capturado numa mensagem para o usuário.
export function mensagemDeErro(e: unknown): string {
  return e instanceof ErroApi ? e.message : 'Não foi possível conectar à API. Verifique se o backend está rodando.'
}