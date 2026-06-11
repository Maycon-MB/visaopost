import React from 'react';
import { motion } from 'framer-motion';
import { colors, fonts, radii } from '../../styles/theme';
import { ArrowRight, Star, Heart, ZoomIn } from 'lucide-react';

const { ochre, richBlack, ghostWhite } = colors
const muted = '#556068'
const fontStack = fonts.heading

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
    <section id="catalogo" style={{ padding: '110px 20px', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '56px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ color: ochre, fontWeight: 700, fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Portfólio Digital</span>
            <h2 style={{ fontFamily: fontStack, fontSize: 'clamp(2rem, 5vw, 3rem)', color: richBlack, fontWeight: 300, lineHeight: 1.05, marginTop: '12px', letterSpacing: '0.02em' }}>
              Nossas <em style={{ fontStyle: 'italic', color: ochre }}>Coleções</em>
            </h2>
          </div>
          <p style={{ color: muted, maxWidth: '380px', fontSize: '1rem', fontWeight: 300, lineHeight: 1.65 }}>
            Uma curadoria exclusiva pensada para elevar sua visão e seu estilo. Explore nosso catálogo completo.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              style={{
                position: 'relative',
                borderRadius: radii.card,
                overflow: 'hidden',
                height: '440px',
                cursor: 'pointer',
                boxShadow: '0 16px 40px rgba(3,25,30,0.10)'
              }}
            >
              <img
                src={cat.image}
                alt={cat.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                className="catalog-img"
              />

              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to top, rgba(3, 25, 30, 0.92) 0%, rgba(3, 25, 30, 0.38) 50%, transparent 100%)`,
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                padding: '36px', color: '#fff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', background: ochre, padding: '5px 13px', borderRadius: '50px', textTransform: 'uppercase' }}>
                    {cat.count}
                  </span>
                  <div style={{ display: 'flex', gap: '10px', color: 'rgba(255,255,255,0.72)' }}>
                    <Heart size={17} />
                    <ZoomIn size={17} />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 400, marginBottom: '8px', fontFamily: fontStack, letterSpacing: '0.01em' }}>{cat.title}</h3>
                <p style={{ fontSize: '13.5px', opacity: 0.72, marginBottom: '20px', lineHeight: 1.6, fontWeight: 300 }}>{cat.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  Ver detalhes <ArrowRight size={15} color={ochre} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Home Visit CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            marginTop: '52px', padding: '36px 40px',
            background: ghostWhite, borderRadius: radii.xl,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '28px', border: '1px solid #D8DCF0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '54px', height: '54px', background: ochre, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, boxShadow: `0 8px 20px rgba(193,117,11,0.32)` }}>
              <Star size={26} fill="currentColor" />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 500, color: richBlack, letterSpacing: '0.01em', fontFamily: fontStack }}>Leve a Ótica até você</h4>
              <p style={{ color: muted, fontSize: '13.5px', marginTop: '3px', fontWeight: 300 }}>Nossos consultores levam o catálogo completo para sua casa.</p>
            </div>
          </div>
          <a href="#agendar" style={{
            backgroundColor: richBlack, color: '#fff',
            padding: '16px 36px', borderRadius: '50px',
            textDecoration: 'none', fontWeight: 700, fontSize: '13px',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            fontFamily: fontStack
          }}>
            Solicitar Visita Domiciliar
          </a>
        </motion.div>
      </div>

      <style>{`
        .catalog-img:hover { transform: scale(1.08); }
      `}</style>
    </section>
  );
}
