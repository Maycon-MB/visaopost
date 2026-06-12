import React from 'react';
import { motion } from 'framer-motion';
import { colors, fonts, radii } from '../../styles/theme';
import { MessageCircle, Zap, ShieldCheck, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function WhatsAppSection() {
  const benefits = [
    { title: "Respostas Instantâneas", desc: "Seu cliente não espera. Atendimento qualificado 24/7.", icon: <Zap size={20} /> },
    { title: "Segurança de Dados", desc: "Gestão inteligente e segura do seu histórico de clientes.", icon: <ShieldCheck size={20} /> },
    { title: "Escalabilidade", desc: "Aumente sua conversão sem precisar aumentar sua equipe.", icon: <TrendingUp size={20} /> }
  ];

  return (
    <section id="whatsapp" style={{ 
      padding: '140px 20px', 
      background: 'transparent', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{ 
        position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', 
        background: 'radial-gradient(circle, rgba(212, 136, 10, 0.1) 0%, transparent 70%)',
        zIndex: 0
      }}></div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '80px', alignItems: 'center' }}>
          
          {/* Left: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
          >
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '3.5rem', fontFamily: fonts.heading, marginBottom: '24px', color: 'white', lineHeight: 1.1 }}>
                Atendimento & <br />
                <span style={{ color: colors.gold }}>Fidelização via WhatsApp</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', lineHeight: 1.6 }}>
                Onde o lucro real acontece. Transforme seu banco de dados em uma máquina de vendas recorrente com automação humana.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {benefits.map((benefit, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '14px', 
                    backgroundColor: 'rgba(212, 136, 10, 0.15)', color: colors.gold,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    border: '1px solid rgba(212, 136, 10, 0.2)'
                  }}>
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginBottom: '6px' }}>{benefit.title}</h4>
                    <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Phone Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            style={{ position: 'relative', justifySelf: 'center' }}
          >
            {/* External Border (Phone Case) */}
            <div style={{ 
              width: '320px', height: '650px', background: '#000', 
              borderRadius: '50px', border: '12px solid #1f1f1f', 
              boxShadow: '0 50px 100px rgba(0,0,0,0.5)', position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Notch */}
              <div style={{ 
                position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
                width: '150px', height: '30px', background: '#1f1f1f', 
                borderRadius: '0 0 20px 20px', zIndex: 10
              }}></div>

              {/* Screen */}
              <div style={{ backgroundColor: '#E5DDD5', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* WhatsApp Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '45px 16px 15px', backgroundColor: '#075E54' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#128C7E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
                    DL
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>Sua Ótica</div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '11px' }}>online agora</div>
                  </div>
                </div>
                
                {/* Chat Area */}
                <div style={{ 
                  flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 14px', 
                  backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', 
                  backgroundSize: 'cover' 
                }}>
                  <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: '0 12px 12px 12px', fontSize: '13px', backgroundColor: '#ffffff', color: '#111', alignSelf: 'flex-start', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                    Oi! Vocês fazem exame de vista?
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: '12px 0 12px 12px', fontSize: '13px', backgroundColor: '#DCF8C6', color: '#111', alignSelf: 'flex-end', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                  >
                    Olá! Sim, realizamos gratuitamente 😊 Quer agendar para hoje?
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: '0 12px 12px 12px', fontSize: '13px', backgroundColor: '#ffffff', color: '#111', alignSelf: 'flex-start', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                  >
                    Pode ser às 15h?
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                    style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: '12px 0 12px 12px', fontSize: '13px', backgroundColor: '#DCF8C6', color: '#111', alignSelf: 'flex-end', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                  >
                    Agendado! ✅ Te esperamos na Unidade Premium.
                  </motion.div>
                </div>

                {/* Bottom Bar */}
                <div style={{ padding: '15px 10px 25px', backgroundColor: '#f0f0f0', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ flex: 1, height: '40px', borderRadius: '20px', backgroundColor: '#fff', border: '1px solid #ddd', padding: '0 15px', display: 'flex', alignItems: 'center', color: '#999', fontSize: '14px' }}>
                    Mensagem
                  </div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#128C7E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageCircle size={20} color="#fff" />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Badge */}
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 2, type: 'spring' }}
              style={{ 
                position: 'absolute', bottom: '60px', right: '-40px', 
                backgroundColor: colors.gold, color: '#0D3322', padding: '18px 28px', 
                borderRadius: '24px', fontWeight: '900', boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                display: 'flex', alignItems: 'center', gap: '12px', zIndex: 20,
                fontSize: '0.9rem', border: '2px solid rgba(255,255,255,0.2)'
              }}
            >
              <CheckCircle2 size={22} />
              AUTOMAÇÃO ATIVA
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
