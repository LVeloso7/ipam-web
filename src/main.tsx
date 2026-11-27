import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import '@fontsource-variable/ibm-plex-sans'
import './index.css'
import { PaginaBusca } from './paginas/PaginaBusca'
import { Layout } from './components/Layout'
import { PaginaNaoEncontrada } from './paginas/PaginaNaoEncontrada'
import { PaginaPainel } from './paginas/PaginaPainel'
import { PaginaSecao } from './paginas/PaginaSecao'
import { PaginaSubRede } from './paginas/PaginaSubRede'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'busca', element: <PaginaBusca /> },
      { index: true, element: <PaginaPainel /> },
      { path: 'secoes/:secaoId', element: <PaginaSecao /> },
      { path: 'sub-redes/:subRedeId', element: <PaginaSubRede /> },
      { path: '*', element: <PaginaNaoEncontrada /> },
    ],
  },
])

const raiz = document.getElementById('root')
if (!raiz) throw new Error('Elemento #root não encontrado no index.html')

createRoot(raiz).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)