import React from 'react';
import logoLight from '../assets/bilar-logo-light.webp';
import logoDark from '../assets/bilar-logo-dark.webp';

interface BilarLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  theme?: 'dark' | 'light';
}

/**
 * Logo oficial da Bilar, exportada a partir dos assets SVG actuais e optimizada
 * para produção. Mantém transparência e adaptação responsiva, sem injectar
 * milhares de nós SVG no DOM.
 */
export const BilarLogo: React.FC<BilarLogoProps> = ({
  size = 'md',
  className = '',
  theme = 'light',
}) => {
  const widths = { sm: 188, md: 258, lg: 370, xl: 500 } as const;
  const src = theme === 'dark' ? logoDark : logoLight;

  return (
    <span
      className={`bilar-logo bilar-logo-${size} bilar-logo-${theme} ${className}`}
      aria-label="Bilar DigitalTech Solutions"
      role="img"
      style={{ display: 'inline-flex', width: `min(100%, ${widths[size]}px)`, maxWidth: '100%', lineHeight: 0 }}
    >
      <img src={src} alt="Bilar DigitalTech Solutions" decoding="async" draggable={false} />
    </span>
  );
};
