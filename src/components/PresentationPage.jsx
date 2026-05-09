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

  const postTemplates = [
    { tag: 'Nova Coleção', title: 'Armações Prada', desc: 'O estilo que você merece com a precisão que sua visão precisa. ✨ #Prada #VisaoPost', prompt: 'Novas armações Prada chegaram', img: '/oculos_luxo_close_1778271030465.png' },
    { tag: 'Promoção', title: 'Ray-Ban Wayfarer', desc: 'O clássico que nunca sai de moda. Aproveite 20% OFF esta semana! 😎 #RayBan #Promo', prompt: 'Promoção de Ray-Ban Verão', img: '/oculos_luxo_close_1778271030465.png' },
    { tag: 'Saúde Ocular', title: 'Exame de Vista', desc: 'Você sabia que deve revisar seu grau todo ano? Agende agora via WhatsApp! 📅 #Saude #Exame', prompt: 'Post sobre importância do exame', img: '/oculos_luxo_close_1778271030465.png' },
    { tag: 'Lançamento', title: 'Vogue Eyewear', desc: 'A sofisticação que seu olhar procura. Confira as cores exclusivas. 💅 #Vogue #Trend', prompt: 'Novidades da Vogue', img: '/oculos_luxo_close_1778271030465.png' },
    { tag: 'Performance', title: 'Oakley Sport', desc: 'Proteção e performance para o seu treino. Durabilidade extrema. 🚴‍♂️ #Oakley #Sport', prompt: 'Óculos Oakley para ciclistas', img: '/oculos_luxo_close_1778271030465.png' }
  ];

  const rotatePost = () => {
    setActivePost((prev) => (prev + 1) % postTemplates.length);
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
        padding: '160px 20px 100px',
        textAlign: 'center',
        backgroundColor: colors.dark
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
      <section id="demo" style={{ padding: '100px 20px' }}>
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
                  key={activePost}
                  placeholder="Ex: Promoção de Ray-Ban Verão..." 
                  defaultValue={postTemplates[activePost].prompt}
                  style={{ width: '100%', padding: '15px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}`, color: '#fff', fontSize: '1rem' }}
                />
              </div>
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activePost}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  style={{ background: '#fff', borderRadius: '15px', overflow: 'hidden', color: '#333' }}
                >
                  <div style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: colors.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '10px' }}>DL</div>
                    <span style={{ fontWeight: '700', fontSize: '13px' }}>Ótica Di Lorenzo</span>
                  </div>
                  <div style={{ height: '250px', background: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url("${postTemplates[activePost].img}")`, backgroundSize: 'cover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.9)', padding: '15px', borderRadius: '5px', textAlign: 'center', maxWidth: '80%', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                      <div style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: colors.orange }}>{postTemplates[activePost].tag}</div>
                      <div style={{ fontSize: '16px', fontWeight: '900' }}>{postTemplates[activePost].title}</div>
                      <div style={{ fontSize: '10px', marginTop: '5px' }}>Visite-nos hoje mesmo</div>
                    </div>
                  </div>
                  <div style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                      <Star size={16} fill="#333" />
                      <MessageCircle size={16} />
                    </div>
                    <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                      <b>oticadilorenzo</b> {postTemplates[activePost].desc}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <button 
                onClick={rotatePost}
                style={{ width: '100%', marginTop: '20px', padding: '15px', borderRadius: '10px', backgroundColor: colors.gold, color: colors.dark, fontWeight: '800', border: 'none', cursor: 'pointer', transition: '0.3s' }}
              >
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

      <EmailMockupSection />
      <NumbersSection />
      <CalendarSection />

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

      <footer style={{ padding: '80px 20px' }}>
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
