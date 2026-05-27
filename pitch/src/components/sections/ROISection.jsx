import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { colors, fonts, radii } from '../../styles/theme';
import { TrendingUp } from 'lucide-react';

export default function ROISection() {
  const [sales, setSales] = useState(3);
  const [hourlyRate, setHourlyRate] = useState(50);

  const profitPerSale = 300;
  const timeSaved = 20; // horas/mês

  const gainSales = sales * profitPerSale;
  const gainTime = timeSaved * hourlyRate;
  const totalGain = gainSales + gainTime;
  const cost = 297; // Plano Profissional
  const roi = totalGain - cost;

  return (
    <section id="roi" style={{ padding: '140px 20px', maxWidth: '1100px', margin: '0 auto', background: 'transparent' }}>
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h2 style={{ fontSize: '3rem', fontFamily: fonts.heading, marginBottom: '20px', color: 'white' }}>
          O seu ROI <span style={{ color: colors.gold }}>Matemático</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>
          O Projeto não é um custo. É um investimento com retorno previsível.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'stretch'
      }}>
        {/* Inputs */}
        <div style={{
          background: '#ffffff',
          padding: '40px',
          borderRadius: '24px',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
        }}>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ color: '#1A2E1C', display: 'block', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 600 }}>
              Vendas extras por mês (estimativa baixa)
            </label>
            <input
              type="range" min="1" max="20" value={sales}
              onChange={(e) => setSales(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: colors.gold }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: colors.gold, fontWeight: 800 }}>
              <span>1</span>
              <span style={{ fontSize: '1.2rem' }}>{sales} vendas</span>
              <span>20</span>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ color: '#1A2E1C', display: 'block', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 600 }}>
              Quanto vale sua hora de trabalho? (R$)
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[30, 50, 100, 150].map(val => (
                <button
                  key={val}
                  onClick={() => setHourlyRate(val)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: radii.sm,
                    border: hourlyRate === val ? `1px solid ${colors.gold}` : '1px solid #eee',
                    background: hourlyRate === val ? 'rgba(212, 136, 10, 0.1)' : 'white',
                    color: hourlyRate === val ? colors.gold : '#555',
                    fontWeight: 700, cursor: 'pointer', transition: '0.2s',
                    fontSize: '0.85rem'
                  }}
                >
                  R$ {val}
                </button>
              ))}
            </div>
          </div>

          <div style={{ color: 'rgba(0,0,0,0.4)', fontSize: '0.85rem', lineHeight: 1.6, padding: '15px', background: '#fcfcfc', borderRadius: '12px' }}>
            * Consideramos lucro médio de R$ 300 por venda e 20 horas mensais economizadas em gestão de redes sociais.
          </div>
        </div>

        {/* Results */}
        <div style={{
          background: 'linear-gradient(135deg, #0B1F0F, #0D3322)',
          padding: '40px',
          borderRadius: '32px',
          border: `1px solid ${colors.gold}44`,
          boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
          color: 'white'
        }}>
          <h3 style={{ color: 'white', fontSize: '1.4rem', marginBottom: '32px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp color={colors.gold} /> Resultado Estimado
          </h3>

          <div style={{ display: 'grid', gap: '20px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Ganho em Vendas</span>
              <span style={{ color: 'white', fontWeight: 700 }}>R$ {gainSales.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Tempo Recuperado</span>
              <span style={{ color: 'white', fontWeight: 700 }}>R$ {gainTime.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Custo do Sistema</span>
              <span style={{ color: '#ff6b6b', fontWeight: 700 }}>- R$ {cost}</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', background: 'rgba(212,136,10,0.1)', padding: '30px', borderRadius: '20px', border: `1px solid ${colors.gold}33` }}>
            <div style={{ color: colors.gold, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
              ROI Mensal Líquido
            </div>
            <div style={{ color: 'white', fontSize: '3.5rem', fontWeight: 900, fontFamily: fonts.heading }}>
              R$ {roi.toLocaleString()}
            </div>
            <div style={{ color: '#25D366', fontWeight: 700, fontSize: '1rem', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <span style={{ fontSize: '1.2rem' }}>↑</span> + {(roi / cost * 100).toFixed(0)}% de retorno
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
