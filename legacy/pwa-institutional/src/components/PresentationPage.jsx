import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Wand2,
  LayoutDashboard
} from 'lucide-react';

import { colors, fonts, radii } from '../styles/theme';

// Sections
import ProblemSection from './sections/ProblemSection';
import FakeFollowersSection from './sections/FakeFollowersSection';
import SolutionSection from './sections/SolutionSection';
import ROISection from './sections/ROISection';
import NumbersSection from './sections/NumbersSection';
import EmailMockupSection from './sections/EmailMockupSection';
import WhatsAppSection from './sections/WhatsAppSection';
import InnovationSection from './sections/InnovationSection';
import CalendarSection from './sections/CalendarSection';
import PricingSection from './sections/PricingSection';
import MarketingSection from './sections/MarketingSection';
import FAQSection from './sections/FAQSection';
import ValueDetailModal from './ValueDetailModal';

const navLinks = [
  { id: 'inicio', label: 'Início' },
  { id: 'problemas', label: 'Problemas' },
  { id: 'solucao', label: 'Como funciona' },
  { id: 'roi', label: 'Calculadora' },
  { id: 'demo', label: 'Simulador' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'precos', label: 'Preços' },
  { id: 'faq', label: 'FAQ' }
];

const PresentationPage = () => {
  const [activeNav, setActiveNav] = useState('inicio');
  const [activePost, setActivePost] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      const sections = navLinks.map(link => document.getElementById(link.id)).filter(Boolean);

      let current = 'inicio';
      sections.forEach(section => {
        if (section.offsetTop <= scrollPosition) {
          current = section.id;
        }
      });
      setActiveNav(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const postTemplates = [
    {
      tag: 'LUXO',
      location: 'Ótica Di Lorenzo - Premium Store',
      img: './stylish_person_glasses_1778289098822.png',
      desc: 'A nova coleção de grifes internacionais acaba de chegar. Sofisticação e precisão técnica em cada detalhe. ✨ #LuxuryEyewear #Estilo'
    },
    {
      tag: 'SOLAR',
      location: 'Coleção Verão 2026',
      img: './rayban_sunglasses_beach_1778289078548.png',
      desc: 'Os clássicos que nunca saem de moda. Aproveite nossa Special Week com 20% OFF em modelos selecionados. 😎 #Sunglasses #Summer'
    },
    {
      tag: 'SAÚDE',
      location: 'Check-up Visual Semanal',
      img: './eye_exam_equipment_1778289213835.png',
      desc: 'Sua visão muda, seu cuidado não pode parar. Agende seu check-up anual. 📅 #SaudeVisual #Optometria'
    }
  ];

  const rotatePost = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setTimeout(() => {
      setActivePost((prev) => (prev + 1) % postTemplates.length);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div style={{
      backgroundColor: '#0B1F0F', // Unified Dark Green Background
      color: 'white',
      minHeight: '100vh',
      fontFamily: fonts.body,
      backgroundAttachment: 'fixed',
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(212, 136, 10, 0.15), transparent 50%), radial-gradient(circle at 100% 50%, rgba(212, 136, 10, 0.05), transparent 40%)',
    }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 2000,
        backgroundColor: 'rgba(11, 31, 15, 0.8)', backdropFilter: 'blur(15px)',
        padding: '10px 30px', borderRadius: '50px', border: '1px solid rgba(212, 136, 10, 0.2)',
        display: 'flex', gap: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        {navLinks.map(link => (
          <a key={link.id} href={`#${link.id}`} style={{
            textDecoration: 'none', color: activeNav === link.id ? colors.gold : 'white',
            fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase',
            opacity: activeNav === link.id ? 1 : 0.6, transition: '0.3s'
          }}>
            {link.label}
          </a>
        ))}
      </nav>

      {/* Hero Section */}
      <section id="inicio" style={{
        padding: '180px 20px 140px', textAlign: 'center', position: 'relative',
        backgroundColor: 'transparent',
        color: 'white',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 50% -20%, rgba(212, 136, 10, 0.15), transparent 70%)',
          zIndex: 0
        }}></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div style={{
            display: 'inline-block', padding: '8px 20px', borderRadius: '50px',
            backgroundColor: 'rgba(212, 136, 10, 0.15)', border: `1px solid ${colors.gold}66`,
            color: colors.gold, fontSize: '0.8rem', fontWeight: '800', marginBottom: '32px',
            textTransform: 'uppercase', letterSpacing: '2px'
          }}>
            Projeto v2.0 • Consultoria Premium
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '900', fontFamily: fonts.heading, marginBottom: '24px', letterSpacing: '-1px', color: 'white', lineHeight: 1.1 }}>
            O Social Media de Luxo <br />
            <span style={{ color: colors.gold }}>da sua Ótica 24h por dia</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', maxWidth: '750px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            Autoridade visual e automação de vendas construídas exclusivamente para o mercado óptico de alto padrão.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}
          >
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '3px' }}>
              Role para explorar a proposta
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Sections Flow */}
      <div id="problemas">
        <ProblemSection />
      </div>
      <FakeFollowersSection />

      <div id="solucao">
        <SolutionSection />
      </div>

      <div id="roi">
        <ROISection />
      </div>

      <NumbersSection />
      <EmailMockupSection />

      <div id="whatsapp">
        <WhatsAppSection />
      </div>

      <InnovationSection />
      <CalendarSection />

      {/* Instagram Simulator Section */}
      <section id="demo" style={{ padding: '140px 20px', backgroundColor: 'transparent' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '3rem', fontFamily: fonts.heading, marginBottom: '20px', color: 'white' }}>
              Visual <span style={{ color: colors.gold }}>Premium Automatizado</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem' }}>Sua ótica com o visual das maiores grifes do mundo.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px' }}>
            {/* Post Mockup */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePost} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                  style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', color: '#000', width: '100%', maxWidth: '400px', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}
                >
                  <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: colors.primary, border: '2px solid #eee' }} />
                      <span style={{ fontWeight: '700', fontSize: '15px' }}>sua_otica_aqui</span>
                    </div>
                    <MoreHorizontal size={20} color="#666" />
                  </div>
                  <div style={{ aspectRatio: '1/1', position: 'relative' }}>
                    <img src={postTemplates[activePost].img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Post" />
                    {isGenerating && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '35px', height: '35px', border: `3px solid ${colors.gold}`, borderTopColor: 'transparent', borderRadius: '50%' }} />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                      <Heart size={24} /><MessageCircle size={24} /><Send size={24} />
                    </div>
                    <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                      <span style={{ fontWeight: '700', marginRight: '8px' }}>sua_otica_aqui</span>
                      {postTemplates[activePost].desc}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <button onClick={rotatePost} disabled={isGenerating} style={{
                marginTop: '30px', width: '100%', maxWidth: '400px', padding: '18px',
                backgroundColor: colors.gold, color: '#0B1F0F', fontWeight: '900',
                border: 'none', borderRadius: radii.md, cursor: 'pointer',
                boxShadow: `0 10px 20px ${colors.gold}33`, transition: '0.3s'
              }}>
                {isGenerating ? 'ANALISANDO TENDÊNCIAS...' : 'GERAR NOVA OPÇÃO DE POST'}
              </button>
            </div>

            {/* Dashboard Mockup */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              padding: '40px',
              borderRadius: '32px',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '30px',
              boxShadow: '0 40px 100px rgba(0,0,0,0.08)',
              color: '#1A2E1C'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ padding: '10px', background: 'rgba(212, 136, 10, 0.1)', borderRadius: '12px' }}>
                    <LayoutDashboard color={colors.gold} size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Performance Analytics</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#25d366', fontWeight: 'bold', padding: '6px 12px', background: 'rgba(37, 211, 102, 0.1)', borderRadius: '20px' }}>
                  <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#25d366' }}></motion.div> AO VIVO
                </div>
              </div>

              {/* Chart */}
              <div style={{ padding: '20px', background: 'rgba(0,0,0,0.02)', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '100px', marginBottom: '15px' }}>
                  {[30, 50, 40, 95, 45, 75, 60].map((h, i) => (
                    <motion.div
                      key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} transition={{ delay: i * 0.1, duration: 0.8 }}
                      style={{ flex: 1, backgroundColor: i === 3 ? colors.gold : 'rgba(0,0,0,0.05)', borderRadius: '6px' }}
                    ></motion.div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'rgba(0,0,0,0.4)', fontWeight: '700' }}>
                  <span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SÁB</span><span>DOM</span>
                </div>
              </div>

              {/* Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ padding: '15px', borderRadius: '16px', background: 'white', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(0,0,0,0.4)', marginBottom: '5px', textTransform: 'uppercase' }}>Interações</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '900' }}>+342</div>
                </div>
                <div style={{ padding: '15px', borderRadius: '16px', background: 'white', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(0,0,0,0.4)', marginBottom: '5px', textTransform: 'uppercase' }}>Leads</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '900' }}>5</div>
                </div>
              </div>

              {/* AI Insight Box */}
              <div style={{
                padding: '20px',
                borderRadius: '16px',
                background: 'rgba(212, 136, 10, 0.15)',
                border: `1px solid ${colors.gold}44`,
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: colors.gold }}></div>
                <p style={{ fontSize: '0.8rem', color: '#000', lineHeight: 1.5, margin: 0, fontWeight: '700' }}>
                  <strong>🤖 Estratégia Recomendada:</strong> "Seu público engaja 3x mais com vídeos de bastidores (ajuste de armação). Sugerimos postar um Reels nesse formato na terça-feira."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="precos">
        <PricingSection />
      </div>

      <div id="marketing">
        <MarketingSection />
      </div>

      <div id="faq">
        <FAQSection />
      </div>

      {/* Footer */}
      <footer style={{
        padding: '100px 20px 60px', textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: colors.gold, marginBottom: '20px', fontFamily: fonts.heading }}>Projeto</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: '40px' }}>
            Transformando o Instagram em uma máquina de vendas para óticas.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px' }}>
            {['Início', 'Problemas', 'Solução', 'Resultados', 'Planos'].map((item, i) => (
              <a key={i} href={`#${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>{item}</a>
            ))}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
            © 2026 Projeto • Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PresentationPage;
