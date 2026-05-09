import React from 'react';
import { motion } from 'framer-motion';

const bad = [
  'Contas falsas que nunca compram nada',
  'Instagram detecta inflação artificial por IA',
  'Alcance orgânico cai drasticamente após detecção',
  'Risco real de ban permanente da conta',
  'Engajamento baixíssimo delata o perfil para clientes reais',
  '1.000 seguidores falsos = R$0 em vendas',
];
const good = [
  'Pessoas que moram na cidade e podem ir à loja',
  'Engajamento real aumenta o alcance gratuitamente',
  'Algoritmo favorece contas com conteúdo consistente',
  'Cada seguidor é um cliente em potencial',
  'Credibilidade real com quem visita o perfil',
  '100 seguidores reais > 10.000 bots',
];

export default function FakeFollowersSection() {
  return (
    <section id="seguidores" style={{
      background: 'transparent', padding: '120px 20px',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: '2.8rem', marginBottom: '16px', fontFamily: "'Playfair Display', serif", color: 'white' }}>
            Por que <span style={{ color: '#FF6B6B' }}>comprar seguidores é uma armadilha</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', marginBottom: '48px' }}>
            Parece solução rápida. Na prática, pode destruir o perfil que levou anos para construir.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            {/* BAD */}
            <div style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.3)', borderRadius: '16px', padding: '28px' }}>
              <h3 style={{ color: '#FF6B6B', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
                ✗ Seguidores comprados (bots)
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {bad.map((item, i) => (
                  <li key={i} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '10px' }}>
                    <span style={{ color: '#FF6B6B', flexShrink: 0 }}>✗</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* GOOD */}
            <div style={{ background: 'rgba(0,200,83,0.08)', border: '1px solid rgba(0,200,83,0.3)', borderRadius: '16px', padding: '28px' }}>
              <h3 style={{ color: '#25D366', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
                ✓ Crescimento orgânico real
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {good.map((item, i) => (
                  <li key={i} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '10px' }}>
                    <span style={{ color: '#25D366', flexShrink: 0 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.3)', borderRadius: '12px', padding: '20px 24px', display: 'flex', gap: '16px' }}>
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>⚠️</span>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Em 2024, o Instagram removeu <strong style={{ color: '#FF6B6B' }}>mais de 6 bilhões de contas falsas</strong> globalmente.
              Perfis flagrados tiveram redução de até <strong style={{ color: '#FF6B6B' }}>70% no alcance orgânico permanentemente</strong>.
              O risco não é perder os seguidores comprados — é perder o perfil inteiro.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
