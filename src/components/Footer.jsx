import React from 'react';
import { colors, fonts } from '../styles/theme';
import { Instagram, Mail, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ padding: '60px 20px', background: 'transparent' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
          </div>
        </div>

        <div style={{ textAlign: 'center', opacity: 0.6 }}>
          <p style={{ color: colors.textMuted, fontSize: '0.8rem' }}>
            © 2026 Projeto — Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
