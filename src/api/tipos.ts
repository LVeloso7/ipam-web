export interface Vrf {
  id: number
  nome: string
  rd: string | null
  descricao: string | null
}

export interface Secao {
  id: number
  nome: string
  descricao: string | null
}

// Total e ocupados vêm como texto: redes IPv6 passam do limite de precisão do Number.
export interface Ocupacao {
  total: string
  ocupados: string
  percentual: number
}

export interface SubRede {
  id: number
  vrfId: number
  vrfNome: string
  secaoId: number
  secaoNome: string
  cidr: string
  paiId: number | null
  vlanId: number | null
  vlanNumero: number | null
  vlanNome: string | null
  unidade: string | null
  descricao: string | null
  criadoEm: string
  criadoPor: string
  ocupacao: Ocupacao
}

export type StatusIp = 'EM_USO' | 'RESERVADO' | 'DHCP'

export interface EnderecoIp {
  id: number
  vrfId: number
  vrfNome: String
  subRedeId: number
  subRedeCidr: string
  endereco: string
  hostname: string | null
  mac: string | null
  status: StatusIp
  descricao: string | null
  criadoEm: string
  criadoPor: string
  atualizadoEm: string | null
  atualizadoPor: string | null
}

export interface ProximoIp {
  subRedeId: number
  cidr: string
  endereco: string
}

export interface Resumo {
  vrfs: number
  secoes: number
  subRedes: number
  vlans: number
  enderecosIp: number
}

export interface ProblemDetail {
  status: number
  title: string
  detail?: string
  instance?: string
  erros?: Record<string, string>
}

export type TipoBusca = 'IP' | 'CIDR' | 'PREFIXO' | 'TEXTO'

export interface ResultadoBusca {
  termo: string
  tipo: TipoBusca
  subRedes: SubRede[]
  enderecos: EnderecoIp[]
}