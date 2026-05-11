import React from 'react';
import { motion } from 'framer-motion';
import { colors } from '../../styles/theme';

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
      background: 'transparent', padding: '140px 20px',
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
            <div style={{ background: '#F0FFF4', border: '1px solid rgba(0,200,83,0.2)', borderRadius: '16px', padding: '28px' }}>
              <h3 style={{ color: '#25D366', fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
                ✓ Crescimento orgânico real
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {good.map((item, i) => (
                  <li key={i} style={{ color: 'rgba(0,0,0,0.7)', fontSize: '0.95rem', padding: '9px 0', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: '10px' }}>
                    <span style={{ color: '#25D366', flexShrink: 0 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <section id="fake" style={{ padding: '140px 20px', maxWidth: '1100px', margin: '0 auto', background: 'transparent' }}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{
              background: 'rgba(255, 59, 48, 0.03)', border: '1px solid rgba(255, 59, 48, 0.1)',
              padding: '60px', borderRadius: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.1 }}>
                <AlertTriangle size={120} color="#ff3b30" />
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30',
                  padding: '8px 16px', borderRadius: '50px', fontSize: '0.8rem',
                  fontWeight: '800', marginBottom: '24px', textTransform: 'uppercase'
                }}>
                  <ShieldAlert size={14} /> Alerta Meta 2026
                </div>

                <h2 style={{ fontSize: '2.8rem', fontFamily: "'Playfair Display', serif", marginBottom: '24px', color: '#1A2E1C' }}>
                  O fim da era dos <span style={{ color: '#ff3b30' }}>seguidores comprados</span>
                </h2>

                <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 40px', lineHeight: 1.7 }}>
                  A Meta anunciou o maior "expurgo" de contas inativas da história para 2026. Perfis que utilizam bots perderão autoridade e podem ser banidos permanentemente. 
                  Óticas que compraram seguidores estão vendo seus números despencarem e, pior, perdendo o acesso às contas permanentemente. 
                  <strong> Não arrisque o futuro da sua empresa em uma estratégia que está morrendo.</strong>
                </p>
              </div>
            </motion.div>
          </section>
        </motion.div>
      </div>
    </section>
  );
}
