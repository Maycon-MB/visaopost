import React from 'react';
import { motion } from 'framer-motion';
import { colors, fonts } from '../../styles/theme';
import { innovationIdeas } from '../../data/content';
import { Wand2, Globe, Zap, MessageCircle, Sun, Star } from 'lucide-react';

const iconMap = {
  Wand2: <Wand2 size={32} />,
  Globe: <Globe size={32} />,
  Zap: <Zap size={32} />,
  MessageCircle: <MessageCircle size={32} />,
  Sun: <Sun size={32} />,
  Star: <Star size={32} />
};

export default function InnovationSection() {
  return (
    <section id="inovacao" style={{ padding: '140px 20px', maxWidth: '1100px', margin: '0 auto', background: 'transparent' }}>
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h2 style={{ fontSize: '3rem', fontFamily: fonts.heading, marginBottom: '20px', color: 'white' }}>
          O Futuro das <span style={{ color: colors.gold }}>Vendas Digitais</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>
          Tecnologia exclusiva para quem busca o próximo nível de autoridade.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {innovationIdeas.map((inv, i) => (
          <motion.div key={i} whileHover={{ y: -10 }} style={{
            background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '40px',
            border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <div style={{ color: colors.gold, marginBottom: '24px' }}>
              {iconMap[inv.iconName] || <Zap size={32} />}
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '16px', color: 'white' }}>{inv.title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{inv.desc}</p>
            {inv.badge && (
              <span style={{
                position: 'absolute', top: '24px', right: '30px',
                fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px',
                backgroundColor: 'rgba(212,136,10,0.15)', padding: '6px 12px',
                borderRadius: '50px', color: colors.gold, fontWeight: '900'
              }}>
                {inv.badge}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
