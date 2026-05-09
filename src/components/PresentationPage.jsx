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

  // Removendo a barra inicial para funcionar no GitHub Pages subfolder
  const postTemplates = [
    { 
      tag: 'PRADA', 
      location: 'Ótica Di Lorenzo - Premium Store',
      img: 'stylish_person_glasses_1778289098822.png',
      desc: 'Sinta a exclusividade de uma das marcas mais desejadas do mundo. A nova coleção Prada chegou com modelos que unem design icônico e precisão impecável. ✨ #Prada #VisaoPost #OticaDeLuxo'
    },
    { 
      tag: 'RAY-BAN', 
      location: 'Shopping Village Mall',
      img: 'rayban_sunglasses_beach_1778289078548.png',
      desc: 'O sol de verão pede um clássico. Aproveite nossa oferta exclusiva de 20% OFF em toda a linha Aviator. O ícone que nunca sai de moda. 😎 #RayBan #SummerVibes #Promo'
    },
    { 
      tag: 'SAÚDE', 
      location: 'Centro de Exames de Vista',
      img: 'eye_exam_equipment_1778289213835.png',
      desc: 'Sua visão merece cuidado especializado. Nossos equipamentos de última geração garantem o diagnóstico mais preciso para o seu conforto visual. Agende seu exame! 📅 #SaudeOcular #ExameDeVista'
    },
    { 
      tag: 'VITRINE', 
      location: 'Visite nossa Unidade Conceito',
      img: 'optical_shop_display_1778289138291.png',
      desc: 'Um ambiente pensado para quem não abre mão do estilo. Venha conhecer nosso novo espaço e descubra por que somos referência em ótica premium. 💅 #Vogue #Trend2024 #Otica'
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
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          backgroundImage: 'linear-gradient(to bottom, rgba(11, 31, 15, 0.85), rgba(11, 31, 15, 0.95)), url("hero_otica_premium_1778270703774.png")',
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
            Conteúdo de Luxo para sua Ótica <br />
            <span style={{ color: colors.gold }}>Gerado em Segundos</span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: colors.textMuted,
            maxWidth: '700px',
            margin: '0 auto 50px',
            lineHeight: 1.6
          }}>
            Transforme seu Instagram em uma vitrine de grife. Automação completa de posts, legendas e engajamento.
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

      {/* Experiência da Plataforma (Simulador Real Instagram) */}
      <section id="demo" style={{ padding: '120px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.8rem', marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>
              O <span style={{ color: colors.gold }}>Instagram da sua Ótica</span> hoje
            </h2>
            <p style={{ color: colors.textMuted, fontSize: '1.1rem' }}>Sua vitrine digital no nível das maiores grifes do mundo.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'flex-start' }}>
            {/* Instagram Mockup Simulator */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: colors.gold, fontWeight: '700', fontSize: '0.9rem', marginBottom: '10px' }}>
                <Wand2 size={18} /> IA GERANDO CONTEÚDO...
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activePost}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                  style={{ 
                    background: '#fff', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                    color: '#000',
                    maxWidth: '450px',
                    margin: '0 auto'
                  }}
                >
                  {/* IG Header */}
                  <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)`, padding: '2px' }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#fff', padding: '1px' }}>
                          <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: '900' }}>DL</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700' }}>otica_di_lorenzo</span>
                        <span style={{ fontSize: '12px', color: '#666' }}>{postTemplates[activePost].location}</span>
                      </div>
                    </div>
                    <MoreHorizontal size={20} color="#666" />
                  </div>

                  {/* IG Image */}
                  <div style={{ position: 'relative', aspectRatio: '1/1', background: '#f0f0f0', overflow: 'hidden' }}>
                    {isGenerating && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '30px', height: '30px', border: `3px solid ${colors.gold}`, borderTopColor: 'transparent', borderRadius: '50%' }} />
                      </div>
                    )}
                    <img 
                      src={postTemplates[activePost].img} 
                      alt="Instagram Post"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* IG Interaction Bar */}
                  <div style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <Heart size={24} />
                        <MessageCircle size={24} />
                        <Send size={24} />
                      </div>
                      <Bookmark size={24} />
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>142 curtidas</div>
                    <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                      <span style={{ fontWeight: '700', marginRight: '6px' }}>otica_di_lorenzo</span>
                      {postTemplates[activePost].desc}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8e8e8e', marginTop: '8px', textTransform: 'uppercase' }}>HÁ 2 HORAS</div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <button 
                onClick={rotatePost}
                disabled={isGenerating}
                style={{ 
                  width: '100%', 
                  maxWidth: '450px',
                  margin: '10px auto 0',
                  padding: '16px', 
                  borderRadius: '12px', 
                  backgroundColor: isGenerating ? 'rgba(255,255,255,0.1)' : colors.gold, 
                  color: colors.dark, 
                  fontWeight: '800', 
                  fontSize: '1rem',
                  border: 'none', 
                  cursor: isGenerating ? 'not-allowed' : 'pointer', 
                  transition: '0.3s',
                  boxShadow: isGenerating ? 'none' : `0 10px 20px rgba(212, 136, 10, 0.3)`
                }}
              >
                {isGenerating ? 'IA PROCESSANDO DESIGN...' : 'GERAR NOVA OPÇÃO DE POST'}
              </button>
            </div>

            {/* Dashboad de Métricas Profissional */}
            <div style={{ background: colors.glass, padding: '40px', borderRadius: '30px', border: `1px solid ${colors.border}`, height: 'fit-content' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(212, 136, 10, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.gold }}>
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Performance Semanal</h3>
                  <p style={{ fontSize: '0.85rem', color: colors.textMuted }}>Sua ótica em crescimento constante.</p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.7rem', color: colors.textMuted, marginBottom: '5px', textTransform: 'uppercase' }}>Impressões</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900' }}>14.2k</div>
                  <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '5px' }}>+12% vs última semana</div>
                </div>
                <div style={{ padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.7rem', color: colors.textMuted, marginBottom: '5px', textTransform: 'uppercase' }}>Leads (WhatsApp)</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900' }}>84</div>
                  <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '5px' }}>+24% via Landing Page</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: `1px solid ${colors.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>Status do Agendador AI</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#22c55e', fontWeight: '700' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} /> ATIVO
                  </div>
                </div>
                <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginBottom: '15px' }}>
                  <div style={{ height: '100%', width: '85%', background: colors.gold }} />
                </div>
                <p style={{ fontSize: '0.8rem', color: colors.textMuted, lineHeight: 1.5 }}>
                  85% dos leads respondidos nos primeiros 2 minutos. O sistema identificou 12 novos exames agendados hoje.
                </p>
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
