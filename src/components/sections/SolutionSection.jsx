import React from 'react';
import { motion } from 'framer-motion';
import { colors, fonts } from '../../styles/theme';

const steps = [
  { num: '1', time: '08h00', title: 'Sistema gera o post do dia automaticamente', desc: 'IA analisa a data, o calendário de datas comemorativas e o histórico de posts aprovados. Gera a legenda e compõe a imagem com a identidade visual da ótica.' },
  { num: '2', time: '09h00', title: 'Você recebe e-mail com preview para aprovar', desc: 'E-mail com a imagem do post, a legenda gerada e os botões Aprovar e Reprovar. Tudo visível no celular sem precisar abrir nenhum app.' },
  { num: '3', time: '10 seg', title: 'Aprovação em 10 segundos — ou geração de nova opção', desc: 'Toca Aprovar e está feito. Tocou Reprovar? O sistema gera um post diferente imediatamente, com outros assets e outra legenda.' },
  { num: '4', time: '18h00', title: 'Post publicado automaticamente no horário certo', desc: 'Instagram Graph API oficial posta na conta do cliente no horário de maior engajamento para o segmento.' },
];

export default function SolutionSection() {
  return (
    <section id="solucao" style={{ padding: '140px 20px', maxWidth: '1100px', margin: '0 auto', background: 'transparent' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '16px', fontFamily: fonts.heading, color: 'white' }}>
            Como o <span style={{ color: colors.gold }}>Projeto</span> funciona
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>
            Você foca no negócio. O sistema cuida do Instagram.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '25px',
                background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px 40px',
                border: '1px solid rgba(255,255,255,0.05)',
                borderLeft: `6px solid ${colors.gold}`,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%', background: colors.gold,
                color: '#0B1F0F', fontSize: '1.1rem', fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{s.num}</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', marginBottom: '6px' }}>{s.title}</h4>
                <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
              <div style={{
                background: 'rgba(212,136,10,0.15)', color: colors.gold, fontSize: '0.75rem', fontWeight: 800,
                padding: '6px 16px', borderRadius: '50px', alignSelf: 'center', flexShrink: 0,
                textTransform: 'uppercase', letterSpacing: '1px'
              }}>{s.time}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
