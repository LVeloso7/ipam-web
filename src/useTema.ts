import { useEffect, useState } from 'react'

export type Tema = 'claro' | 'escuro'

function temaAtual(): Tema {
  return document.documentElement.dataset.tema === 'escuro' ? 'escuro' : 'claro'
}

export function useTema() {
  const [tema, setTema] = useState<Tema>(temaAtual)

  useEffect(() => {
    document.documentElement.dataset.tema = tema
    try {
      localStorage.setItem('ipam-tema', tema)
    } catch {
      // Navegação privada pode bloquear o armazenamento; o tema vale só para esta sessão.
    }
  }, [tema])

  const alternar = () => setTema((atual) => (atual === 'claro' ? 'escuro' : 'claro'))

  return { tema, alternar }
}