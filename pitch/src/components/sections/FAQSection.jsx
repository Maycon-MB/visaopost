import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, fonts, radii } from '../../styles/theme';
import { ChevronDown, Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'Preciso baixar algum aplicativo novo?',
    a: 'Não. O Projeto foi desenhado para "fricção zero". Você recebe as prévias por e-mail ou WhatsApp e aprova com um toque. Todo o trabalho pesado acontece nos nossos servidores.'
  },
  {
    q: 'Os posts vão ter a cara da minha ótica?',
    a: 'Sim! Durante a configuração inicial, nós cadastramos sua logomarca, suas cores e o estilo da sua loja. A IA gera as artes respeitando rigorosamente a sua identidade visual.'
  },
  {
    q: 'Posso cancelar se não gostar?',
    a: 'Com certeza. Não temos contratos de fidelidade. Além disso, oferecemos uma garantia incondicional de 7 dias: se não gostar, devolvemos 100% do seu investimento.'
  },
  {
    q: 'É seguro conectar meu Instagram?',
    a: 'Totalmente. Utilizamos a API Oficial do Instagram (Graph API). Nós nunca pedimos sua senha pessoal e seguimos todos os protocolos de segurança da Meta.'
  },
  {
    q: 'E se eu quiser postar algo por conta própria?',
    a: 'Seu Instagram continua sendo seu. Você pode postar stories, reels ou fotos extras quando quiser. O Projeto garante que sua conta nunca fique vazia e sempre tenha conteúdo profissional.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" style={{ padding: '140px 20px', background: 'transparent' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '3rem', fontFamily: "'Playfair Display', serif", marginBottom: '20px', color: 'white' }}>
            Dúvidas <span style={{ color: colors.gold }}>Frequentes</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>
            Tudo o que você precisa saber para começar agora.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '16px',
              border: `1px solid ${openIndex === i ? colors.gold : 'rgba(255,255,255,0.1)'}`,
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              transition: '0.3s'
            }}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: '100%', padding: '24px', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', color: 'white'
                }}
              >
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{faq.q}</span>
                {openIndex === i ? <Minus size={20} color={colors.gold} /> : <Plus size={20} color={colors.gold} />}
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{
                      padding: '0 24px 24px',
                      color: 'rgba(255,255,255,0.6)',
                      lineHeight: 1.6,
                      fontSize: '0.95rem'
                    }}>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
