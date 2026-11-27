import { useEffect, useState } from 'react'
import { mensagemDeErro } from './api/cliente'

interface Estado<T> {
  dados: T | null
  carregando: boolean
  erro: string | null
}

// Busca dados quando as dependências mudam, ignorando respostas de buscas anteriores.
export function useCarregar<T>(carregar: () => Promise<T>, dependencias: unknown[]): Estado<T> {
  const [estado, setEstado] = useState<Estado<T>>({ dados: null, carregando: true, erro: null })

  useEffect(() => {
    let cancelado = false
    setEstado((anterior) => ({ ...anterior, carregando: true, erro: null }))

    carregar()
      .then((dados) => {
        if (!cancelado) setEstado({ dados, carregando: false, erro: null })
      })
      .catch((e: unknown) => {
        if (!cancelado) setEstado({ dados: null, carregando: false, erro: mensagemDeErro(e) })
      })

    return () => {
      cancelado = true
    }
    // As dependências são definidas por quem chama o hook.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias)

  return estado
}