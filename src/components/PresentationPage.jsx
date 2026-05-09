import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  MessageCircle, 
  Heart,
  Send,
  Bookmark,
  MoreHorizontal,
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
      location: 'Ótica Di Lorenzo - Premium Store',
      img: './stylish_person_glasses_1778289098822.png',
      desc: 'A nova coleção Prada acaba de chegar. Sofisticação e precisão técnica em cada detalhe. O acessório que define sua autoridade visual. ✨ #PradaEyewear #OticaDiLorenzo #Luxury'
    },
    { 
      tag: 'RAY-BAN', 
      location: 'Village Mall - Rio de Janeiro',
      img: './rayban_sunglasses_beach_1778289078548.png',
      desc: 'Os clássicos nunca morrem. Aproveite nossa Special Week com 20% OFF em toda a linha Aviator. Proteção e estilo para os dias de sol. 😎 #RayBan #ClassicStyle #Summer2024'
    },
    { 
      tag: 'SAÚDE', 
      location: 'Check-up Visual Semanal',
      img: './eye_exam_equipment_1778289213835.png',
      desc: 'Sua visão muda, seu cuidado não pode parar. Agende seu check-up anual e garanta que sua saúde ocular esteja em dia. Atendimento especializado via WhatsApp. 📅 #SaudeVisual #Optometria'
    },
    { 
      tag: 'LOJA', 
      location: 'Conheça nossa Unidade Conceito',
      img: './premium_optical_storefront_1778289243187.png',
      desc: 'Mais que uma ótica, uma experiência de luxo. Venha tomar um café conosco e descobrir a moldura perfeita para o seu olhar. 💅 #PremiumExperience #Otica #Design'
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
    { id: 'whatsapp', label: 'WhatsApp' },
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
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          backgroundImage: 'linear-gradient(to bottom, rgba(11, 31, 15, 0.85), rgba(11, 31, 15, 0.95)), url("./hero_otica_premium_1778270703774.png")',
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
            O Social Media de Luxo <br />
            <span style={{ color: colors.gold }}>da sua Ótica 24h por dia</span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: colors.textMuted,
            maxWidth: '700px',
            margin: '0 auto 50px',
            lineHeight: 1.6
          }}>
            Não apenas posts. Construímos autoridade visual e automação de vendas para o mercado óptico premium.
          </p>
        </motion.div>
      </section>

      <div id="problemas">
        <ProblemSection />
      </div>

      <FakeFollowersSection />

      <div id="solucao">
        <SolutionSection />
      </div>

      {/* Simulador Instagram */}
      <section id="demo" style={{ padding: '120px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.8rem', marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>
              Visual <span style={{ color: colors.gold }}>Premium Automatizado</span>
            </h2>
            <p style={{ color: colors.textMuted, fontSize: '1.1rem' }}>Como seu Instagram aparecerá para o mundo com o VisaoPost.</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '40px', 
            alignItems: 'stretch',
            justifyContent: 'center'
          }}>
            {/* Instagram Mockup */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center', color: colors.gold, fontWeight: '700', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '15px' }}>
                <Wand2 size={14} style={{ marginBottom: '-2px', marginRight: '6px' }} /> Simulando Postagem IA
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activePost}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  style={{ 
                    background: '#fff', 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                    color: '#000',
                    width: '100%',
                    maxWidth: '420px',
                    margin: '0 auto',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {/* IG Header */}
                  <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid #efefef' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', padding: '2px' }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#fff', padding: '2px' }}>
                          <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: '900' }}>DL</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '-0.2px' }}>otica_di_lorenzo</span>
                        <span style={{ fontSize: '11px', color: '#666' }}>{postTemplates[activePost].location}</span>
                      </div>
                    </div>
                    <MoreHorizontal size={18} color="#262626" />
                  </div>

                  {/* IG Post Body */}
                  <div style={{ position: 'relative', aspectRatio: '1/1', background: '#fafafa' }}>
                    <img 
                      src={postTemplates[activePost].img} 
                      alt="Post"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {isGenerating && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ width: '32px', height: '32px', border: `3px solid ${colors.gold}`, borderTopColor: 'transparent', borderRadius: '50%' }} />
                      </div>
                    )}
                  </div>

                  {/* IG Footer Icons */}
                  <div style={{ padding: '12px 16px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <Heart size={24} strokeWidth={1.5} />
                        <MessageCircle size={24} strokeWidth={1.5} />
                        <Send size={24} strokeWidth={1.5} />
                      </div>
                      <Bookmark size={24} strokeWidth={1.5} />
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>156 curtidas</div>
                    <div style={{ fontSize: '14px', lineHeight: '1.5', flexGrow: 1 }}>
                      <span style={{ fontWeight: '700', marginRight: '6px' }}>otica_di_lorenzo</span>
                      {postTemplates[activePost].desc}
                    </div>
                    <div style={{ fontSize: '10px', color: '#8e8e8e', marginTop: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>HÁ 1 HORA</div>
                  </div>
                  
                  {/* IG Add Comment Mockup */}
                  <div style={{ padding: '12px 16px', borderTop: '0.5px solid #efefef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#8e8e8e' }}>Adicione um comentário...</span>
                    <span style={{ fontSize: '14px', color: '#0095f6', fontWeight: '600', opacity: 0.5 }}>Publicar</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              <button 
                onClick={rotatePost}
                disabled={isGenerating}
                style={{ 
                  width: '100%', 
                  maxWidth: '420px',
                  margin: '20px auto 0',
                  padding: '16px', 
                  borderRadius: '12px', 
                  backgroundColor: isGenerating ? 'rgba(255,255,255,0.1)' : colors.gold, 
                  color: colors.dark, 
                  fontWeight: '800', 
                  fontSize: '0.9rem',
                  border: 'none', 
                  cursor: isGenerating ? 'not-allowed' : 'pointer', 
                  transition: '0.3s',
                  boxShadow: isGenerating ? 'none' : `0 15px 30px rgba(212, 136, 10, 0.3)`
                }}
              >
                {isGenerating ? 'IA PROCESSANDO CONTEÚDO...' : 'GERAR NOVA OPÇÃO DE POST'}
              </button>
            </div>

            {/* Dashboad de Métricas (Right Column) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '31px', marginBottom: '0px' }} /> {/* Espaçador para alinhar com o simulador */}
              
              <div style={{ 
                background: colors.glass, 
                padding: '40px', 
                borderRadius: '24px', 
                border: `1px solid ${colors.border}`, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexGrow: 1,
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(212, 136, 10, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.gold }}>
                      <LayoutDashboard size={28} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Painel de Controle</h3>
                      <p style={{ fontSize: '0.85rem', color: colors.textMuted }}>Métricas em tempo real da sua ótica.</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                    <div style={{ padding: '24px 20px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.7rem', color: colors.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Impressões</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: '900' }}>24.8k</div>
                      <div style={{ fontSize: '0.7rem', color: '#22c55e', marginTop: '8px', fontWeight: '600' }}>+15% este mês</div>
                    </div>
                    <div style={{ padding: '24px 20px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.7rem', color: colors.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Novos Leads</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: '900' }}>142</div>
                      <div style={{ fontSize: '0.7rem', color: '#22c55e', marginTop: '8px', fontWeight: '600' }}>85% convertidos</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '30px 25px', borderRadius: '20px', border: `1px solid ${colors.border}`, marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>Meta de Recall Ativo</span>
                      <span style={{ color: colors.gold, fontWeight: '800' }}>78%</span>
                    </div>
                    <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '78%', background: colors.gold }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '18px', borderRadius: '16px', background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.1)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 12px #22c55e' }} />
                  <span style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: '700', letterSpacing: '0.5px' }}>BOT WHATSAPP: ONLINE E RESPONDENDO</span>
                </div>
              </div>
              
              <div style={{ height: '70px' }} /> {/* Espaçador para alinhar o final do card com o botão do simulador */}
            </div>
          </div>
        </div>
      </section>

      {/* Sessão WhatsApp Automation (RECUPERADA) */}
      <section id="whatsapp" style={{ padding: '120px 20px', backgroundColor: 'rgba(34, 197, 94, 0.02)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '2.8rem', marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>
              Automação de <span style={{ color: '#22c55e' }}>WhatsApp Inteligente</span>
            </h2>
            <p style={{ color: colors.textMuted, fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
              Onde o lucro real acontece. Transformamos seu banco de dados em uma máquina de vendas recorrente.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {whatsappFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: colors.glass,
                  padding: '40px',
                  borderRadius: '24px',
                  border: `1px solid rgba(34, 197, 94, 0.1)`,
                  position: 'relative'
                }}
              >
                <div style={{ width: '50px', height: '50px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', marginBottom: '25px' }}>
                  <MessageCircle size={24} />
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', fontWeight: '700' }}>{feature.title}</h3>
                <p style={{ fontSize: '0.95rem', color: colors.textMuted, lineHeight: 1.6 }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <EmailMockupSection />
      <NumbersSection />
      <CalendarSection />

      <section style={{ padding: '120px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2.8rem', marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>
            Inovação <span style={{ color: colors.gold }}>exclusiva para Óticas</span>
          </h2>
          <p style={{ color: colors.textMuted, fontSize: '1.1rem' }}>O que nos diferencia de qualquer solução genérica.</p>
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
                position: 'relative'
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
                marginBottom: '24px'
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

      {/* Preços (RECUPERADA) */}
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
          gap: '30px'
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
