import React from 'react';
import { motion } from 'framer-motion';
import { colors, fonts } from '../../styles/theme';

export default function EmailMockupSection() {
  return (
    <section id="email-mockup" style={{ padding: '140px 20px', maxWidth: '1200px', margin: '0 auto', background: 'transparent' }}>
      <div style={{ background: '#0D3322', borderRadius: '40px', padding: '80px 60px', overflow: 'hidden', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.2)' }}>
        
        {/* Decorative background light */}
        <div style={{ 
          position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', 
          background: 'radial-gradient(circle, rgba(212, 136, 10, 0.05) 0%, transparent 70%)',
          zIndex: 0
        }}></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center', position: 'relative', zIndex: 1 }}
        >
          {/* LEFT: Phone Mockup (Email Style) */}
          <div style={{ position: 'relative', justifySelf: 'center' }}>
            <div style={{ 
              width: '300px', height: '600px', background: '#000', borderRadius: '45px', border: '10px solid #1f1f1f', 
              overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,0.5)', position: 'relative'
            }}>
              {/* Notch */}
              <div style={{ 
                position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
                width: '120px', height: '25px', background: '#1f1f1f', 
                borderRadius: '0 0 15px 15px', zIndex: 10
              }}></div>

              {/* Screen Content */}
              <div style={{ background: '#f5f5f5', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '45px 15px 15px', borderBottom: '1px solid #ddd', textAlign: 'center', fontSize: '11px', fontWeight: 800, color: '#333', backgroundColor: '#fff' }}>
                  NOVO POST AGENDADO
                </div>
                
                <div style={{ padding: '20px' }}>
                  <div style={{ background: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <div style={{ background: 'linear-gradient(135deg, #1a472a, #2d6a4f)', aspectRatio: '1.2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>👓</div>
                      <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: 700, marginBottom: '5px' }}>Sua Ótica</div>
                      <div style={{ color: colors.gold, fontSize: '13px', fontWeight: 800 }}>Dia das Mães 💝</div>
                    </div>

                    <div style={{ padding: '16px' }}>
                      <p style={{ fontSize: '11px', color: '#444', lineHeight: 1.6, marginBottom: '16px' }}>
                        "Mãe merece ver o mundo com mais beleza e clareza ✨ Presente certo para quem você mais ama."
                      </p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{ flex: 1, padding: '12px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '11px', cursor: 'pointer' }}>
                          ✓ APROVAR
                        </button>
                        <button style={{ flex: 1, padding: '12px', background: '#eee', color: '#666', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}>
                          ✗ REPROVAR
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Features */}
          <div>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '3rem', fontFamily: fonts.heading, color: 'white', marginBottom: '24px', lineHeight: 1.1 }}>
                Aprovação em <br />
                <span style={{ color: colors.gold }}>10 segundos</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '1.1rem' }}>
                Você recebe um e-mail com o post pronto. Vê a imagem, lê a legenda e toca Aprovar — sem abrir nenhum app ou senha.
              </p>
            </div>
            {[
              { icon: '📱', title: 'Funciona em qualquer celular', desc: 'Abre direto no email. Sem app para baixar ou senha para lembrar.' },
              { icon: '⚡', title: 'Reprovou? Nova versão em minutos', desc: 'O sistema gera automaticamente uma alternativa diferente.' },
              { icon: '🔒', title: 'Você sempre tem controle', desc: 'Nenhum post vai ao ar sem sua aprovação explícita.' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                <div style={{ fontSize: '1.8rem', flexShrink: 0, marginTop: '2px' }}>{f.icon}</div>
                <div>
                  <h4 style={{ color: 'white', fontWeight: 800, marginBottom: '6px', fontSize: '1.1rem' }}>{f.title}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
