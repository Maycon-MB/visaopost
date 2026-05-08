import React from 'react';
import { motion } from 'framer-motion';

const colors = { gold: '#D4880A', goldLight: '#F5A623', textMuted: 'rgba(255,255,255,0.7)' };

const dates = [
  { date: '14 Fev', name: 'Valentine\'s Day', desc: 'Post de óculos românticos e promoção especial para casais.' },
  { date: '08 Mar', name: 'Dia da Mulher', desc: 'Armações femininas em destaque. Conteúdo de empoderamento.' },
  { date: '10 Mai', name: 'Dia das Mães', desc: 'A data mais importante para óticas. Campanha completa.' },
  { date: '12 Jun', name: 'Dia dos Namorados', desc: 'Promoção especial. Post de casais com óculos combinando.' },
  { date: '09 Ago', name: 'Dia dos Pais', desc: 'Armações masculinas. Campanha de presente perfeito.' },
  { date: '07 Set', name: 'Independência', desc: 'Conteúdo patriótico + campanha de óculos de sol.' },
  { date: '12 Out', name: 'Dia das Crianças', desc: 'Óculos infantis. Post sobre proteção UV para crianças.' },
  { date: '15 Nov', name: 'Black Friday Ótica', desc: 'A maior semana de vendas do ano. Campanha preparada com antecedência.' },
];

export default function CalendarSection() {
  return (
    <section id="calendario" style={{ padding: '100px 20px', maxWidth: '1100px', margin: '0 auto', background: 'transparent' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 style={{ fontSize: '2.8rem', marginBottom: '16px', fontFamily: "'Playfair Display', serif", color: 'white' }}>
          Calendário <span style={{ color: colors.gold }}>estratégico</span> incluso
        </h2>
        <p style={{ color: colors.textMuted, fontSize: '1.1rem', marginBottom: '48px' }}>
          Nunca mais perca uma data importante. O sistema prepara as campanhas com antecedência automaticamente.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {dates.map((d, i) => (
            <motion.div key={i} whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(212,136,10,0.2)' }}
              style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '22px',
                border: '1px solid rgba(255,255,255,0.05)',
                borderTop: `3px solid ${colors.gold}`, boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}>
              <div style={{
                display: 'inline-block', background: 'rgba(212,136,10,0.1)',
                color: colors.gold, fontSize: '11px', fontWeight: 700,
                padding: '3px 10px', borderRadius: '20px', marginBottom: '10px', letterSpacing: '0.5px',
              }}>{d.date}</div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>{d.name}</h4>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{d.desc}</p>
            </motion.div>
          ))}
        </div>

        <div style={{
          marginTop: '32px', background: 'rgba(212,136,10,0.08)', border: '1px solid rgba(212,136,10,0.2)',
          borderRadius: '12px', padding: '18px 24px', textAlign: 'center',
        }}>
          <p style={{ color: colors.textMuted, fontSize: '0.9rem' }}>
            🗓️ <strong style={{ color: colors.goldLight }}>+30 datas comemorativas brasileiras</strong> incluídas automaticamente no calendário anual
          </p>
        </div>
      </motion.div>
    </section>
  );
}
