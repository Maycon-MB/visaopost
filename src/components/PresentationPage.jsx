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
    setSelectedPlan(plan);
    setIsModalOpen(true);
    setStep(1);
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
      {/* Hero Section */}
      <section style={{
        padding: '140px 20px 100px',
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
            fontFamily: "'Playfair Display', serif",
            marginBottom: '20px',
            lineHeight: 1.1,
            fontWeight: 900
          }}>
            Escale sua Ótica no <br />
            <span style={{ 
              color: colors.gold,
              background: `linear-gradient(to right, ${colors.gold}, ${colors.goldLight})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Piloto Automático</span>
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: colors.textMuted,
            maxWidth: '850px',
            margin: '0 auto 48px',
            lineHeight: 1.6
          }}>
            A tecnologia que a Di Lorenzo usa para dominar o mercado local, agora disponível como serviço. 
            Atração, Conversão e Fidelização em uma única plataforma.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => document.getElementById('precos').scrollIntoView({ behavior: 'smooth' })}
              style={{
                backgroundColor: colors.gold,
                color: colors.dark,
                padding: '18px 36px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '800',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 10px 20px rgba(212, 136, 10, 0.3)'
              }}
            >
              CONHECER PLANOS <ChevronRight size={20} />
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: colors.white,
              padding: '18px 36px',
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
      <ProblemSection />

      {/* Fake Followers Warning */}
      <FakeFollowersSection />

      {/* Solution Flow */}
      <SolutionSection />

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
      <section style={{ 
        padding: '120px 20px', 
        backgroundColor: colors.primary,
        backgroundImage: `radial-gradient(circle at center, rgba(212, 136, 10, 0.05) 0%, transparent 70%)`
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.8rem', marginBottom: '20px', color: colors.white, fontFamily: "'Playfair Display', serif" }}>
            Estratégia: <span style={{ color: colors.gold }}>Marketing de Ciclo Completo</span>
          </h2>
          <p style={{ color: colors.textMuted, maxWeight: '750px', margin: '0 auto 80px', fontSize: '1.1rem' }}>
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
                color: colors.gold,
                featured: true
              },
              { 
                title: "3. Retenção (Recall)", 
                icon: <MessageCircle size={28} />, 
                desc: "O grande segredo: Nosso sistema identifica clientes que compraram há 1 ano e envia um convite automático via WhatsApp para renovar o exame. Dinheiro no caixa sem esforço.",
                color: '#22c55e'
              }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(0,0,0,0.2)',
                padding: '48px',
                borderRadius: '30px',
                border: item.featured ? `2px solid ${colors.gold}` : '1px solid rgba(255,255,255,0.1)',
                position: 'relative',
                transform: item.featured ? 'scale(1.05)' : 'none',
                boxShadow: item.featured ? '0 20px 40px rgba(0,0,0,0.3)' : 'none',
                zIndex: item.featured ? 2 : 1
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: item.color,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 30px',
                  color: colors.dark,
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
            Preços <span style={{ color: colors.blueLight }}>acessíveis para quem está começando</span>
          </h2>
          <p style={{ color: colors.textMuted, fontSize: '1.2rem' }}>Sem contrato de fidelidade. Cancela quando quiser.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {enrichedPlans.map((plan, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -15 }}
              onClick={() => handlePlanSelect(plan)}
              style={{
                background: plan.featured ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.dark} 100%)` : colors.glass,
                padding: '60px 40px',
                borderRadius: '40px',
                border: `1px solid ${plan.featured ? colors.gold : colors.border}`,
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {plan.featured && (
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: colors.gold,
                  color: colors.dark,
                  padding: '8px 24px',
                  borderRadius: '30px',
                  fontSize: '0.8rem',
                  fontWeight: '900',
                  letterSpacing: '1px'
                }}>
                  MAIS ESCOLHIDO
                </div>
              )}
              
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
                
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 50px 0', textAlign: 'left' }}>
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

              <button style={{
                width: '100%',
                padding: '22px',
                borderRadius: '16px',
                backgroundColor: colors.gold,
                color: colors.dark,
                fontWeight: '900',
                fontSize: '1.1rem',
                border: `2px solid ${colors.gold}`,
                cursor: 'pointer',
                transition: '0.3s',
                boxShadow: '0 15px 30px rgba(212, 136, 10, 0.2)'
              }} onClick={() => window.open('https://wa.me/5500000000000', '_blank')}>
                CONVERSAR AGORA
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WhatsApp Demo Section */}
      <section style={{ padding: '120px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2.8rem', marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>
            Atendimento & <span style={{ color: colors.gold }}>Fidelização</span>
          </h2>
          <p style={{ color: colors.textMuted, fontSize: '1.1rem' }}>Mais que um bot de respostas, um sistema de vendas que nunca esquece do seu cliente.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px', alignItems: 'center' }}>
          {/* WhatsApp Mockup */}
          <div style={{
            background: '#075E54',
            borderRadius: '40px',
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            border: '8px solid #222',
            position: 'relative'
          }}>
            <div style={{ padding: '20px', background: '#128C7E', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: colors.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.dark, fontWeight: '900' }}>DL</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: colors.white }}>Ótica Di Lorenzo</div>
                <div style={{ fontSize: '11px', opacity: 0.8, color: colors.white }}>online agora</div>
              </div>
            </div>
            <div style={{ padding: '25px', background: '#e5ddd5', height: '450px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
              <div style={{ alignSelf: 'flex-start', background: 'white', padding: '12px 18px', borderRadius: '0 20px 20px 20px', maxWidth: '85%', fontSize: '14px', color: '#333', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                Oi! Vocês fazem exame de vista? É pago?
                <div style={{ fontSize: '10px', color: '#999', textAlign: 'right', marginTop: '4px' }}>14:10</div>
              </div>
              <div style={{ alignSelf: 'flex-end', background: '#DCF8C6', padding: '12px 18px', borderRadius: '20px 20px 0 20px', maxWidth: '85%', fontSize: '14px', color: '#333', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                Olá! Sim, a Ótica Di Lorenzo realiza exame de vista gratuitamente 😊 Quer agendar para essa semana?
                <div style={{ fontSize: '10px', color: '#669966', textAlign: 'right', marginTop: '4px' }}>14:10 ✓✓</div>
              </div>
              <div style={{ alignSelf: 'flex-start', background: 'white', padding: '12px 18px', borderRadius: '0 20px 20px 20px', maxWidth: '85%', fontSize: '14px', color: '#333', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                Vocês atendem em domicílio também?
                <div style={{ fontSize: '10px', color: '#999', textAlign: 'right', marginTop: '4px' }}>14:11</div>
              </div>
              <div style={{ alignSelf: 'flex-end', background: '#DCF8C6', padding: '12px 18px', borderRadius: '20px 20px 0 20px', maxWidth: '85%', fontSize: '14px', color: '#333', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                Sim! Fazemos atendimento em domicílio 🏠 Ideal pra quem tem dificuldade de se locomover. Posso agendar uma visita?
                <div style={{ fontSize: '10px', color: '#669966', textAlign: 'right', marginTop: '4px' }}>14:11 ✓✓</div>
              </div>
            </div>
            <div style={{ padding: '15px', background: '#f0f0f0', display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, height: '40px', background: 'white', borderRadius: '20px' }}></div>
              <div style={{ width: '40px', height: '40px', background: '#128C7E', borderRadius: '50%' }}></div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '2rem', marginBottom: '30px', fontWeight: '800', color: colors.gold }}>Respostas instantâneas, 24h por dia</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {whatsappFeatures.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: colors.primary, color: colors.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${colors.gold}` }}>
                    <Check size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: colors.white }}>{item.title}</h4>
                    <p style={{ fontSize: '0.95rem', color: colors.textMuted, lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '80px 20px', borderTop: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Top: Logo + Social */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', gap: '20px' }}>
            <div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 900, color: colors.white }}>VisaoPost</span>
              <p style={{ color: colors.textMuted, fontSize: '0.9rem', marginTop: '8px' }}>Automação inteligente para óticas</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="https://www.instagram.com/mayconbruno00/" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                <Instagram size={20} />
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
