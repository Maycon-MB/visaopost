import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, fonts } from '../../styles/theme';
import { Check, ShieldCheck, Info, MoreHorizontal } from 'lucide-react';
import { plans } from '../../data/content';
import ValueDetailModal from '../ValueDetailModal';

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [hoveredInfoIndex, setHoveredInfoIndex] = useState(null);

  return (
    <section id="planos" style={{ padding: '140px 20px', maxWidth: '1100px', margin: '0 auto', background: 'transparent' }}>
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h2 style={{ fontSize: '3.5rem', fontFamily: "'Playfair Display', serif", marginBottom: '20px', color: 'white' }}>
          Investimento <span style={{ color: colors.gold }}>Exclusivo</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Uma fração do custo de um funcionário, com 10x mais inteligência e consistência.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', justifyContent: 'center' }}>
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -12, scale: 1.02, boxShadow: plan.name.includes('Premium') ? '0 50px 120px rgba(212,136,10,0.25)' : '0 40px 80px rgba(0,0,0,0.5)' }}
            viewport={{ once: true }}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '60px 40px',
              borderRadius: '32px',
              border: plan.name.includes('Premium') ? `2px solid ${colors.gold}` : '1px solid rgba(255,255,255,0.1)',
              boxShadow: plan.name.includes('Premium') ? '0 40px 100px rgba(212,136,10,0.15)' : '0 20px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              zIndex: hoveredInfoIndex === index ? 50 : 1,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {plan.name.includes('Premium') && (
              <div style={{
                position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)',
                background: colors.gold, color: '#0B1F0F', padding: '6px 20px',
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
              color: 'rgba(255,255,255,0.4)', 
              marginBottom: '12px',
              marginTop: plan.name.includes('Premium') ? '20px' : '0'
            }}>{plan.name}</h3>
            
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '1.2rem', color: 'white', fontWeight: '700' }}>R$</span>
              <span style={{ fontSize: '3.5rem', fontWeight: '900', color: 'white', letterSpacing: '-2px' }}>{plan.price}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem' }}>/mês</span>
            </div>
            
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', marginBottom: '30px' }}>
              + R$ {plan.setup} no setup inicial
            </div>

            <div style={{
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ position: 'relative' }}>
                <motion.div 
                  onMouseEnter={() => setHoveredInfoIndex(index)}
                  onMouseLeave={() => setHoveredInfoIndex(null)}
                  onClick={() => setHoveredInfoIndex(hoveredInfoIndex === index ? null : index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    cursor: 'help',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(212, 136, 10, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${colors.gold}44`
                  }}
                >
                  <Info size={16} color={colors.gold} />
                </motion.div>
                
                {/* Tooltip Content */}
                <AnimatePresence>
                  {hoveredInfoIndex === index && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, x: '-50%' }}
                      animate={{ opacity: 1, y: 0, x: '-50%' }}
                      exit={{ opacity: 0, y: 10, x: '-50%' }}
                      style={{
                        position: 'absolute',
                        bottom: '150%',
                        left: '50%',
                        width: '260px',
                        background: 'rgba(11, 31, 15, 0.95)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        padding: '18px',
                        borderRadius: '16px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        lineHeight: '1.6',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        zIndex: 9999,
                        border: `1px solid rgba(212, 136, 10, 0.3)`,
                        pointerEvents: 'none',
                        textAlign: 'center'
                      }}
                    >
                      {plan.maintenance}
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        marginLeft: '-8px',
                        borderWidth: '8px',
                        borderStyle: 'solid',
                        borderColor: `rgba(212, 136, 10, 0.3) transparent transparent transparent`
                      }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={() => setSelectedPlan(plan)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.gold,
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(212, 136, 10, 0.15)',
                  transition: '0.2s'
                }}
              >
                <MoreHorizontal size={14} /> Entenda o valor
              </button>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, flexGrow: 1 }}>
              {plan.features.map((feature, fIndex) => (
                <li key={fIndex} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>
                  <Check size={18} style={{ color: colors.gold, flexShrink: 0 }} />
                  <span style={{ fontWeight: feature.includes('Tudo do') ? '800' : '400', color: feature.includes('Tudo do') ? 'white' : 'rgba(255,255,255,0.7)' }}>
                    {feature}
                  </span>
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
