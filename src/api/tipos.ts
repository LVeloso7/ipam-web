export interface Vrf {
  id: number
  nome: string
  rd: string | null
  descricao: string | null
}

// Formato de erro padronizado da API (RFC 9457).
export interface ProblemDetail {
  status: number
  title: string
  detail?: string
  instance?: string
  erros?: Record<string, string>
}