import React from 'react';
import { motion } from 'framer-motion';
import { colors, fonts, radii } from '../../styles/theme';
import { whatsappFeatures } from '../../data/content';
import { MessageCircle, Zap, ShieldCheck, TrendingUp } from 'lucide-react';

export default function WhatsAppSection() {
  const benefits = [
    { title: "Respostas Instantâneas", desc: "Seu cliente não espera. Atendimento qualificado 24/7.", icon: <Zap size={20} /> },
    { title: "Segurança de Dados", desc: "Gestão inteligente e segura do seu histórico de clientes.", icon: <ShieldCheck size={20} /> },
    { title: "Escalabilidade", desc: "Aumente sua conversão sem precisar aumentar sua equipe.", icon: <TrendingUp size={20} /> }
  ];

  return (
    <section id="whatsapp" style={{ padding: '140px 20px', maxWidth: '1100px', margin: '0 auto', background: 'transparent' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: '3rem', fontFamily: fonts.heading, marginBottom: '24px', color: '#1A2E1C' }}>
            Atendimento & <span style={{ color: colors.gold }}>Fidelização via WhatsApp</span>
          </h2>
          <p style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1.2rem', marginBottom: '40px', lineHeight: 1.6 }}>
            Onde o lucro real acontece. Transforme seu banco de dados em uma máquina de vendas recorrente com automação humana.
          </p>

            {/* Screen */}
            <div style={{ borderRadius: '28px', overflow: 'hidden', backgroundColor: '#E5DDD5', position: 'relative', height: '540px', display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '35px 16px 14px', backgroundColor: '#075E54' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#128C7E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
                  DL
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>Ótica Di Lorenzo</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '11px' }}>online agora</div>
                </div>
              </div>
              
              {/* Chat Area */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 14px', backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'contain' }}>
                <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: '0 12px 12px 12px', fontSize: '13px', backgroundColor: '#ffffff', color: '#111', alignSelf: 'flex-start', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', lineHeight: 1.4 }}>
                  Oi! Vocês fazem exame de vista?
                </div>
                <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: '12px 0 12px 12px', fontSize: '13px', backgroundColor: '#DCF8C6', color: '#111', alignSelf: 'flex-end', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', lineHeight: 1.4 }}>
                  Olá! Sim, realizamos gratuitamente 😊 Quer agendar para hoje?
                </div>
                <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: '0 12px 12px 12px', fontSize: '13px', backgroundColor: '#ffffff', color: '#111', alignSelf: 'flex-start', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', lineHeight: 1.4 }}>
                  Pode ser às 15h?
                </div>
                <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: '12px 0 12px 12px', fontSize: '13px', backgroundColor: '#DCF8C6', color: '#111', alignSelf: 'flex-end', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', lineHeight: 1.4 }}>
                  Agendado! ✅ Te esperamos na Unidade Premium.
                </div>
              </div>

              {/* Bottom Bar */}
              <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.9)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ flex: 1, height: '36px', borderRadius: '18px', backgroundColor: '#fff', border: '1px solid #eee', padding: '0 15px', display: 'flex', alignItems: 'center', color: '#999', fontSize: '13px' }}>
                  Digite uma mensagem...
                </div>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#128C7E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageCircle size={18} color="#fff" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
          >
            <h3 style={{ fontSize: '1.4rem', color: colors.white, marginBottom: '24px', fontWeight: '700' }}>Respostas instantâneas, 24h por dia</h3>
            {whatsappFeatures.map((feature, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px', padding: '16px 20px', backgroundColor: colors.glass, borderRadius: radii.md, border: `1px solid rgba(34, 197, 94, 0.1)` }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0, marginTop: '2px' }}>✓</div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>{feature.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: colors.textMuted }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
