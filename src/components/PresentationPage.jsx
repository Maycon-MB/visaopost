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
  const [step, setStep] = useState(1);
  const [activeNav, setActiveNav] = useState('inicio');

  // Sticky Nav Links
  const navLinks = [
    { id: 'inicio', label: 'Início' },
    { id: 'problemas', label: 'Problemas' },
    { id: 'solucao', label: 'Solução' },
    { id: 'demo', label: 'Demonstração' },
    { id: 'estrategia', label: 'Estratégia' },
    { id: 'precos', label: 'Preços' }
  ];

  // Enrich plans with uniform styling (no highlights)
  const enrichedPlans = plans.map((plan, i) => ({
    ...plan,
    color: colors.gold,
  }));

  // Enrich innovation ideas with actual icon components
  const innovationIdeas = innovationData.map(idea => ({
    ...idea,
    icon: iconMap[idea.iconName] ? React.createElement(iconMap[idea.iconName], { size: 24 }) : null,
  }));


  const handlePlanSelect = (plan) => {
    // Selection logic removed as requested for presentation-only mode
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

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
        padding: '160px 20px 100px',
        textAlign: 'center',
        background: `radial-gradient(circle at top, ${colors.primary} 0%, ${colors.dark} 70%)`,
        borderBottom: `1px solid ${colors.border}`
      }}>
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
            VisaoPost SaaS v2.0
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

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button 
              onClick={() => document.getElementById('problemas').scrollIntoView({ behavior: 'smooth' })}
              style={{
                backgroundColor: colors.gold,
                color: colors.dark,
                padding: '18px 40px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '800',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: `0 10px 20px rgba(212, 136, 10, 0.3)`
              }}
            >
              INICIAR APRESENTAÇÃO
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: colors.white,
              padding: '18px 40px',
              borderRadius: '12px',
              border: `1px solid ${colors.border}`,
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              backdropFilter: 'blur(5px)'
            }}>
              VER DEMONSTRAÇÃO
            </button>
          </div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <div id="problemas">
        <ProblemSection />
      </div>

      {/* Fake Followers Warning */}
      <FakeFollowersSection />

      {/* Solution Flow */}
      <div id="solucao">
        <SolutionSection />
      </div>

      {/* NEW: Experiência da Plataforma (Simulador & Gerenciamento) */}
      <section id="demo" style={{ padding: '100px 20px', backgroundColor: '#051A10' }}>
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
                <Wand2 size={24} /> Simulador de Post IA
              </h3>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: colors.textMuted, marginBottom: '8px', textTransform: 'uppercase' }}>O que quer promover?</label>
                <input 
                  type="text" 
                  placeholder="Ex: Promoção de Ray-Ban Verão..." 
                  defaultValue="Novas armações Prada chegaram"
                  style={{ width: '100%', padding: '15px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}`, color: '#fff', fontSize: '1rem' }}
                />
              </div>
              <div style={{ background: '#fff', borderRadius: '15px', overflow: 'hidden', color: '#333' }}>
                <div style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: colors.orange }}></div>
                  <span style={{ fontWeight: '700', fontSize: '13px' }}>Ótica Di Lorenzo</span>
                </div>
                <div style={{ height: '250px', background: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url("/oculos_luxo_close_1778271030465.png")`, backgroundSize: 'cover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.9)', padding: '15px', borderRadius: '5px', textAlign: 'center', maxWidth: '80%' }}>
                    <div style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: colors.orange }}>Nova Coleção</div>
                    <div style={{ fontSize: '16px', fontWeight: '900' }}>Armações Prada</div>
                    <div style={{ fontSize: '10px', marginTop: '5px' }}>Visite-nos hoje mesmo</div>
                  </div>
                </div>
                <div style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                    <Star size={16} fill="#333" />
                    <MessageCircle size={16} />
                  </div>
                  <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                    <b>oticadilorenzo</b> O estilo que você merece com a precisão que sua visão precisa. ✨ #Prada #VisaoPost
                  </div>
                </div>
              </div>
              <button style={{ width: '100%', marginTop: '20px', padding: '15px', borderRadius: '10px', backgroundColor: colors.gold, color: colors.dark, fontWeight: '800', border: 'none', cursor: 'pointer' }}>
                GERAR NOVA OPÇÃO
              </button>
            </div>

            {/* Painel de Gerenciamento Mockup */}
            <div style={{ background: colors.glass, padding: '40px', borderRadius: '30px', border: `1px solid ${colors.border}` }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '25px', color: colors.gold, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LayoutDashboard size={24} /> Painel de Gerenciamento
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                <div style={{ background: 'rgba(212, 136, 10, 0.1)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(212, 136, 10, 0.2)' }}>
                  <div style={{ fontSize: '0.7rem', color: colors.gold, textTransform: 'uppercase', marginBottom: '5px' }}>Leads Hoje</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900' }}>12</div>
                </div>
                <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#22c55e', textTransform: 'uppercase', marginBottom: '5px' }}>Lembrete de Retorno</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900' }}>45</div>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '15px', fontWeight: '700' }}>Próximas Publicações</div>
                {[
                  { time: 'Amanhã, 09:00', type: 'Educativo', status: 'Agendado' },
                  { time: 'Segunda, 18:30', type: 'Promocional', status: 'Aguardando Aprovação' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem' }}>{item.type}</div>
                      <div style={{ fontSize: '0.7rem', color: colors.textMuted }}>{item.time}</div>
                    </div>
                    <div style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', background: item.status === 'Agendado' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(212, 136, 10, 0.2)', color: item.status === 'Agendado' ? '#22c55e' : colors.gold }}>
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '25px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: colors.textMuted }}>Média de Engajamento: <span style={{ color: colors.gold, fontWeight: '800' }}>+24% este mês</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email Mockup / Approval */}
      <EmailMockupSection />

      {/* Numbers / Metrics */}
      <NumbersSection />

      {/* Calendar */}
      <CalendarSection />

      {/* Innovation Section */}
      <section style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
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

      {/* Strategy Section */}
      <section id="estrategia" style={{ 
        padding: '120px 20px', 
        backgroundColor: '#0A261A', 
        borderTop: `1px solid ${colors.border}`,
        borderBottom: `1px solid ${colors.border}`
      }}>
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

      {/* Pricing Section */}
      <section id="precos" style={{ padding: '120px 20px', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>
            Preços <span style={{ color: colors.gold }}>acessíveis e transparentes</span>
          </h2>
          <p style={{ color: colors.textMuted, fontSize: '1.2rem' }}>Sem contrato de fidelidade. O foco é no seu resultado.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {enrichedPlans.map((plan, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              style={{
                background: colors.glass,
                padding: '60px 40px',
                borderRadius: '40px',
                border: `1px solid ${colors.border}`,
                textAlign: 'center',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', fontWeight: '800' }}>{plan.name}</h3>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '4rem', fontWeight: '900', color: colors.gold }}>R${plan.price}</span>
                  <span style={{ fontSize: '1.2rem', color: colors.textMuted }}>/mês</span>
                </div>
                <div style={{ 
                  fontSize: '1rem', 
                  color: colors.gold, 
                  fontWeight: '700',
                  marginBottom: '20px',
                  opacity: 0.8
                }}>
                  + R${plan.setup} no setup inicial
                </div>
                <p style={{ fontSize: '0.95rem', color: colors.textMuted, marginBottom: '40px', lineHeight: 1.6 }}>{plan.description}</p>
                
                <div style={{ height: '1px', backgroundColor: colors.border, marginBottom: '40px' }} />
                
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', textAlign: 'left' }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', fontSize: '1rem' }}>
                      <div style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        backgroundColor: colors.primary, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        border: `1px solid ${colors.gold}`
                      }}>
                        <Check size={14} style={{ color: colors.gold }} />
                      </div>
                      <span style={{ color: colors.white }}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WhatsApp Demo Section */}
      <section style={{ padding: '120px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2.8rem', marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>
            Atendimento & <span style={{ color: colors.gold }}>Fidelização via WhatsApp</span>
          </h2>
          <p style={{ color: colors.textMuted, fontSize: '1.1rem' }}>Mais que um bot de respostas, um sistema de vendas que nunca esquece do seu cliente.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px', alignItems: 'center' }}>
          {/* WhatsApp Mockup - Ultra Fidelity */}
          <div style={{
            background: '#E5DDD5',
            borderRadius: '40px',
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            border: '12px solid #222',
            position: 'relative',
            fontFamily: 'sans-serif'
          }}>
            {/* Status Bar */}
            <div style={{ background: '#075E54', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', fontSize: '12px' }}>
              <span>14:12</span>
              <div style={{ display: 'flex', gap: '5px' }}>
                <Smartphone size={12} />
                <Globe size={12} />
              </div>
            </div>
            
            {/* WPP Header */}
            <div style={{ padding: '12px 20px', background: '#075E54', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: `1px solid ${colors.gold}`, overflow: 'hidden', backgroundColor: colors.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.dark, fontWeight: '800', fontSize: '14px' }}>
                <img 
                  src="/otica_logo.jpg" 
                  alt="DL" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                DL
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>Ótica Di Lorenzo</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>online agora</div>
              </div>
            </div>

            {/* Chat Body */}
            <div style={{ padding: '20px', height: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ alignSelf: 'flex-start', background: '#fff', padding: '10px 14px', borderRadius: '0 15px 15px 15px', maxWidth: '85%', fontSize: '13px', color: '#333', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                Oi! Vocês fazem exame de vista? É pago?
                <div style={{ fontSize: '10px', color: '#999', textAlign: 'right', marginTop: '4px' }}>14:10</div>
              </div>
              <div style={{ alignSelf: 'flex-end', background: '#DCF8C6', padding: '10px 14px', borderRadius: '15px 15px 0 15px', maxWidth: '85%', fontSize: '13px', color: '#333', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                Olá! Sim, a Ótica Di Lorenzo realiza exame de vista gratuitamente 😊 Quer agendar para essa semana?
                <div style={{ fontSize: '10px', color: '#669966', textAlign: 'right', marginTop: '4px' }}>14:10 ✓✓</div>
              </div>
              <div style={{ alignSelf: 'flex-start', background: '#fff', padding: '10px 14px', borderRadius: '0 15px 15px 15px', maxWidth: '85%', fontSize: '13px', color: '#333', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                Vocês atendem em domicílio também?
                <div style={{ fontSize: '10px', color: '#999', textAlign: 'right', marginTop: '4px' }}>14:11</div>
              </div>
              <div style={{ alignSelf: 'flex-end', background: '#DCF8C6', padding: '10px 14px', borderRadius: '15px 15px 0 15px', maxWidth: '85%', fontSize: '13px', color: '#333', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                Sim! Fazemos atendimento em domicílio 🏠 Ideal pra quem tem dificuldade de se locomover. Posso agendar uma visita?
                <div style={{ fontSize: '10px', color: '#669966', textAlign: 'right', marginTop: '4px' }}>14:11 ✓✓</div>
              </div>
              <div style={{ alignSelf: 'flex-start', background: '#fff', padding: '10px 14px', borderRadius: '0 15px 15px 15px', maxWidth: '85%', fontSize: '13px', color: '#333', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                Qual o horário de vocês?
                <div style={{ fontSize: '10px', color: '#999', textAlign: 'right', marginTop: '4px' }}>14:12</div>
              </div>
              <div style={{ alignSelf: 'flex-end', background: '#DCF8C6', padding: '10px 14px', borderRadius: '15px 15px 0 15px', maxWidth: '85%', fontSize: '13px', color: '#333', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                Seg a Sex das 8h às 18h e Sábados das 8h às 13h 🕐 Aceitamos cartão, PIX e dinheiro ✅
                <div style={{ fontSize: '10px', color: '#669966', textAlign: 'right', marginTop: '4px' }}>14:12 ✓✓</div>
              </div>
            </div>

            {/* Input Area */}
            <div style={{ padding: '10px 15px', background: '#F0F0F0', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ flex: 1, height: '35px', background: '#fff', borderRadius: '20px', border: '1px solid #ddd' }}></div>
              <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#075E54', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <MessageCircle size={16} />
              </div>
            </div>
          </div>

          {/* Features Column */}
          <div>
            <h3 style={{ fontSize: '2rem', marginBottom: '30px', fontWeight: '800', color: colors.gold }}>Respostas instantâneas, 24h por dia</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { title: 'Horário de funcionamento', desc: 'Responde instantaneamente, qualquer hora do dia ou da noite.' },
                { title: 'Exame de vista e serviços', desc: 'Informa o que oferece sem você precisar digitar uma única palavra.' },
                { title: 'Formas de pagamento e localização', desc: 'FAQ completo configurado no setup inicial da sua conta.' },
                { title: 'Encaminhamento inteligente', desc: 'Perguntas complexas chegam com contexto já fornecido para o vendedor.' }
              ].map((item, i) => (
                <div key={i} style={{ 
                  display: 'flex', 
                  gap: '20px', 
                  padding: '20px', 
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  borderRadius: '15px',
                  border: `1px solid ${colors.border}`
                }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: colors.gold, color: colors.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: '800' }}>
                    ✓
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '5px', color: colors.white }}>{item.title}</h4>
                    <p style={{ fontSize: '0.9rem', color: colors.textMuted, lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '80px 20px', 
        borderTop: `1px solid ${colors.border}`,
        backgroundColor: colors.dark
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Top: Logo + Social */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', gap: '20px' }}>
            <div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 900, color: colors.white }}>VisaoPost</span>
              <p style={{ color: colors.textMuted, fontSize: '0.9rem', marginTop: '8px' }}>Automação inteligente para óticas</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <a href="https://www.instagram.com/mayconbruno00/" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/maycon-/" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="mailto:contato@visaopost.com" className="footer-social-link" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Middle: Sitemap Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', marginBottom: '50px', textAlign: 'left' }}>
            <div>
              <h4 style={{ color: colors.gold, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>Produto</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href="#precos" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: '0.9rem' }}>Planos</a>
                <span style={{ color: colors.textMuted, fontSize: '0.9rem' }}>Funcionalidades</span>
                <span style={{ color: colors.textMuted, fontSize: '0.9rem' }}>Integrações</span>
              </div>
            </div>
            <div>
              <h4 style={{ color: colors.gold, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>Empresa</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ color: colors.textMuted, fontSize: '0.9rem' }}>Sobre nós</span>
                <span style={{ color: colors.textMuted, fontSize: '0.9rem' }}>Blog</span>
                <span style={{ color: colors.textMuted, fontSize: '0.9rem' }}>Contato</span>
              </div>
            </div>
            <div>
              <h4 style={{ color: colors.gold, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>Legal</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ color: colors.textMuted, fontSize: '0.9rem' }}>Política de Privacidade</span>
                <span style={{ color: colors.textMuted, fontSize: '0.9rem' }}>Termos de Uso</span>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '30px', textAlign: 'center' }}>
            <p style={{ color: colors.textMuted, fontSize: '0.8rem', opacity: 0.6 }}>
              © 2026 VisaoPost SaaS — Todos os direitos reservados. Desenvolvido por <strong style={{ color: colors.goldLight }}>Maycon Bruno</strong>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PresentationPage;
