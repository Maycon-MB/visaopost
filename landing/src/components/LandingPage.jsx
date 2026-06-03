import React from 'react'
import { motion } from 'framer-motion'
import { colors, fonts, radii } from '../styles/theme'
import {
  Eye, Crown, UserCheck, MapPin, Phone, Instagram,
  Star, Clock, MessageCircle, ExternalLink
} from 'lucide-react'
import CatalogSection from './sections/CatalogSection'

const WA_NUMBER = '5521964389591'
const WA_MSG = encodeURIComponent('Olá! Vim pelo site e quero agendar uma visita.')
const WA_HREF = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`

const LandingPage = () => {
  const brands = ['RAY-BAN', 'OAKLEY', 'CHLOÉ', 'TOMMY HILFIGER', 'PRADA', 'VOGUE']
  const reviews = [
    { name: 'Ana Beatriz', text: 'O atendimento visagista mudou minha autoestima! Encontrei óculos que realmente combinam comigo.', time: 'Cliente há 3 anos' },
    { name: 'Marcos Oliveira', text: 'Fiz meu exame e escolhi a armação no mesmo dia. Entrega rápida e o óculos é perfeito.', time: 'Cliente satisfeito' },
    { name: 'Juliana Costa', text: 'Ambiente super elegante e atendimento nota 1000. Não troco a Di Lorenzo por nenhuma outra.', time: 'Cliente fiel' }
  ]

  const { landing } = colors

  return (
    <div style={{ backgroundColor: '#fff', color: '#1A2E1C', fontFamily: "'Montserrat', sans-serif" }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        backgroundColor: landing.green, backdropFilter: 'blur(10px)',
        height: '80px', display: 'flex', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              overflow: 'hidden', backgroundColor: landing.orange,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: '900', fontSize: '14px'
            }}>
              <img src="/otica_logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none' }} />
              DL
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff', letterSpacing: '1px' }}>DI LORENZO</span>
          </div>

          <div style={{ display: 'flex', gap: '30px' }}>
            {[
              { label: 'Experiência', id: 'experiencia' },
              { label: 'Coleções', id: 'catalogo' },
              { label: 'Agendar', id: 'agendar' },
              { label: 'Unidade', id: 'unidade' }
            ].map((item) => (
              <a key={item.id} href={`#${item.id}`} style={{
                textDecoration: 'none', color: '#fff', fontSize: '0.8rem',
                fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8
              }}>{item.label}</a>
            ))}
          </div>

          <a href={WA_HREF} target="_blank" rel="noopener" style={{
            backgroundColor: landing.orange, color: '#fff', padding: '12px 25px',
            borderRadius: '50px', textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem'
          }}>
            AGENDAR EXAME
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header style={{
        height: '90vh', minHeight: '600px', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', color: '#fff', overflow: 'hidden', paddingTop: '80px'
      }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: -1,
          backgroundImage: 'linear-gradient(rgba(13, 51, 34, 0.72), rgba(13, 51, 34, 0.72)), url("/hero_otica_premium_1778270703774.png")',
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        <div style={{ maxWidth: '850px', padding: '0 20px' }}>
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ color: landing.orange, background: 'rgba(212, 136, 10, 0.1)', padding: '5px 15px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', display: 'inline-block', border: `1px solid ${landing.orange}` }}
          >
            Tradição &amp; Estilo em um só lugar
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontFamily: fonts.heading, fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, marginBottom: '25px', lineHeight: 1.1, color: landing.orange }}
          >
            Visão que Transforma<br />seu Olhar
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ fontSize: '1.2rem', color: '#fff', opacity: 0.9, marginBottom: '40px', maxWidth: '600px', marginInline: 'auto', fontWeight: 400 }}
          >
            A melhor curadoria de armações do mundo aliada à tecnologia de ponta para sua saúde ocular.
          </motion.p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#agendar" style={{
              backgroundColor: landing.orange, color: '#fff', padding: '18px 45px',
              borderRadius: '50px', fontWeight: 800, textDecoration: 'none',
              textTransform: 'uppercase', letterSpacing: '1px',
              boxShadow: '0 10px 30px rgba(212, 136, 10, 0.4)'
            }}>Agendar Consulta</a>
            <a href="#catalogo" style={{
              backgroundColor: 'transparent', color: '#fff', padding: '18px 45px',
              borderRadius: '50px', fontWeight: 700, textDecoration: 'none',
              textTransform: 'uppercase', letterSpacing: '1px',
              border: '2px solid rgba(255,255,255,0.4)'
            }}>Ver Coleções</a>
          </div>
        </div>
      </header>

      {/* Diferenciais */}
      <section id="experiencia" style={{ padding: '100px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ color: landing.orange, fontWeight: 800, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Diferenciais</span>
            <h2 style={{ fontFamily: fonts.heading, fontSize: '2.8rem', color: landing.green, fontWeight: 900 }}>Por que a Di Lorenzo?</h2>
            <p style={{ color: landing.textMuted, fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Combinamos tradição com o que há de mais moderno no mercado óptico mundial.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {[
              { icon: Eye, title: 'Saúde em Foco', desc: 'Consultórios equipados com tecnologia de ponta para um diagnóstico preciso e confortável do seu grau.' },
              { icon: Crown, title: 'Grifes Exclusivas', desc: 'As melhores marcas do mercado. Modelos que você só encontra aqui na região.' },
              { icon: UserCheck, title: 'Visagismo', desc: 'Consultoria personalizada para encontrar a armação que melhor se adapta ao formato do seu rosto.' }
            ].map((item, i) => (
              <motion.div key={i} whileHover={{ y: -10 }}
                style={{ padding: '40px', borderRadius: radii.lg, backgroundColor: landing.gray, borderBottom: `5px solid ${landing.orange}` }}>
                <item.icon size={40} color={landing.orange} style={{ marginBottom: '25px' }} />
                <h3 style={{ fontSize: '1.4rem', color: landing.green, marginBottom: '15px', fontWeight: 800 }}>{item.title}</h3>
                <p style={{ color: landing.textMuted, fontSize: '0.95rem' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impacto visual */}
      <section style={{ padding: '100px 20px', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px' }}>
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            style={{ flex: '1', minWidth: '300px' }}>
            <h2 style={{ fontFamily: fonts.heading, fontSize: '3.5rem', fontWeight: 900, color: landing.green, lineHeight: 1.1, marginBottom: '30px' }}>
              A perfeição em <br />cada <span style={{ color: landing.orange }}>detalhe</span>
            </h2>
            <p style={{ fontSize: '1.1rem', color: landing.textMuted, lineHeight: 1.8, marginBottom: '40px' }}>
              Não vendemos apenas óculos. Entregamos uma nova forma de ver e ser visto pelo mundo.
              Nossa curadoria seleciona apenas peças que unem design atemporal e conforto absoluto.
            </p>
            <div style={{ display: 'flex', gap: '30px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: landing.orange }}>15+</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: landing.green }}>Anos de Tradição</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: landing.orange }}>20k+</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: landing.green }}>Vidas Transformadas</div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            style={{ flex: '1.2', minWidth: '350px', position: 'relative' }}>
            <img src="/oculos_luxo_close_1778271030465.png" alt="Detalhe Óculos"
              style={{ width: '100%', borderRadius: radii.card, boxShadow: '0 40px 80px rgba(0,0,0,0.15)' }} />
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', backgroundColor: landing.orange, color: '#fff', padding: '20px', borderRadius: radii.md, fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
              QUALIDADE<br />PREMIUM
            </div>
          </motion.div>
        </div>
      </section>

      <CatalogSection />

      {/* Agendamento */}
      <section id="agendar" style={{ padding: '100px 20px', backgroundColor: landing.green, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '80px', alignItems: 'center' }}>
            <div>
              <span style={{ color: landing.orangeLight, fontWeight: 800, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Agendamento</span>
              <h2 style={{ fontFamily: fonts.heading, fontSize: '2.8rem', color: '#fff', fontWeight: 900, marginBottom: '20px' }}>
                Pronta para ver<br />o mundo melhor?
              </h2>
              <p style={{ marginBottom: '30px', opacity: 0.9 }}>Preencha os dados e abrimos o WhatsApp com sua solicitação. Nossa equipe confirma o horário rapidinho.</p>
              <div style={{ display: 'grid', gap: '20px' }}>
                {[
                  'Confirmação em menos de 10 min',
                  'Exame gratuito na compra dos óculos'
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {i === 0 ? <Clock size={18} /> : <Star size={18} />}
                    </div>
                    <span style={{ fontWeight: 600 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '50px', borderRadius: radii.xl, color: landing.text, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '25px', color: landing.green, fontWeight: 800 }}>Agendar Visita</h3>
              <form onSubmit={(e) => {
                e.preventDefault()
                const nome = e.target[0].value
                const interesse = e.target[2].value
                const msg = encodeURIComponent(`Olá! Me chamo ${nome} e gostaria de agendar: ${interesse}.`)
                window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
              }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { label: 'Nome', type: 'text', placeholder: 'Seu nome completo' },
                  { label: 'WhatsApp', type: 'tel', placeholder: '(21) 90000-0000' },
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: landing.textMuted, textTransform: 'uppercase' }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} required={i === 0}
                      style={{ width: '100%', padding: '15px', borderRadius: radii.sm, border: '1px solid #E9ECEF', background: landing.gray, fontSize: '1rem' }} />
                  </div>
                ))}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: landing.textMuted, textTransform: 'uppercase' }}>Interesse</label>
                  <select style={{ width: '100%', padding: '15px', borderRadius: radii.sm, border: '1px solid #E9ECEF', background: landing.gray, fontSize: '1rem' }}>
                    <option>Exame de Vista</option>
                    <option>Novas Armações</option>
                    <option>Lentes de Contato</option>
                    <option>Ajuste / Conserto</option>
                  </select>
                </div>
                <button type="submit" style={{ width: '100%', padding: '20px', background: '#25D366', color: '#fff', border: 'none', borderRadius: radii.sm, fontWeight: 800, fontSize: '1rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <MessageCircle size={20} /> Chamar no WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Marcas */}
      <section id="grifes" style={{ padding: '100px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: landing.orange, fontWeight: 800, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Coleções</span>
          <h2 style={{ fontFamily: fonts.heading, fontSize: '2.8rem', color: landing.green, fontWeight: 900, marginBottom: '40px' }}>As melhores marcas do mundo</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {brands.map((brand) => (
              <div key={brand} style={{ background: landing.gray, padding: '15px 35px', borderRadius: radii.sm, fontWeight: 800, color: landing.green, fontSize: '1rem' }}>{brand}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section style={{ padding: '100px 20px', backgroundColor: landing.gray }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ color: landing.orange, fontWeight: 800, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Depoimentos</span>
            <h2 style={{ fontFamily: fonts.heading, fontSize: '2.8rem', color: landing.green, fontWeight: 900 }}>O que dizem nossos clientes</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {reviews.map((review, i) => (
              <div key={i} style={{ background: '#fff', padding: '40px', borderRadius: radii.lg, boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
                <div style={{ color: landing.orange, marginBottom: '20px' }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" style={{ display: 'inline' }} />)}
                </div>
                <p style={{ fontSize: '1rem', color: landing.text, marginBottom: '25px', lineHeight: 1.8, fontStyle: 'italic' }}>"{review.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: landing.green }}>{review.name}</div>
                  <div style={{ fontSize: '0.75rem', color: landing.textMuted }}>{review.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unidade */}
      <section id="unidade" style={{ padding: '100px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ color: landing.orange, fontWeight: 800, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Localização</span>
            <h2 style={{ fontFamily: fonts.heading, fontSize: '2.8rem', color: landing.green, fontWeight: 900 }}>Venha nos visitar</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
            <div style={{ width: '100%', height: '400px', background: landing.gray, borderRadius: radii.xl, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
              <img src="https://i.imgur.com/8Km9tLL.png" alt="Mapa" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, filter: 'grayscale(1)' }} />
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', padding: '20px', background: '#fff', borderRadius: radii.sm, boxShadow: '0 15px 35px rgba(0,0,0,0.1)', fontSize: '0.85rem', fontWeight: 700, color: landing.green, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color={landing.orange} />
                Endereço a confirmar
              </div>
            </div>
            <div style={{ background: landing.green, color: '#fff', padding: '50px', borderRadius: radii.xl }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '30px', fontWeight: 800 }}>Horários</h3>
              {[
                { dia: 'Segunda a Sexta', hora: '08:00 - 18:00' },
                { dia: 'Sábado', hora: '08:00 - 12:00' },
                { dia: 'Domingo', hora: 'Fechado' },
              ].map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                  <span style={{ opacity: 0.8 }}>{h.dia}</span>
                  <span style={{ fontWeight: 700, color: landing.orangeLight }}>{h.hora}</span>
                </div>
              ))}
              <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href={WA_HREF} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', textDecoration: 'none' }}>
                  <Phone size={16} /> WhatsApp
                </a>
                <a href="https://instagram.com/otica.dilorenzo" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', textDecoration: 'none' }}>
                  <Instagram size={16} /> @otica.dilorenzo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#05140B', padding: '80px 20px', color: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <span style={{ fontFamily: fonts.heading, fontSize: '2rem', fontWeight: 900, marginBottom: '15px', display: 'block' }}>DI LORENZO</span>
          <p style={{ opacity: 0.6 }}>Especialistas em saúde visual e estilo.</p>
          <div style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
            &copy; {new Date().getFullYear()} Ótica Di Lorenzo. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* WhatsApp flutuante */}
      <a href={WA_HREF} target="_blank" rel="noopener" style={{
        position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px',
        backgroundColor: '#25D366', color: '#fff', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textDecoration: 'none', zIndex: 2000, boxShadow: '0 10px 30px rgba(37,211,102,0.4)'
      }}>
        <MessageCircle size={28} />
      </a>
    </div>
  )
}

export default LandingPage
