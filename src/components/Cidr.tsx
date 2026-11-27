interface Props {
  cidr: string
}

export function Cidr({ cidr }: Props) {
  const [rede, mascara] = cidr.split('/')
  return (
    <>
      {rede}
      <span className="cidr__mascara">/{mascara}</span>
    </>
  )
}