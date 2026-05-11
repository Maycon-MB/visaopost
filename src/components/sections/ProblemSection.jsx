import React from 'react';
import { motion } from 'framer-motion';
import { colors, fonts } from '../../styles/theme';

const stats = [
  { number: '80', unit: '%', desc: 'dos consumidores pesquisam no Instagram antes de visitar uma loja local' },
  { number: '73', unit: '%', desc: 'das pequenas empresas não postam com consistência por falta de tempo' },
  { number: 'R$1.200', unit: '', desc: 'é o mínimo que uma agência cobra por mês — inviável para quem fatura R$15k' },
];

export default function ProblemSection() {
  return (
    <section id="problemas" style={{ padding: '140px 20px', maxWidth: '1100px', margin: '0 auto', background: 'transparent' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '16px', fontFamily: fonts.heading, color: 'white' }}>
            O problema que <span style={{ color: colors.gold }}>todo pequeno negócio</span> tem
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>
            Não é falta de produto bom. É falta de presença consistente.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '60px' }}>
          {stats.map((s, i) => (
            <motion.div key={i} whileHover={{ y: -10 }} style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '40px 30px',
              textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid rgba(212,136,10,0.1)',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: colors.gold }}></div>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                <span style={{ color: colors.gold }}>{s.number}</span>{s.unit}
              </div>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', marginTop: '20px', lineHeight: 1.6 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <div style={{
          background: 'rgba(212,136,10,0.08)', border: `1px solid rgba(212,136,10,0.2)`,
          borderLeft: `4px solid ${colors.gold}`, borderRadius: '16px', padding: '30px 35px',
          display: 'flex', gap: '20px', alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '2rem' }}>⚠️</span>
          <div>
            <h4 style={{ color: colors.gold, marginBottom: '8px', fontSize: '1.1rem', fontWeight: 800 }}>
              O paradoxo cruel do pequeno negócio
            </h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.7 }}>
              Quem mais precisa de marketing é quem menos tem tempo e dinheiro para ele.
              Um perfil parado no Instagram não é neutro — é sinal de que o negócio pode estar fechado.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
