import React from 'react';
import { motion } from 'framer-motion';
import { colors } from '../../styles/theme';

const numbers = [
  { value: '20+', label: 'posts/mês', sub: 'criados e publicados automaticamente' },
  { value: '10s', label: 'aprovação', sub: 'tempo médio para aprovar o post do dia' },
  { value: '3x', label: 'mais alcance', sub: 'posts com personagem da marca vs foto genérica' },
  { value: '0', label: 'apps para baixar', sub: 'tudo por e-mail e WhatsApp — zero fricção' },
];

export default function NumbersSection() {
  return (
    <section id="numeros" style={{ padding: '100px 20px', background: 'transparent' }}>
      <div style={{ 
        maxWidth: '1100px', margin: '0 auto', display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px',
        background: 'rgba(255,255,255,0.03)', padding: '60px', borderRadius: '32px',
        border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
      }}>
        {numbers.map((n, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} viewport={{ once: true }}
            style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '3.5rem', fontWeight: 900, color: colors.gold,
              lineHeight: 1, fontFamily: "'Playfair Display', serif",
            }}>{n.value}</div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem', margin: '8px 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{n.label}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.5 }}>{n.sub}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
