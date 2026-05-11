import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { colors, fonts } from '../../styles/theme';
import { Check, ShieldCheck, Info, MoreHorizontal } from 'lucide-react';
import { plans } from '../../data/content';
import ValueDetailModal from '../ValueDetailModal';

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <section id="planos" style={{ padding: '140px 20px', maxWidth: '1100px', margin: '0 auto', background: 'transparent' }}>
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h2 style={{ fontSize: '3.5rem', fontFamily: "'Playfair Display', serif", marginBottom: '20px', color: '#1A2E1C' }}>
          Investimento <span style={{ color: colors.gold }}>Exclusivo</span>
        </h2>
        <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Uma fração do custo de um funcionário, com 10x mais inteligência e consistência.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', justifyContent: 'center' }}>
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: 'white',
              padding: '60px 40px',
              borderRadius: '32px',
              border: plan.name.includes('Premium') ? `2px solid ${colors.gold}` : '1px solid rgba(0,0,0,0.05)',
              boxShadow: plan.name.includes('Premium') ? '0 40px 100px rgba(212,136,10,0.1)' : '0 20px 40px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {plan.name.includes('Premium') && (
              <div style={{
                position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)',
                background: colors.gold, color: 'white', padding: '6px 20px',
                borderRadius: '50px', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase'
              }}>
                Consultoria + Software
              </div>
            )}
            
            <h3 style={{ 
              fontSize: '0.8rem', 
              fontWeight: '700', 
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: 'rgba(0,0,0,0.4)', 
              marginBottom: '12px',
              marginTop: plan.name.includes('Premium') ? '20px' : '0'
            }}>{plan.name}</h3>
            
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '1.2rem', color: '#1A2E1C', fontWeight: '700' }}>R$</span>
              <span style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1A2E1C', letterSpacing: '-2px' }}>{plan.price}</span>
              <span style={{ color: 'rgba(0,0,0,0.4)', fontSize: '1rem' }}>/mês</span>
            </div>
            
            <div style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.4)', marginBottom: '30px' }}>
              + R$ {plan.setup} no setup inicial
            </div>

            <div style={{
              marginBottom: '30px',
              padding: '20px',
              background: 'rgba(212, 136, 10, 0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(212, 136, 10, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Info size={16} style={{ color: colors.gold, marginTop: '2px', flexShrink: 0 }} />
                <p style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.7)', lineHeight: 1.5, margin: 0 }}>
                  {plan.maintenance}
                </p>
              </div>

              <button 
                onClick={() => setSelectedPlan(plan)}
                style={{
                  alignSelf: 'flex-end',
                  background: 'none',
                  border: 'none',
                  color: colors.gold,
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(212, 136, 10, 0.1)',
                  transition: '0.2s'
                }}
              >
                <MoreHorizontal size={14} /> Entenda o valor
              </button>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, flexGrow: 1 }}>
              {plan.features.map((feature, fIndex) => (
                <li key={fIndex} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'rgba(0,0,0,0.7)', fontSize: '1rem' }}>
                  <Check size={18} style={{ color: colors.gold, flexShrink: 0 }} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <ValueDetailModal 
        isOpen={!!selectedPlan} 
        onClose={() => setSelectedPlan(null)} 
        planName={selectedPlan?.name} 
      />
    </section>
  );
}
