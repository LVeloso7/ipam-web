import type { StatusIp } from '../api/tipos'

const ROTULOS: Record<StatusIp, string> = {
  EM_USO: 'Em uso',
  RESERVADO: 'Reservado',
  DHCP: 'DHCP',
}

export function SeloStatus({ status }: { status: StatusIp }) {
  return <span className={`selo selo--${status.toLowerCase()}`}>{ROTULOS[status]}</span>
}