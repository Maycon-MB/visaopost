import React from 'react';
import { motion } from 'framer-motion';

export default function EmailMockupSection() {
  const gold = '#D4880A';
  const messages = [
    { from: 'VisaoPost', to: 'dilorenzo@otica.com.br', subject: '✅ Aprovação necessária: Post de amanhã — Dia das Mães', time: '09:12' },
  ];

  return (
    <section id="email" style={{
      background: 'transparent',
      padding: '100px 20px',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          {/* LEFT: email mockup */}
          <div>
            {/* Phone frame */}
            <div style={{
              background: '#1a1a1a', borderRadius: '32px', padding: '20px 12px',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6)', maxWidth: '320px', margin: '0 auto',
            }}>
              {/* Status bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px 12px', fontSize: '11px', color: '#aaa' }}>
                <span>9:12</span><span>●●●</span>
              </div>
              {/* Email card */}
              <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ background: '#F0F4FF', padding: '12px 16px', borderBottom: '1px solid #E0E0E0' }}>
                  <div style={{ fontSize: '10px', color: '#888', marginBottom: '2px' }}>De: noreply@visaopost.com.br</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1a1a1a' }}>✅ Aprovação: Post de amanhã</div>
                  <div style={{ fontSize: '10px', color: '#D4880A', fontWeight: 600 }}>Dia das Mães — 10 de Maio</div>
                </div>
                {/* Post preview */}
                <div style={{ background: 'linear-gradient(135deg, #1a472a, #2d6a4f)', aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>👓</div>
                  <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Ótica Di Lorenzo</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>Presente perfeito para a mamãe</div>
                  <div style={{ color: gold, fontSize: '12px', fontWeight: 800, marginTop: '8px' }}>Dia das Mães 💝</div>
                </div>
                {/* Caption */}
                <div style={{ padding: '12px 16px' }}>
                  <p style={{ fontSize: '10px', color: '#444', lineHeight: 1.6, marginBottom: '12px' }}>
                    "Mãe merece ver o mundo com mais beleza e clareza ✨ Na Ótica Di Lorenzo, presente certo para quem você mais ama. Armações exclusivas, lentes premium e exame grátis! 👓 #DiasDasMães"
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ flex: 1, padding: '10px', background: '#25D366', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}>
                      ✓ APROVAR
                    </button>
                    <button style={{ flex: 1, padding: '10px', background: '#F5F5F5', color: '#666', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '11px', cursor: 'pointer' }}>
                      ✗ REPROVAR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: features */}
          <div>
            <h2 style={{ fontSize: '2.4rem', fontFamily: "'Playfair Display', serif", color: 'white', marginBottom: '16px' }}>
              Aprovação em <span style={{ color: gold }}>10 segundos</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: '32px', fontSize: '1rem' }}>
              Você recebe um e-mail com o post pronto para o dia seguinte.
              Vê a imagem, lê a legenda e toca Aprovar — sem abrir nenhum app, sem senha, sem complicação.
            </p>
            {[
              { icon: '📱', title: 'Funciona em qualquer celular', desc: 'Abre direto no email. Sem app para baixar ou senha para lembrar.' },
              { icon: '⚡', title: 'Reprovou? Nova versão em minutos', desc: 'O sistema gera automaticamente uma alternativa diferente.' },
              { icon: '🔒', title: 'Você sempre tem controle', desc: 'Nenhum post vai ao ar sem sua aprovação explícita.' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '1.6rem', flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '4px', fontSize: '0.95rem' }}>{f.title}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
