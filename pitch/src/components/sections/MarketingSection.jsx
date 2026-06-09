import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Clock, DollarSign, ShieldAlert, Check, X, Building, Zap } from 'lucide-react';
import { colors, radii, fonts } from '../../styles/theme';

export default function MarketingSection() {
  const comparisons = [
    {
      title: 'Contratar um Social Media',
      cost: 'R$ 2.500+ /mês',
      items: [
        { text: 'Posta 3x por semana (se lembrar)', icon: <Clock size={16} />, bad: true },
        { text: 'Não entende de lentes e armações', icon: <X size={16} />, bad: true },
        { text: 'Resposta lenta no direct (perda de leads)', icon: <X size={16} />, bad: true },
        { text: 'Custo fixo alto + Encargos trabalhistas', icon: <DollarSign size={16} />, bad: true },
        { text: 'Sem garantia de ROI ou estratégia', icon: <ShieldAlert size={16} />, bad: true }
      ],
      isRecommended: false
    },
    {
      title: 'Consultoria Projeto',
      cost: 'R$ 297 /mês',
      items: [
        { text: 'Presença 24h (Stories e Feed Estratégico)', icon: <Zap size={16} /> },
        { text: 'Especialistas em mercado óptico de luxo', icon: <Check size={16} /> },
        { text: 'Automação de vendas humana e imediata', icon: <Check size={16} /> },
        { text: 'Dashboards de performance em tempo real', icon: <TrendingUp size={16} /> },
        { text: 'Exclusividade territorial (1 por bairro)', icon: <Building size={16} /> }
      ],
      isRecommended: true
    }
  ];

  return (
    <section id="marketing" style={{ padding: '140px 20px', background: 'transparent' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', borderRadius: '50px', backgroundColor: 'rgba(212, 136, 10, 0.1)',
            border: `1px solid ${colors.gold}`, color: colors.gold,
            fontSize: '0.8rem', fontWeight: '800', marginBottom: '20px', textTransform: 'uppercase'
          }}>
            <ShieldAlert size={14} /> Exclusividade: Apenas 1 ótica por bairro
          </div>
          <h2 style={{ fontSize: '3rem', color: 'white', fontFamily: fonts.heading, marginBottom: '20px' }}>
            Quanto custa <span style={{ color: colors.gold }}>não ter</span> a Projeto?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
            Não importa se você tem 200 ou 20.000 seguidores. O que importa é a <strong>percepção de valor</strong> de quem entra no seu perfil hoje.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', marginBottom: '80px' }}>
          {comparisons.map((col, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                padding: '50px 40px',
                borderRadius: '32px',
                background: col.isRecommended ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                border: col.isRecommended ? `2px solid ${colors.gold}` : '1px solid rgba(255,255,255,0.05)',
                boxShadow: col.isRecommended ? '0 30px 60px rgba(0,0,0,0.2)' : 'none',
                position: 'relative'
              }}
            >
              {col.isRecommended && (
                <div style={{
                  position: 'absolute', top: '24px', right: '40px', background: colors.gold,
                  color: '#0B1F0F', padding: '4px 12px', borderRadius: '6px',
                  fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase'
                }}>Sua Melhor Escolha</div>
              )}
              <h3 style={{ color: col.isRecommended ? colors.gold : 'white', marginBottom: '10px', fontSize: '1.2rem', fontWeight: '800' }}>{col.title}</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', marginBottom: '40px' }}>{col.cost}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {col.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>
                    <span style={{ color: item.bad ? '#ff453a' : (col.isRecommended ? colors.gold : '#32d74b') }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Autoridade Banner */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          padding: '60px',
          borderRadius: '32px',
          border: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          position: 'relative'
        }}>
          <h3 style={{ color: 'white', fontSize: '2.2rem', marginBottom: '20px', fontFamily: fonts.heading }}>Autoridade Imediata</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '850px', margin: '0 auto 40px' }}>
            Nossa estratégia para perfis novos foca em transformar visitantes em clientes. <strong>Seguidores são números, vendas são boletos pagos.</strong>
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '60px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: colors.gold, fontSize: '3rem', fontWeight: '900', margin: 0 }}>10x</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginTop: '5px' }}>Mais profissionalismo</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: colors.gold, fontSize: '3rem', fontWeight: '900', margin: 0 }}>100%</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginTop: '5px' }}>Consistência Ativa</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: colors.gold, fontSize: '3rem', fontWeight: '900', margin: 0 }}>+800</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginTop: '5px' }}>Novas visitas locais</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
