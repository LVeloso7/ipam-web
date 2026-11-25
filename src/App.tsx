import { useEffect, useState } from 'react'
import { api, ErroApi } from './api/cliente'
import type { Vrf } from './api/tipos'

export default function App() {
  const [vrfs, setVrfs] = useState<Vrf[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    api.listarVrfs()
      .then(setVrfs)
      .catch((e: unknown) =>
        setErro(e instanceof ErroApi ? e.message : 'Falha ao conectar com a API'))
      .finally(() => setCarregando(false))
  }, [])

  if (carregando) return <p>Carregando...</p>
  if (erro) return <p role="alert">Erro: {erro}</p>

  return (
    <main>
      <h1>IPAM</h1>
      <h2>VRFs</h2>
      <ul>
        {vrfs.map((vrf) => (
          <li key={vrf.id}>
            {vrf.nome}
            {vrf.descricao && ` — ${vrf.descricao}`}
          </li>
        ))}
      </ul>
    </main>
  )
}