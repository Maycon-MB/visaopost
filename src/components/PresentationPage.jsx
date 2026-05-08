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
  Users
} from 'lucide-react';

const PresentationPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    document: '',
    docType: 'CPF'
  });

  const colors = {
    dark: '#0B1F0F',
    primary: '#0D3322',
    gold: '#D4880A',
    goldLight: '#F5A623',
    white: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.7)',
    glass: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(212, 136, 10, 0.2)',
    blueLight: '#38bdf8'
  };

  const plans = [
    {
      name: 'Presença Digital',
      price: '97',
      setup: '800',
      description: 'Foco em visibilidade constante. Ideal para óticas que precisam de um Instagram profissional e ativo sem esforço manual.',
      features: [
        '20 posts/mês no Instagram',
        'Identidade visual exclusiva',
        'Personagem da marca (IA)',
        'Posts baseados no clima'
      ],
      color: colors.gold,
      featured: false
    },
    {
      name: 'Vendas Ativas',
      price: '197',
      setup: '1.000',
      description: 'Transforma seguidores em clientes reais. Inclui uma Landing Page de alta conversão e presença otimizada no Google.',
      features: [
        '30 posts/mês no Instagram',
        'Landing Page Premium',
        'Google Meu Negócio (SEO)',
        'Formulário de Leads direto'
      ],
      color: colors.goldLight,
      featured: true
    },
    {
      name: 'Piloto Automático',
      price: '297',
      setup: '1.500',
      description: 'O Ciclo Completo. Automação total de vendas e fidelização de clientes com o sistema de Recall.',
      features: [
        'Bot WhatsApp 24h (FAQ)',
        'Sistema de Recall (1 Ano)',
        'Modo Oferta Relâmpago',
        'Relatório de Vendas Mensal'
      ],
      color: colors.gold,
      featured: false
    }
  ];

  const innovationIdeas = [
    {
      title: "Personagem exclusivo da marca",
      desc: "Criamos um mascote digital único para a ótica usando IA generativa. Posts com personagens engajam muito mais que fotos de produto.",
      icon: <Wand2 size={24} />,
      badge: "Identidade Visual"
    },
    {
      title: "Posts baseados no clima",
      desc: "Dia de sol forte? Post de solar. Semana fria? Post de armações de grau. Conteúdo contextual em tempo real.",
      icon: <Sun size={24} />,
      badge: "Inovação"
    },
    {
      title: "Modo oferta relâmpago",
      desc: "Botão de emergência no painel: você toca e em 2 minutos um post promocional é criado e publicado.",
      icon: <Zap size={24} />,
      badge: "Diferencial"
    },
    {
      title: "Avaliações viram posts",
      desc: "Integração com Google Meu Negócio: avaliações 5 estrelas são transformadas em posts de prova social automaticamente.",
      icon: <Star size={24} />,
      badge: "Google Integration"
    },
    {
      title: "Instagram + Google juntos",
      desc: "Todo post vai para as duas redes simultaneamente. Dobra a presença sem dobrar o trabalho.",
      icon: <Globe size={24} />,
      badge: "Presença Dupla"
    },
    {
      title: "Landing Page inclusa",
      desc: "Criamos uma página profissional com horários, serviços e link para WhatsApp otimizada para o Google.",
      icon: <LayoutDashboard size={24} />,
      badge: "Website Grátis"
    }
  ];

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
          {plans.map((plan, index) => (
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
                border: 'none',
                backgroundColor: plan.featured ? colors.gold : 'transparent',
                color: plan.featured ? colors.dark : colors.gold,
                fontWeight: '900',
                fontSize: '1.1rem',
                border: `2px solid ${colors.gold}`,
                cursor: 'pointer',
                transition: '0.3s',
                boxShadow: plan.featured ? '0 15px 30px rgba(212, 136, 10, 0.2)' : 'none'
              }}>
                ASSINAR AGORA
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contract Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(15px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              style={{
                backgroundColor: colors.dark,
                width: '100%',
                maxWidth: '650px',
                borderRadius: '40px',
                border: `1px solid ${colors.gold}`,
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
              }}
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '30px',
                  right: '30px',
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none',
                  color: colors.white,
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>

              <div style={{ padding: '60px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{
                      height: '6px',
                      flex: 1,
                      backgroundColor: i <= step ? colors.gold : 'rgba(255,255,255,0.05)',
                      borderRadius: '3px',
                      transition: '0.5s'
                    }} />
                  ))}
                </div>

                {step === 1 && (
                  <div>
                    <div style={{ marginBottom: '10px', color: colors.gold, fontWeight: '700', fontSize: '0.9rem', letterSpacing: '1px' }}>PASSO 1 DE 3</div>
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '15px', fontFamily: "'Playfair Display', serif" }}>Gerar Contrato Digital</h2>
                    <p style={{ color: colors.textMuted, marginBottom: '35px' }}>
                      Você selecionou o plano <strong>{selectedPlan?.name}</strong>. Por favor, informe o documento para personalizarmos a proposta.
                    </p>
                    
                    <div style={{ marginBottom: '30px' }}>
                      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                        {['CPF', 'CNPJ'].map(type => (
                          <button
                            key={type}
                            onClick={() => setFormData({...formData, docType: type})}
                            style={{
                              flex: 1,
                              padding: '16px',
                              borderRadius: '12px',
                              border: `1px solid ${formData.docType === type ? colors.gold : colors.border}`,
                              backgroundColor: formData.docType === type ? 'rgba(212, 136, 10, 0.1)' : 'transparent',
                              color: formData.docType === type ? colors.gold : colors.textMuted,
                              cursor: 'pointer',
                              fontWeight: '700',
                              transition: '0.3s'
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      <input 
                        type="text" 
                        placeholder={formData.docType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                        style={{
                          width: '100%',
                          padding: '20px',
                          borderRadius: '16px',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          border: `1px solid ${colors.border}`,
                          color: 'white',
                          outline: 'none',
                          fontSize: '1.1rem',
                          fontFamily: 'monospace'
                        }}
                        onChange={(e) => setFormData({...formData, document: e.target.value})}
                      />
                    </div>

                    <button 
                      onClick={nextStep}
                      style={{
                        width: '100%',
                        padding: '22px',
                        borderRadius: '16px',
                        backgroundColor: colors.gold,
                        color: colors.dark,
                        fontWeight: '900',
                        fontSize: '1.1rem',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 10px 20px rgba(212, 136, 10, 0.3)'
                      }}
                    >
                      CONTINUAR <ChevronRight size={20} style={{ verticalAlign: 'middle', marginLeft: '5px' }} />
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <div style={{ marginBottom: '10px', color: colors.gold, fontWeight: '700', fontSize: '0.9rem', letterSpacing: '1px' }}>PASSO 2 DE 3</div>
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '35px', fontFamily: "'Playfair Display', serif" }}>Dados da Empresa</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                      <div style={{ position: 'relative' }}>
                        <Users size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: colors.gold }} />
                        <input 
                          type="text" 
                          placeholder="Nome da Ótica / Razão Social"
                          style={{
                            width: '100%',
                            padding: '20px 20px 20px 60px',
                            borderRadius: '16px',
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${colors.border}`,
                            color: 'white',
                            outline: 'none',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <Globe size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: colors.gold }} />
                        <input 
                          type="email" 
                          placeholder="E-mail profissional para o contrato"
                          style={{
                            width: '100%',
                            padding: '20px 20px 20px 60px',
                            borderRadius: '16px',
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${colors.border}`,
                            color: 'white',
                            outline: 'none',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <button onClick={prevStep} style={{ flex: 1, padding: '20px', borderRadius: '16px', border: `1px solid ${colors.border}`, color: 'white', background: 'none', fontWeight: '700', cursor: 'pointer' }}>VOLTAR</button>
                      <button onClick={nextStep} style={{ flex: 2, padding: '20px', borderRadius: '16px', backgroundColor: colors.gold, color: colors.dark, fontWeight: '900', border: 'none', cursor: 'pointer' }}>GERAR PROPOSTA</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div style={{ textAlign: 'center' }}>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10 }}
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '0 auto 30px',
                        color: '#22c55e',
                        border: '2px solid #22c55e'
                      }}
                    >
                      <ShieldCheck size={50} />
                    </motion.div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>Proposta Pronta!</h2>
                    <p style={{ color: colors.textMuted, marginBottom: '40px', fontSize: '1.1rem', lineHeight: 1.6 }}>
                      O contrato para o plano <strong>{selectedPlan?.name}</strong> foi enviado para o seu e-mail. 
                      Verifique sua caixa de entrada para realizar a assinatura digital agora mesmo.
                    </p>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      style={{
                        width: '100%',
                        padding: '22px',
                        borderRadius: '16px',
                        backgroundColor: colors.gold,
                        color: colors.dark,
                        fontWeight: '900',
                        fontSize: '1.1rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      ENTENDIDO, VOLTAR AO SITE
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              {[
                { title: "Horário de funcionamento", desc: "Responde instantaneamente, qualquer hora do dia ou da noite." },
                { title: "Exame de vista e serviços", desc: "Informa o que oferece sem você precisar digitar uma única palavra." },
                { title: "Formas de pagamento e localização", desc: "FAQ completo configurado no setup inicial da sua conta." },
                { title: "Encaminhamento inteligente", desc: "Perguntas complexas chegam com contexto já fornecido para o vendedor." }
              ].map((item, i) => (
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
      <footer style={{ padding: '80px 20px', borderTop: `1px solid ${colors.border}`, textAlign: 'center' }}>
        <img src="https://dilorenzo.com.br/wp-content/uploads/2023/05/logo-di-lorenzo.png" alt="Logo" style={{ height: '50px', marginBottom: '30px', filter: 'brightness(0) invert(1)' }} />
        <p style={{ color: colors.textMuted, fontSize: '0.9rem' }}>© 2026 VisaoPost SaaS - Todos os direitos reservados. Uma solução exclusiva Ótica Di Lorenzo.</p>
      </footer>
    </div>
  );
};

export default PresentationPage;
