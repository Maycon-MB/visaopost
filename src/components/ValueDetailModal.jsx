import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Server, Brain, Zap, BarChart3, ShieldCheck, Info } from 'lucide-react';
import { colors, fonts } from '../styles/theme';

const ValueDetailModal = ({ isOpen, onClose, planName }) => {
  if (!isOpen) return null;

  const getDetailsByPlan = (name) => {
    const common = [
      {
        icon: <Brain size={24} color={colors.gold} />,
        title: 'Inteligência de Conteúdo',
        desc: 'Sua ótica nunca fica "em silêncio". Usamos tecnologia de ponta para criar artes e legendas que conectam com seus clientes todos os dias.'
      },
      {
        icon: <Zap size={24} color={colors.gold} />,
        title: 'Atualização Constante',
        desc: 'O Instagram muda as regras o tempo todo. Nossa manutenção garante que sua ótica continue aparecendo para as pessoas, sem que você precise estudar o algoritmo.'
      }
    ];

    if (name === 'Presença Digital') {
      return [
        {
          icon: <ShieldCheck size={24} color={colors.gold} />,
          title: 'Sua Vitrine Blindada',
          desc: 'Monitoramos sua conexão 24h para garantir que sua vitrine digital esteja sempre ativa e protegida contra quedas ou bloqueios.'
        },
        ...common,
        {
          icon: <Zap size={24} color={colors.gold} />,
          title: 'Postagem Automática',
          desc: 'Você ganha tempo. O sistema posta nos melhores horários para você, enquanto você foca no atendimento dentro da loja.'
        }
      ];
    }

    if (name === 'Vendas Ativas') {
      return [
        {
          icon: <Server size={24} color={colors.gold} />,
          title: 'Seu Site Sempre Rápido',
          desc: 'Garantimos que sua página de vendas abra instantaneamente no celular do cliente. Site lento perde venda, e nós cuidamos disso para você.'
        },
        ...common,
        {
          icon: <BarChart3 size={24} color={colors.gold} />,
          title: 'Destaque no Google',
          desc: 'Trabalho constante para garantir que sua ótica seja a primeira opção quando alguém pesquisar "ótica perto de mim".'
        }
      ];
    }

    // Piloto Automático
    return [
      {
        icon: <Zap size={24} color={colors.gold} />,
        title: 'Atendente Virtual 24h',
        desc: 'Manutenção do seu robô de WhatsApp que tira dúvidas e agenda exames mesmo quando sua loja está fechada ou sua equipe ocupada.'
      },
      ...common,
      {
        icon: <BarChart3 size={24} color={colors.gold} />,
        title: 'Recuperação de Clientes',
        desc: 'Sistema automático que "caça" clientes que não compram há 1 ano e os traz de volta para o exame de retorno.'
      }
    ];
  };

  const items = getDetailsByPlan(planName);

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)'
      }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          style={{
            width: '100%', maxWidth: '650px',
            backgroundColor: 'white',
            border: '1px solid rgba(0,0,0,0.05)',
            borderRadius: '32px',
            padding: '50px 40px',
            position: 'relative',
            boxShadow: '0 50px 100px rgba(0,0,0,0.2)'
          }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(0,0,0,0.05)', border: 'none', color: '#1A2E1C', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(212, 136, 10, 0.1)', marginBottom: '16px' }}>
              <ShieldCheck size={32} color={colors.gold} />
            </div>
            <h2 style={{ fontSize: '2rem', fontFamily: fonts.heading, color: '#1A2E1C', marginBottom: '12px' }}>
              O Valor da sua Assinatura
            </h2>
            <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '1rem' }}>Por que o plano <strong>{planName}</strong> garante o futuro da sua ótica.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px' }}>
            {items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flexShrink: 0, marginTop: '4px' }}>{item.icon}</div>
                <div>
                  <h4 style={{ color: '#1A2E1C', fontWeight: '800', marginBottom: '8px', fontSize: '1rem' }}>{item.title}</h4>
                  <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <h4 style={{ color: colors.gold, fontSize: '0.85rem', fontWeight: '900', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Comparativo de Valor:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left' }}>
              <div style={{ padding: '20px', background: 'rgba(0,0,0,0.02)', borderRadius: '16px' }}>
                <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '0.8rem', marginBottom: '6px' }}>Contratar Agência/Func</p>
                <p style={{ color: '#ff3b30', fontWeight: '800', fontSize: '1.2rem' }}>R$ 2.500+ /mês</p>
                <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '0.75rem', marginTop: '4px' }}>+ Encargos e incerteza.</p>
              </div>
              <div style={{ padding: '20px', background: 'rgba(212, 136, 10, 0.05)', borderRadius: '16px', border: '1px solid rgba(212, 136, 10, 0.1)' }}>
                <p style={{ color: colors.gold, fontSize: '0.8rem', marginBottom: '6px' }}>Sua Máquina VisaoPost</p>
                <p style={{ color: '#25d366', fontWeight: '800', fontSize: '1.2rem' }}>R$ {planName === 'Presença Digital' ? '97' : (planName === 'Vendas Ativas' ? '197' : '297')} /mês</p>
                <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.75rem', marginTop: '4px' }}>Tecnologia trabalhando 24/7.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ValueDetailModal;
