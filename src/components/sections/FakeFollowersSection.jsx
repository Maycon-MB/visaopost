import React from 'react';
import { motion } from 'framer-motion';
import { colors, fonts } from '../../styles/theme';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function FakeFollowersSection() {
  return (
    <section id="fake-followers" style={{ padding: '140px 20px', maxWidth: '1100px', margin: '0 auto', background: 'transparent' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        style={{ 
          background: 'rgba(255, 255, 255, 0.03)', 
          borderRadius: '40px', 
          padding: '80px 60px',
          border: '1px solid rgba(212, 136, 10, 0.1)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '100px', background: 'rgba(255, 77, 79, 0.1)', filter: 'blur(80px)', zIndex: 0 }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '32px' }}>
            <AlertTriangle color="#ff4d4f" size={48} />
            <ShieldAlert color="#ff4d4f" size={48} />
          </div>
          
          <h2 style={{ fontSize: '3rem', fontFamily: fonts.heading, color: 'white', marginBottom: '24px', lineHeight: 1.1 }}>
            A <span style={{ color: '#ff4d4f' }}>Limpeza de Contas Inativas</span> <br />
            da Meta em 2026
          </h2>
          
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            Ter 10 mil seguidores e 10 curtidas destrói sua autoridade. O algoritmo da Meta está punindo contas com baixo engajamento. 
            <strong> Não é sobre quantidade, é sobre clientes reais.</strong>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', textAlign: 'left' }}>
            {[
              { 
                title: "Amostragem Viciada", 
                desc: "O Instagram testa seu post com 5% dos seguidores. Se esses 5% forem bots ou contas inativas que não interagem, o algoritmo entende que seu conteúdo é 'ruim' e interrompe a entrega para o restante do seu público real.", 
                icon: "📉",
                detail: "Morte do Alcance"
              },
              { 
                title: "Sinal de Qualidade (ER)", 
                desc: "Sua Taxa de Engajamento é o 'Score' da sua conta. Perfis com baixo ER são classificados como 'Baixa Relevância' pela Meta, fazendo com que seus Stories e Reels fiquem escondidos no final da fila.", 
                icon: "🤖",
                detail: "Punição Silenciosa"
              },
              { 
                title: "Sujeira de Dados (LAL)", 
                desc: "Para quem investe em tráfego: sua base de seguidores alimenta o Lookalike (Público Semelhante). Se sua base tem bots, você pagará para o Facebook procurar mais pessoas 'parecidas com bots'.", 
                icon: "💸",
                detail: "Prejuízo no Tráfego"
              },
              { 
                title: "O Expurgo Meta 2026", 
                desc: "Em maio de 2026, o Instagram fez a maior varredura de sua história. Cristiano Ronaldo perdeu até 18 milhões de seguidores fantasmas e Beyoncé 4.4 milhões. A Meta está limpando a plataforma para proteger anunciantes. Quem não se adequar perderá a conta.", 
                icon: "⚠️",
                detail: "Ação Global da Meta"
              },
              { 
                title: "Otimização de Slots", 
                desc: "Cada conta tem um limite de distribuição orgânica. Não desperdice seus 'slots' de visualização com contas que nunca abrirão o app. Limpar o lixo garante que você apareça para quem realmente compra.", 
                icon: "🚀",
                detail: "Eficiência de Entrega"
              },
              { 
                title: "Quebra de Confiança", 
                desc: "Psicologia de Vendas: 10k seguidores e 10 curtidas gritam 'Fraude'. O cliente moderno é instruído e percebe o descompasso, o que destrói sua autoridade no momento decisivo da compra.", 
                icon: "🛡️",
                detail: "Autoridade Psicológica"
              }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ 
                  padding: '30px', 
                  borderRadius: '24px', 
                  background: 'rgba(255, 77, 79, 0.05)', 
                  border: '1px solid rgba(255, 77, 79, 0.15)',
                  position: 'relative'
                }}
              >
                <div style={{ 
                  position: 'absolute', top: '-12px', right: '20px',
                  background: '#ff4d4f', color: 'white', fontSize: '0.65rem',
                  padding: '4px 10px', borderRadius: '50px', fontWeight: '900',
                  boxShadow: '0 4px 12px rgba(255, 77, 79, 0.3)'
                }}>
                  {item.detail}
                </div>
                <div style={{ fontSize: '1.8rem', marginBottom: '15px' }}>{item.icon}</div>
                <h4 style={{ color: '#ff4d4f', fontWeight: 800, marginBottom: '10px', fontSize: '1.1rem' }}>{item.title}</h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
