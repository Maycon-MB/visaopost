import React from 'react';
import { motion } from 'framer-motion';

const colors = {
  gold: '#D4880A', goldLight: '#F5A623', primary: '#0D3322',
  textMuted: 'rgba(255,255,255,0.7)', glass: 'rgba(255,255,255,0.05)',
};

const steps = [
  { num: '1', time: '08h00', title: 'Sistema gera o post do dia automaticamente', desc: 'IA analisa a data, o calendário de datas comemorativas e o histórico de posts aprovados. Gera a legenda e compõe a imagem com a identidade visual da ótica.' },
  { num: '2', time: '09h00', title: 'Você recebe e-mail com preview para aprovar', desc: 'E-mail com a imagem do post, a legenda gerada e os botões Aprovar e Reprovar. Tudo visível no celular sem precisar abrir nenhum app.' },
  { num: '3', time: '10 seg', title: 'Aprovação em 10 segundos — ou geração de nova opção', desc: 'Toca Aprovar e está feito. Tocou Reprovar? O sistema gera um post diferente imediatamente, com outros assets e outra legenda.' },
  { num: '4', time: '18h00', title: 'Post publicado automaticamente no horário certo', desc: 'Instagram Graph API oficial posta na conta do cliente no horário de maior engajamento para o segmento.' },
];

export default function SolutionSection() {
  return (
    <section id="solucao" style={{ padding: '120px 20px', maxWidth: '1100px', margin: '0 auto', background: 'transparent' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 style={{ fontSize: '2.8rem', marginBottom: '16px', fontFamily: "'Playfair Display', serif", color: 'white' }}>
          Como o <span style={{ color: colors.gold }}>VisaoPost</span> funciona
        </h2>
        <p style={{ color: colors.textMuted, fontSize: '1.1rem', marginBottom: '60px' }}>
          Você foca no negócio. O sistema cuida do Instagram.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '20px',
                background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '24px 28px',
                border: '1px solid rgba(255,255,255,0.05)',
                borderLeft: `4px solid ${colors.gold}`,
              }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', background: colors.gold,
                color: colors.dark, fontSize: '14px', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{s.num}</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>{s.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>{s.desc}</p>
              </div>
              <div style={{
                background: 'rgba(212,136,10,0.1)', color: colors.goldLight, fontSize: '11px', fontWeight: 600,
                padding: '4px 12px', borderRadius: '20px', alignSelf: 'center', flexShrink: 0,
              }}>{s.time}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
