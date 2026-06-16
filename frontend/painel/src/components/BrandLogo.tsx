interface BrandLogoProps { onDark?: boolean }

export function BrandLogo({ onDark = false }: BrandLogoProps) {
  return (
    <span className={`brand-logo ${onDark ? 'on-dark' : ''}`}>
      <span className={`brand-seal ${onDark ? 'on-dark' : ''}`}>DL</span>
      <span className="brand-words">
        <span className="name">Di <em>Lorenzo</em></span>
        <span className="kicker">@oticadilorenzo</span>
      </span>
    </span>
  );
}
