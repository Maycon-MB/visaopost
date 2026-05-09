import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  MessageCircle, 
  Target, 
  Zap, 
  Smartphone, 
  TrendingUp, 
  ShieldCheck, 
  Award,
  ChevronRight,
  Clock,
  MousePointer,
  Wand2,
  Sun,
  Camera,
  Star,
  Globe,
  LayoutDashboard,
  Users,
  Instagram,
  Linkedin,
  Mail,
  Phone
} from 'lucide-react';
import { colors } from '../styles/theme';
import { plans, innovationIdeas as innovationData, whatsappFeatures } from '../data/content';
import ProblemSection from './sections/ProblemSection';
import FakeFollowersSection from './sections/FakeFollowersSection';
import SolutionSection from './sections/SolutionSection';
import EmailMockupSection from './sections/EmailMockupSection';
import CalendarSection from './sections/CalendarSection';
import NumbersSection from './sections/NumbersSection';

// Icon map for dynamic rendering from content.js
const iconMap = { Wand2, Sun, Zap, Star, Globe, LayoutDashboard, Camera, MousePointer, MessageCircle };

const PresentationPage = () => {
  const [activeNav, setActiveNav] = useState('inicio');
  const [activePost, setActivePost] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const postTemplates = [
    { 
      tag: 'PRADA', 
      title: 'LUXO ACESSÍVEL', 
      price: '10x R$ 89',
      label: 'NOVA COLEÇÃO',
      bgColor: 'linear-gradient(135deg, #0B1F0F 0%, #1A4D2E 100%)',
      accentColor: colors.gold,
      img: '/stylish_person_glasses_1778289098822.png',
      desc: 'Sinta a exclusividade de uma das marcas mais desejadas do mundo. ✨ #Prada #VisaoPost'
    },
    { 
      tag: 'RAY-BAN', 
      title: 'VERÃO 2024', 
      price: '20% OFF',
      label: 'OFERTA VERÃO',
      bgColor: 'linear-gradient(135deg, #1a1a1a 0%, #444 100%)',
      accentColor: '#E63946',
      img: '/rayban_sunglasses_beach_1778289078548.png',
      desc: 'O sol chegou e o seu Ray-Ban também. Garanta o seu com desconto exclusivo! 😎 #RayBan #Promo'
    },
    { 
      tag: 'SAÚDE', 
      title: 'VISÃO EM DIA', 
      price: 'AGENDAR',
      label: 'CUIDADO TOTAL',
      bgColor: 'linear-gradient(135deg, #0D3322 0%, #166534 100%)',
      accentColor: '#22c55e',
      img: '/eye_exam_equipment_1778289213835.png',
      desc: 'Não espere sua visão cansar. Agende seu exame de vista hoje mesmo pelo WhatsApp. 📅 #Saude #Exame'
    },
    { 
      tag: 'VITRINE', 
      title: 'ESTILO ÚNICO', 
      price: 'LANÇAMENTO',
      label: 'TENDÊNCIA 2024',
      bgColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      accentColor: '#818cf8',
      img: '/optical_shop_display_1778289138291.png',
      desc: 'As melhores grifes do mundo reunidas em um só lugar. Venha nos visitar! 💅 #Vogue #Luxury'
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

  const navLinks = [
    { id: 'inicio', label: 'Início' },
    { id: 'problemas', label: 'Problemas' },
    { id: 'solucao', label: 'Solução' },
    { id: 'demo', label: 'Demonstração' },
    { id: 'estrategia', label: 'Estratégia' },
    { id: 'precos', label: 'Preços' }
  ];

  const innovationIdeas = innovationData.map(idea => ({
    ...idea,
    icon: iconMap[idea.iconName] ? React.createElement(iconMap[idea.iconName], { size: 24 }) : null,
  }));

  return (
    <div style={{
      backgroundColor: colors.dark,
      color: colors.white,
      minHeight: '100vh',
      fontFamily: "'Montserrat', sans-serif",
      overflowX: 'hidden'
    }}>
      {/* Sticky Header Nav */}
      <nav style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2000,
        backgroundColor: 'rgba(13, 51, 34, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '10px 30px',
        borderRadius: '50px',
        border: `1px solid ${colors.border}`,
        display: 'flex',
        gap: '20px'
      }}>
        {navLinks.map(link => (
          <a 
            key={link.id} 
            href={`#${link.id}`}
            onClick={() => setActiveNav(link.id)}
            style={{
              textDecoration: 'none',
              color: activeNav === link.id ? colors.gold : colors.white,
              fontSize: '0.8rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: '0.3s',
              opacity: activeNav === link.id ? 1 : 0.6
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Hero Section */}
      <section id="inicio" style={{
        padding: '160px 20px 120px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: colors.dark,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Background Image with Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          backgroundImage: 'linear-gradient(to bottom, rgba(11, 31, 15, 0.85), rgba(11, 31, 15, 0.95)), url("/hero_otica_premium_1778270703774.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div style={{ 
            display: 'inline-block', 
            padding: '6px 16px', 
            borderRadius: '20px', 
            backgroundColor: 'rgba(212, 136, 10, 0.1)', 
            border: `1px solid ${colors.gold}`,
            color: colors.gold,
            fontSize: '0.8rem',
            fontWeight: '700',
            marginBottom: '24px',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            VisaoPost v2.0
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: '900',
            lineHeight: 1.1,
            marginBottom: '30px',
            fontFamily: "'Playfair Display', serif"
          }}>
            Acelerando as Vendas da <br />
            <span style={{ color: colors.gold }}>Sua Ótica com Inteligência</span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: colors.textMuted,
            maxWidth: '700px',
            margin: '0 auto 50px',
            lineHeight: 1.6
          }}>
            Não somos uma agência comum. Somos um sistema de marketing automatizado desenhado exclusivamente para o mercado óptico.
          </p>
        </motion.div>
      </section>

      {/* Problem Section */}
      <div id="problemas">
        <ProblemSection />
      </div>

      <FakeFollowersSection />

      <div id="solucao">
        <SolutionSection />
      </div>

      {/* Experiência da Plataforma (Simulador & Gerenciamento) */}
      <section id="demo" style={{ padding: '120px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.8rem', marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>
              Experiência da <span style={{ color: colors.gold }}>Plataforma na Prática</span>
            </h2>
            <p style={{ color: colors.textMuted, fontSize: '1.1rem' }}>Sua ótica no piloto automático com controle total.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
            {/* Post Simulator */}
            <div style={{ background: colors.glass, padding: '40px', borderRadius: '30px', border: `1px solid ${colors.border}` }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '25px', color: colors.gold, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Wand2 size={24} /> Simulador de Design IA
              </h3>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activePost}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  style={{ 
                    background: '#000', 
                    borderRadius: '20px', 
                    overflow: 'hidden', 
                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                    aspectRatio: '4/5',
                    position: 'relative'
                  }}
                >
                  {/* DESIGN CANVAS (ESTILO POST AGÊNCIA) */}
                  <div style={{ 
                    height: '100%', 
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* A IMAGEM DE VERDADE AQUI */}
                    <img 
                      src={postTemplates[activePost].img} 
                      alt="Post"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, zIndex: 0 }}
                    />
                    
                    {/* Overlay Escuro para dar leitura no texto */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)', zIndex: 1 }} />
                    
                    {/* Header: Label */}
                    <div style={{ zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', padding: '20px' }}>
                      <span style={{ color: postTemplates[activePost].accentColor, fontSize: '0.7rem', fontWeight: '900', letterSpacing: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{postTemplates[activePost].label}</span>
                      <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900' }}>DL</div>
                    </div>

                    {/* Floating Price/Offer Badge */}
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                      style={{
                        position: 'absolute',
                        top: '80px',
                        right: '20px',
                        width: '90px',
                        height: '90px',
                        background: postTemplates[activePost].accentColor,
                        borderRadius: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.dark,
                        fontWeight: '900',
                        fontSize: '0.8rem',
                        transform: 'rotate(15deg)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                        zIndex: 3,
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '0.45rem', opacity: 0.8, letterSpacing: '1px' }}>APROVEITE</div>
                      <div style={{ lineHeight: 1.1 }}>{postTemplates[activePost].price}</div>
                    </motion.div>

                    {/* Footer: Typography */}
                    <div style={{ zIndex: 2, position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '30px' }}>
                      <h4 style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: '900', 
                        fontFamily: "'Playfair Display', serif", 
                        lineHeight: 1, 
                        marginBottom: '10px',
                        color: colors.white,
                        textShadow: '0 5px 15px rgba(0,0,0,0.5)'
                      }}>
                        {postTemplates[activePost].tag} <br />
                        <span style={{ fontSize: '1.2rem', color: postTemplates[activePost].accentColor, letterSpacing: '2px', fontWeight: '400', fontFamily: "'Montserrat', sans-serif" }}>
                          {postTemplates[activePost].title}
                        </span>
                      </h4>
                      <div style={{ height: '3px', width: '60px', background: postTemplates[activePost].accentColor, marginBottom: '20px' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: postTemplates[activePost].accentColor, color: colors.dark, padding: '8px 20px', borderRadius: '5px', fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase' }}>AGENDAR AGORA</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>@oticadilorenzo</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div style={{ padding: '20px 0', borderBottom: `1px solid ${colors.border}`, marginBottom: '20px' }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                  <b style={{ color: colors.gold }}>otica_di_lorenzo</b> {postTemplates[activePost].desc}
                </div>
              </div>

              <button 
                onClick={rotatePost}
                disabled={isGenerating}
                style={{ 
                  width: '100%', 
                  padding: '18px', 
                  borderRadius: '12px', 
                  backgroundColor: isGenerating ? 'rgba(212, 136, 10, 0.5)' : colors.gold, 
                  color: colors.dark, 
                  fontWeight: '800', 
                  fontSize: '1rem',
                  border: 'none', 
                  cursor: isGenerating ? 'not-allowed' : 'pointer', 
                  transition: '0.3s',
                  boxShadow: isGenerating ? 'none' : `0 10px 20px rgba(212, 136, 10, 0.3)`
                }}
              >
                {isGenerating ? 'INTELIGÊNCIA GERANDO DESIGN...' : 'GERAR NOVA OPÇÃO DE POST'}
              </button>
            </div>

            {/* Painel de Gerenciamento Mockup */}
            <div style={{ background: colors.glass, padding: '40px', borderRadius: '30px', border: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '5px', color: colors.gold, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LayoutDashboard size={24} /> Painel de Gerenciamento
              </h3>
              
              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <div style={{ background: 'rgba(212, 136, 10, 0.1)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(212, 136, 10, 0.2)' }}>
                  <div style={{ fontSize: '0.6rem', color: colors.gold, textTransform: 'uppercase', marginBottom: '5px', fontWeight: '800' }}>Leads Hoje</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>14</div>
                </div>
                <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                  <div style={{ fontSize: '0.6rem', color: '#22c55e', textTransform: 'uppercase', marginBottom: '5px', fontWeight: '800' }}>Recall Ativo</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>48</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '15px', border: `1px solid ${colors.border}` }}>
                  <div style={{ fontSize: '0.6rem', color: colors.textMuted, textTransform: 'uppercase', marginBottom: '5px', fontWeight: '800' }}>Post Score</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>9.2</div>
                </div>
              </div>

              {/* Schedule List */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: '0.8rem', marginBottom: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Calendário de Posts</span>
                  <span style={{ color: colors.gold, fontSize: '0.7rem' }}>VER TUDO</span>
                </div>
                {[
                  { time: 'Hoje, 18:00', type: 'Prada Luxury', status: 'Publicado', color: '#22c55e' },
                  { time: 'Amanhã, 09:00', type: 'Exame de Vista', status: 'Agendado', color: colors.gold },
                  { time: '12 Out, 10:30', type: 'Promo Ray-Ban', status: 'Aprovação', color: colors.textMuted }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>{item.type}</div>
                      <div style={{ fontSize: '0.65rem', color: colors.textMuted }}>{item.time}</div>
                    </div>
                    <div style={{ fontSize: '0.6rem', padding: '4px 8px', borderRadius: '4px', background: `${item.color}22`, color: item.color, border: `1px solid ${item.color}44`, fontWeight: '800' }}>
                      {item.status.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recall Progress Section */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '10px' }}>META DE VENDAS (RECALL)</div>
                <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
                  <div style={{ height: '100%', width: '75%', background: `linear-gradient(to right, ${colors.gold}, #f59e0b)`, borderRadius: '10px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: colors.textMuted }}>
                  <span>75% da meta atingida</span>
                  <span style={{ color: colors.white, fontWeight: '700' }}>R$ 12.450 / R$ 18.000</span>
                </div>
              </div>

              {/* System Health / Logs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.1)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
                <span style={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: '600' }}>BOT WHATSAPP: ONLINE E RESPONDENDO</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EmailMockupSection />
      <NumbersSection />
      <CalendarSection />

      <section style={{ padding: '120px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2.8rem', marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>
            Além do básico — <span style={{ color: colors.gold }}>ideias inovadoras</span>
          </h2>
          <p style={{ color: colors.textMuted, fontSize: '1.1rem' }}>O que nos diferencia de qualquer concorrente genérico.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {innovationIdeas.map((idea, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: colors.glass,
                padding: '40px',
                borderRadius: '24px',
                border: `1px solid ${colors.border}`,
                position: 'relative',
                transition: '0.3s'
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: colors.primary,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.gold,
                marginBottom: '24px',
                boxShadow: `0 8px 16px rgba(13, 51, 34, 0.5)`
              }}>
                {idea.icon}
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '14px', fontWeight: '700' }}>{idea.title}</h3>
              <p style={{ fontSize: '0.95rem', color: colors.textMuted, lineHeight: 1.6 }}>{idea.desc}</p>
              <span style={{
                position: 'absolute',
                top: '25px',
                right: '30px',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                padding: '6px 12px',
                borderRadius: '6px',
                color: colors.gold,
                fontWeight: '600'
              }}>
                {idea.badge}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="estrategia" style={{ padding: '120px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.8rem', marginBottom: '20px', color: colors.white, fontFamily: "'Playfair Display', serif" }}>
            Estratégia: <span style={{ color: colors.gold }}>Marketing de Ciclo Completo</span>
          </h2>
          <p style={{ color: colors.textMuted, maxWidth: '750px', margin: '0 auto 80px', fontSize: '1.1rem' }}>
            Não é apenas sobre "postar fotos", é sobre construir uma máquina que atrai, converte e fideliza seus clientes automaticamente.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px'
          }}>
            {[
              { 
                title: "1. Atração", 
                icon: <Camera size={28} />, 
                desc: "Usamos o Instagram e o Google Meu Negócio para colocar sua ótica na frente de novos clientes todos os dias com posts inteligentes e contextuais.",
                color: colors.blueLight
              },
              { 
                title: "2. Conversão", 
                icon: <MousePointer size={28} />, 
                desc: "A nova Landing Page profissional captura o contato do interessado e o direciona para o agendamento de exame ou visita, transformando seguidores em leads reais.",
                color: colors.gold
              },
              { 
                title: "3. Retenção (Lembrete)", 
                icon: <MessageCircle size={28} />, 
                desc: "O grande segredo: Nosso sistema identifica clientes que compraram há 1 ano e envia um lembrete de retorno automático via WhatsApp para renovar o exame. Dinheiro no caixa sem esforço.",
                color: '#22c55e'
              }
            ].map((item, i) => (
              <div key={i} style={{
                background: colors.glass,
                padding: '48px',
                borderRadius: '30px',
                border: `1px solid ${colors.border}`,
                position: 'relative'
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${item.color}`,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 30px',
                  color: item.color,
                  boxShadow: `0 10px 20px ${item.color}33`
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '20px', fontWeight: '800' }}>{item.title}</h3>
                <p style={{ fontSize: '1rem', color: colors.textMuted, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="precos" style={{ padding: '120px 20px', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2.8rem', marginBottom: '20px', color: colors.white, fontFamily: "'Playfair Display', serif" }}>
            Investimento na <span style={{ color: colors.gold }}>Escalabilidade</span>
          </h2>
          <p style={{ color: colors.textMuted, fontSize: '1.1rem' }}>Escolha o nível de automação ideal para o seu momento.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '80px'
        }}>
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: colors.glass,
                padding: '50px 40px',
                borderRadius: '32px',
                border: `1px solid ${colors.border}`,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '10px' }}>{plan.name}</h3>
              <p style={{ fontSize: '0.9rem', color: colors.textMuted, marginBottom: '30px', lineHeight: 1.5 }}>{plan.description}</p>
              
              <div style={{ marginBottom: '40px' }}>
                <span style={{ fontSize: '1rem', color: colors.gold, fontWeight: '700' }}>R$</span>
                <span style={{ fontSize: '3.5rem', fontWeight: '900', color: colors.white }}>{plan.price}</span>
                <span style={{ color: colors.textMuted }}>/mês</span>
              </div>

              <div style={{ flexGrow: 1 }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: colors.gold, fontWeight: '700', marginBottom: '20px' }}>O que está incluso:</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', color: colors.white, fontSize: '0.95rem' }}>
                      <Check size={18} style={{ color: colors.gold, marginTop: '3px', flexShrink: 0 }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: `1px solid rgba(255,255,255,0.05)` }}>
                <div style={{ color: colors.textMuted, fontSize: '0.8rem', marginBottom: '5px' }}>Setup inicial (único)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: colors.white }}>R$ {plan.setup}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ padding: '120px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: `linear-gradient(135deg, ${colors.primary}, #051A10)`, padding: '80px 40px', borderRadius: '40px', border: `1px solid ${colors.border}`, boxShadow: `0 20px 40px rgba(0,0,0,0.3)` }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', fontFamily: "'Playfair Display', serif" }}>
            Pronto para <span style={{ color: colors.gold }}>mudar sua visão?</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: colors.textMuted, marginBottom: '40px', lineHeight: 1.6 }}>
            Seja o próximo case de sucesso. Agende uma demonstração personalizada e veja o VisaoPost em ação com a sua própria marca.
          </p>
          <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: colors.gold, color: colors.dark, padding: '20px 50px', borderRadius: '15px', textDecoration: 'none', fontWeight: '800', fontSize: '1.1rem', transition: '0.3s' }}>
            CONVERSAR AGORA
          </a>
        </div>
      </section>

      <footer style={{ padding: '120px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', gap: '20px' }}>
            <div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 900, color: colors.white }}>VisaoPost</span>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="WhatsApp">
                <Mail size={20} />
              </a>
              <a href="#" className="footer-social-link" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', marginBottom: '50px', textAlign: 'left' }}>
            <div>
              <h4 style={{ color: colors.gold, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>Produto</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href="#precos" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: '0.9rem' }}>Planos</a>
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '30px', textAlign: 'center' }}>
            <p style={{ color: colors.textMuted, fontSize: '0.8rem', opacity: 0.6 }}>
              © 2026 VisaoPost — Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PresentationPage;
