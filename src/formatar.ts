const formatoData = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

// O backend envia o horário com nanossegundos ("...39.490537098Z").
// O padrão de datas do JavaScript só garante a leitura de até 3 casas decimais.
export function formatarData(iso: string): string {
  const normalizado = iso.replace(/(\.\d{3})\d+/, '$1')
  return formatoData.format(new Date(normalizado))
}