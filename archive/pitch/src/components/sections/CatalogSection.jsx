import React from 'react';
import { motion } from 'framer-motion';
import { colors, fonts, radii } from '../../styles/theme';
import { ArrowRight, Star, Heart, ZoomIn } from 'lucide-react';

const categories = [
  {
    title: 'Lançamentos Solar',
    desc: 'Proteção UV400 com o máximo de estilo para os dias de sol.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop',
    count: '24 modelos'
  },
  {
    title: 'Armações de Grau',
    desc: 'Leveza e conforto para o seu dia a dia, do clássico ao moderno.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
    count: '48 modelos'
  },
  {
    title: 'Linha Premium Luxo',
    desc: 'Curadoria das grifes mais desejadas do mundo em um só lugar.',
    image: 'https://images.unsplash.com/photo-1509100194014-d49809396daa?q=80&w=800&auto=format&fit=crop',
    count: '15 modelos'
  },
  {
    title: 'Lentes Especiais',
    desc: 'Tecnologia digital para visão nítida em todas as distâncias.',
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?q=80&w=800&auto=format&fit=crop',
    count: '8 tecnologias'
  }
];

export default function CatalogSection() {
  return (
    <section id="catalogo" style={{ padding: '120px 20px', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ color: colors.gold, fontWeight: 800, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Portfólio Digital</span>
            <h2 style={{ fontFamily: fonts.heading, fontSize: '3rem', color: colors.landing.green, fontWeight: 900, lineHeight: 1.1, marginTop: '10px' }}>
              Nossas <span style={{ color: colors.gold }}>Coleções</span>
            </h2>
          </div>
          <p style={{ color: colors.landing.textMuted, maxWidth: '400px', fontSize: '1.05rem', fontWeight: 500 }}>
            Uma curadoria exclusiva pensada para elevar sua visão e seu estilo. Explore nosso catálogo completo.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              style={{
                position: 'relative',
                borderRadius: radii.xl,
                overflow: 'hidden',
                height: '450px',
                cursor: 'pointer',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}
            >
              <img 
                src={cat.image} 
                alt={cat.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                className="catalog-img"
              />
              
              {/* Overlay Gradient */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(13, 51, 34, 0.9) 0%, rgba(13, 51, 34, 0.4) 50%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '40px',
                color: '#fff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, background: colors.gold, padding: '4px 12px', borderRadius: '50px', textTransform: 'uppercase' }}>
                    {cat.count}
                  </span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Heart size={18} />
                    <ZoomIn size={18} />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '10px', fontFamily: fonts.heading }}>{cat.title}</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '20px', lineHeight: 1.5 }}>{cat.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Ver detalhes <ArrowRight size={16} color={colors.gold} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Home Visit CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          style={{
            marginTop: '60px',
            padding: '40px',
            background: colors.landing.gray,
            borderRadius: radii.xl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '30px',
            border: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '60px', height: '60px', background: colors.gold, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Star size={30} fill="currentColor" />
            </div>
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: colors.landing.green }}>Leve a Ótica até você</h4>
              <p style={{ color: colors.landing.textMuted, fontSize: '0.9rem' }}>Nossos consultores levam o catálogo completo para sua casa.</p>
            </div>
          </div>
          <a href="#agendar" style={{
            backgroundColor: colors.landing.green,
            color: '#fff',
            padding: '18px 40px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 800,
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Solicitar Visita Domiciliar
          </a>
        </motion.div>
      </div>
      
      <style>{`
        .catalog-img:hover {
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
}
