import React from 'react';
import { motion } from 'framer-motion';

const colors = {
  dark: '#0B1F0F', primary: '#0D3322', gold: '#D4880A',
  goldLight: '#F5A623', white: '#FFFFFF', textMuted: 'rgba(255,255,255,0.7)',
  glass: 'rgba(255,255,255,0.05)', border: 'rgba(212,136,10,0.2)',
};

const stats = [
  { number: '80', unit: '%', desc: 'dos consumidores pesquisam no Instagram antes de visitar uma loja local' },
  { number: '73', unit: '%', desc: 'das pequenas empresas não postam com consistência por falta de tempo' },
  { number: 'R$1.200', unit: '', desc: 'é o mínimo que uma agência cobra por mês — inviável para quem fatura R$15k' },
];

export default function ProblemSection() {
  return (
    <section id="problema" style={{ padding: '120px 20px', maxWidth: '1100px', margin: '0 auto', background: 'transparent' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 style={{ fontSize: '2.8rem', marginBottom: '16px', fontFamily: "'Playfair Display', serif", color: 'white' }}>
          O problema que <span style={{ color: colors.gold }}>todo pequeno negócio</span> tem
        </h2>
        <p style={{ color: colors.textMuted, fontSize: '1.1rem', marginBottom: '60px' }}>
          Não é falta de produto bom. É falta de presença consistente.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          {stats.map((s, i) => (
            <motion.div key={i} whileHover={{ y: -6 }} style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '32px 24px',
              textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              border: '1px solid rgba(212,136,10,0.2)',
              borderTop: `4px solid ${colors.gold}`,
            }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                <span style={{ color: colors.gold }}>{s.number}</span>{s.unit}
              </div>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', marginTop: '12px', lineHeight: 1.6 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <div style={{
          background: 'rgba(212,136,10,0.08)', border: `1px solid ${colors.border}`,
          borderLeft: `4px solid ${colors.gold}`, borderRadius: '12px', padding: '24px 28px',
          display: 'flex', gap: '16px', alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <div>
            <h4 style={{ color: colors.goldLight, marginBottom: '8px', fontSize: '1rem', fontWeight: 800 }}>
              O paradoxo cruel do pequeno negócio
            </h4>
            <p style={{ color: colors.textMuted, fontSize: '0.95rem', lineHeight: 1.7 }}>
              Quem mais precisa de marketing é quem menos tem tempo e dinheiro para ele.
              Um perfil parado no Instagram não é neutro — é sinal de que o negócio pode estar fechado.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
