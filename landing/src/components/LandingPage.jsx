import React from 'react'
import { motion } from 'framer-motion'
import { colors, fonts, radii } from '../styles/theme'
import {
  Eye, Crown, UserCheck, MapPin, Phone, Instagram,
  Star, Clock, ExternalLink
} from 'lucide-react'

function WhatsAppIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
import CatalogSection from './sections/CatalogSection'

const WA_NUMBER = '5521964389591'
const WA_MSG = encodeURIComponent('Olá! Vim pelo site e quero agendar uma visita.')
const WA_HREF = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`

const { ochre, ochreLight, richBlack, ghostWhite, burgundy, sage } = colors
const muted = '#556068'
const fontStack = fonts.heading

const LandingPage = ({ baseUrl = '/' }) => {
  const img = (name) => `${baseUrl}${name}`
  const brands = ['RAY-BAN', 'OAKLEY', 'CHLOÉ', 'TOMMY HILFIGER', 'PRADA', 'VOGUE']
  const reviews = [
    { name: 'Ana Beatriz', text: 'O atendimento visagista mudou minha autoestima! Encontrei óculos que realmente combinam comigo.', time: 'Cliente há 3 anos' },
    { name: 'Marcos Oliveira', text: 'Fiz meu exame e escolhi a armação no mesmo dia. Entrega rápida e o óculos é perfeito.', time: 'Cliente satisfeito' },
    { name: 'Juliana Costa', text: 'Ambiente super elegante e atendimento nota 1000. Não troco a Di Lorenzo por nenhuma outra.', time: 'Cliente fiel' }
  ]

  return (
    <div style={{ backgroundColor: ghostWhite, color: richBlack, fontFamily: fontStack }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        backgroundColor: richBlack,
        height: '72px', display: 'flex', alignItems: 'center',
        borderBottom: `1px solid rgba(193,117,11,0.18)`
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%',
              border: `1.5px solid ${ochre}`,
              overflow: 'hidden', backgroundColor: richBlack,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: ochre, fontWeight: 700, fontSize: '13px', letterSpacing: '0.04em', flexShrink: 0
            }}>
              <img src={img('dl-logo.png')} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none' }} />
              DL
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontWeight: 400, fontSize: '18px', color: '#fff', letterSpacing: '0.04em' }}>
                di <em style={{ fontStyle: 'italic', color: ochre, fontWeight: 300 }}>Lorenzo</em>
              </span>
              <span style={{ fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase', color: `rgba(193,117,11,0.72)`, fontWeight: 600, marginTop: '3px' }}>ÓTICA</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '28px' }}>
            {[
              { label: 'Experiência', id: 'experiencia' },
              { label: 'Coleções', id: 'catalogo' },
              { label: 'Agendar', id: 'agendar' },
              { label: 'Unidade', id: 'unidade' }
            ].map((item) => (
              <a key={item.id} href={`#${item.id}`} style={{
                textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '13px',
                fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em',
                transition: 'color 140ms ease'
              }}
              onMouseEnter={e => e.target.style.color = ochre}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
              >{item.label}</a>
            ))}
          </div>

          <a href={WA_HREF} target="_blank" rel="noopener" style={{
            backgroundColor: ochre, color: '#fff', padding: '11px 24px',
            borderRadius: '50px', textDecoration: 'none', fontWeight: 700, fontSize: '13px',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            boxShadow: `0 6px 18px rgba(193,117,11,0.35)`
          }}>
            Agendar Exame
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header style={{
        height: '92vh', minHeight: '600px', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', color: '#fff', overflow: 'hidden', paddingTop: '72px',
        backgroundColor: richBlack
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(3, 25, 30, 0.72), rgba(3, 25, 30, 0.72)), url("${img('dl-loja.jpg')}")`,
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        {/* grain overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px' }} />
        <div style={{ position: 'relative', maxWidth: '820px', padding: '0 24px' }}>
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ color: ochre, background: 'rgba(193, 117, 11, 0.10)', padding: '6px 18px', borderRadius: '50px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '24px', display: 'inline-block', border: `1px solid rgba(193,117,11,0.35)` }}
          >
            Tradição &amp; Estilo em um só lugar
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontFamily: fontStack, fontSize: 'clamp(2.6rem, 8vw, 5rem)', fontWeight: 200, marginBottom: '24px', lineHeight: 1.0, letterSpacing: '0.02em' }}
          >
            Visão que Transforma<br /><em style={{ fontStyle: 'italic', color: ochre }}>seu Olhar</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.82)', marginBottom: '40px', maxWidth: '580px', marginInline: 'auto', lineHeight: 1.65, fontWeight: 300 }}
          >
            A melhor curadoria de armações do mundo aliada à tecnologia de ponta para sua saúde ocular.
          </motion.p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#agendar" style={{
              backgroundColor: ochre, color: '#fff', padding: '17px 42px',
              borderRadius: '50px', fontWeight: 700, textDecoration: 'none',
              textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '13px',
              boxShadow: `0 12px 32px rgba(193, 117, 11, 0.40)`
            }}>Agendar Consulta</a>
            <a href="#catalogo" style={{
              backgroundColor: 'transparent', color: ochre, padding: '17px 42px',
              borderRadius: '50px', fontWeight: 700, textDecoration: 'none',
              textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '13px',
              border: `1.5px solid ${ochre}`
            }}>Ver Coleções</a>
          </div>
        </div>
      </header>

      {/* Diferenciais */}
      <section id="experiencia" style={{ padding: '100px 20px', backgroundColor: ghostWhite }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ color: ochre, fontWeight: 700, fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Diferenciais</span>
            <h2 style={{ fontFamily: fontStack, fontSize: 'clamp(2rem, 5vw, 3rem)', color: richBlack, fontWeight: 300, letterSpacing: '0.02em', marginTop: '10px' }}>Por que a <em style={{ fontStyle: 'italic', color: ochre }}>Di Lorenzo?</em></h2>
            <p style={{ color: muted, fontSize: '1.05rem', maxWidth: '560px', margin: '12px auto 0', lineHeight: 1.65, fontWeight: 300 }}>Combinamos tradição com o que há de mais moderno no mercado óptico mundial.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              { icon: Eye, title: 'Saúde em Foco', desc: 'Consultórios equipados com tecnologia de ponta para um diagnóstico preciso e confortável do seu grau.' },
              { icon: Crown, title: 'Grifes Exclusivas', desc: 'As melhores marcas do mercado. Modelos que você só encontra aqui na região.' },
              { icon: UserCheck, title: 'Visagismo', desc: 'Consultoria personalizada para encontrar a armação que melhor se adapta ao formato do seu rosto.' }
            ].map((item, i) => (
              <motion.div key={i} whileHover={{ y: -6 }}
                style={{ padding: '40px 36px', borderRadius: radii.lg, backgroundColor: '#fff', borderBottom: `3px solid ${ochre}`, boxShadow: '0 4px 20px rgba(3,25,30,0.06)', transition: 'box-shadow 200ms ease' }}>
                <item.icon size={36} color={ochre} style={{ marginBottom: '22px' }} />
                <h3 style={{ fontSize: '1.25rem', color: richBlack, marginBottom: '12px', fontWeight: 500, letterSpacing: '0.02em' }}>{item.title}</h3>
                <p style={{ color: muted, fontSize: '0.95rem', lineHeight: 1.7, fontWeight: 300 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impacto visual */}
      <section style={{ padding: '100px 20px', backgroundColor: '#fff', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px' }}>
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            style={{ flex: '1', minWidth: '300px' }}>
            <span style={{ color: ochre, fontWeight: 700, fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Nossa essência</span>
            <h2 style={{ fontFamily: fontStack, fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', fontWeight: 200, color: richBlack, lineHeight: 1.05, margin: '14px 0 26px', letterSpacing: '0.02em' }}>
              A perfeição em <br />cada <em style={{ fontStyle: 'italic', color: ochre }}>detalhe</em>
            </h2>
            <p style={{ fontSize: '1.05rem', color: muted, lineHeight: 1.75, marginBottom: '36px', fontWeight: 300 }}>
              Não vendemos apenas óculos. Entregamos uma nova forma de ver e ser visto pelo mundo.
              Nossa curadoria seleciona apenas peças que unem design atemporal e conforto absoluto.
            </p>
            <div style={{ display: 'flex', gap: '36px' }}>
              <div>
                <div style={{ fontFamily: fontStack, fontSize: '2.6rem', fontWeight: 300, color: ochre, letterSpacing: '-0.02em' }}>15+</div>
                <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: richBlack, marginTop: '4px' }}>Anos de Tradição</div>
              </div>
              <div>
                <div style={{ fontFamily: fontStack, fontSize: '2.6rem', fontWeight: 300, color: ochre, letterSpacing: '-0.02em' }}>20k+</div>
                <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: richBlack, marginTop: '4px' }}>Vidas Transformadas</div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.93 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            style={{ flex: '1.2', minWidth: '340px', position: 'relative' }}>
            <img src={img('dl-oculos.png')} alt="Detalhe Óculos"
              style={{ width: '100%', borderRadius: radii.card, boxShadow: '0 40px 80px rgba(3,25,30,0.14)' }} />
            <div style={{ position: 'absolute', top: '-16px', right: '-16px', backgroundColor: ochre, color: '#fff', padding: '18px 20px', borderRadius: radii.md, fontWeight: 700, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1.5, boxShadow: `0 10px 24px rgba(193,117,11,0.35)` }}>
              QUALIDADE<br />PREMIUM
            </div>
          </motion.div>
        </div>
      </section>

      <CatalogSection />

      {/* Agendamento */}
      <section id="agendar" style={{ padding: '100px 20px', backgroundColor: richBlack, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        {/* radial accent */}
        <div style={{ position: 'absolute', top: '-160px', right: '-160px', width: '480px', height: '480px', borderRadius: '50%', background: `radial-gradient(circle, rgba(193,117,11,0.12), transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '72px', alignItems: 'center' }}>
            <div>
              <span style={{ color: ochreLight, fontWeight: 700, fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Agendamento</span>
              <h2 style={{ fontFamily: fontStack, fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', fontWeight: 200, letterSpacing: '0.02em', margin: '14px 0 18px' }}>
                Pronta para ver<br /><em style={{ fontStyle: 'italic', color: ochre }}>o mundo melhor?</em>
              </h2>
              <p style={{ marginBottom: '32px', opacity: 0.75, lineHeight: 1.7, fontWeight: 300, fontSize: '1.05rem' }}>Preencha os dados e abrimos o WhatsApp com sua solicitação. Nossa equipe confirma o horário rapidinho.</p>
              <div style={{ display: 'grid', gap: '18px' }}>
                {[
                  { icon: Clock, text: 'Confirmação em menos de 10 min' },
                  { icon: Star, text: 'Exame gratuito na compra dos óculos' }
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ width: '38px', height: '38px', background: 'rgba(193,117,11,0.14)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: ochre }}>
                      <Icon size={16} />
                    </div>
                    <span style={{ fontWeight: 500, fontSize: '15px' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ backgroundColor: ghostWhite, padding: '40px 36px', borderRadius: radii.xl, color: richBlack, boxShadow: '0 24px 52px rgba(3,25,30,0.38)', minWidth: 0, boxSizing: 'border-box' }}>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '28px', color: richBlack, fontWeight: 400, letterSpacing: '0.01em', fontFamily: fontStack }}>Agendar Visita</h3>
              <form onSubmit={(e) => {
                e.preventDefault()
                const nome = e.target[0].value
                const interesse = e.target[2].value
                const msg = encodeURIComponent(`Olá! Me chamo ${nome} e gostaria de agendar: ${interesse}.`)
                window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
              }} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {[
                  { label: 'Nome', type: 'text', placeholder: 'Seu nome completo' },
                  { label: 'WhatsApp', type: 'tel', placeholder: '(21) 90000-0000' },
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} required={i === 0}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '14px 16px', borderRadius: '10px', border: '1px solid #D8DCF0', background: '#fff', fontSize: '15px', fontFamily: fontStack, color: richBlack, outline: 'none' }} />
                  </div>
                ))}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.14em' }}>Interesse</label>
                  <select style={{ width: '100%', boxSizing: 'border-box', padding: '14px 16px', borderRadius: '10px', border: '1px solid #D8DCF0', background: '#fff', fontSize: '15px', fontFamily: fontStack, color: richBlack, outline: 'none' }}>
                    <option>Exame de Vista</option>
                    <option>Novas Armações</option>
                    <option>Lentes de Contato</option>
                    <option>Ajuste / Conserto</option>
                  </select>
                </div>
                <button type="submit" style={{ width: '100%', padding: '18px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontFamily: fontStack }}>
                  <WhatsAppIcon size={20} /> Chamar no WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Marcas */}
      <section id="grifes" style={{ padding: '90px 20px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: ochre, fontWeight: 700, fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Coleções</span>
          <h2 style={{ fontFamily: fontStack, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: richBlack, fontWeight: 300, letterSpacing: '0.02em', margin: '12px 0 40px' }}>As melhores marcas do mundo</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px' }}>
            {brands.map((brand) => (
              <div key={brand} style={{ background: ghostWhite, padding: '13px 30px', borderRadius: radii.sm, fontWeight: 700, color: richBlack, fontSize: '13px', letterSpacing: '0.12em', border: '1px solid #D8DCF0' }}>{brand}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section style={{ padding: '100px 20px', backgroundColor: ghostWhite }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ color: ochre, fontWeight: 700, fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Depoimentos</span>
            <h2 style={{ fontFamily: fontStack, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: richBlack, fontWeight: 300, letterSpacing: '0.02em', marginTop: '12px' }}>O que dizem <em style={{ fontStyle: 'italic', color: ochre }}>nossos clientes</em></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {reviews.map((review, i) => (
              <div key={i} style={{ background: '#fff', padding: '36px', borderRadius: radii.lg, boxShadow: '0 4px 20px rgba(3,25,30,0.06)', borderBottom: `2px solid ${ochre}` }}>
                <div style={{ color: ochre, marginBottom: '18px', display: 'flex', gap: '3px' }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                <p style={{ fontSize: '1rem', color: richBlack, marginBottom: '24px', lineHeight: 1.8, fontStyle: 'italic', fontWeight: 300 }}>"{review.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: richBlack }}>{review.name}</div>
                  <div style={{ fontSize: '12px', color: muted }}>{review.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unidade */}
      <section id="unidade" style={{ padding: '100px 20px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ color: ochre, fontWeight: 700, fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Localização</span>
            <h2 style={{ fontFamily: fontStack, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: richBlack, fontWeight: 300, letterSpacing: '0.02em', marginTop: '12px' }}>Venha nos visitar</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '36px', alignItems: 'stretch' }}>
            <div style={{ width: '100%', minHeight: '380px', background: ghostWhite, borderRadius: radii.xl, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', border: '1px solid #D8DCF0' }}>
              <img src="https://i.imgur.com/8Km9tLL.png" alt="Mapa" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25, filter: 'grayscale(1)' }} />
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', padding: '16px 20px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 28px rgba(3,25,30,0.12)', fontSize: '13.5px', fontWeight: 600, color: richBlack, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={15} color={ochre} />
                Endereço a confirmar
              </div>
            </div>
            <div style={{ background: richBlack, color: '#fff', padding: '46px', borderRadius: radii.xl, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: `radial-gradient(circle, rgba(193,117,11,0.15), transparent 70%)`, pointerEvents: 'none' }} />
              <h3 style={{ fontSize: '1.6rem', marginBottom: '28px', fontWeight: 400, letterSpacing: '0.01em', fontFamily: fontStack }}>Horários</h3>
              {[
                { dia: 'Segunda a Sexta', hora: '08:00 - 18:00' },
                { dia: 'Sábado', hora: '08:00 - 12:00' },
                { dia: 'Domingo', hora: 'Fechado' },
              ].map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 2 ? '1px solid rgba(193,117,11,0.16)' : 'none' }}>
                  <span style={{ opacity: 0.75, fontSize: '14px', fontWeight: 300 }}>{h.dia}</span>
                  <span style={{ fontWeight: 600, color: ochreLight, fontSize: '14px' }}>{h.hora}</span>
                </div>
              ))}
              <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid rgba(193,117,11,0.18)', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href={WA_HREF} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontWeight: 500 }}>
                  <Phone size={15} /> WhatsApp
                </a>
                <a href="https://instagram.com/otica.dilorenzo" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontWeight: 500 }}>
                  <Instagram size={15} /> @otica.dilorenzo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: richBlack, padding: '72px 20px', color: '#fff', textAlign: 'center', borderTop: `1px solid rgba(193,117,11,0.18)` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '11px', marginBottom: '14px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', border: `1.5px solid ${ochre}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ochre, fontSize: '12px', fontWeight: 700 }}>DL</div>
            <span style={{ fontFamily: fontStack, fontSize: '20px', fontWeight: 400, letterSpacing: '0.04em' }}>
              di <em style={{ fontStyle: 'italic', color: ochre, fontWeight: 300 }}>Lorenzo</em>
            </span>
          </div>
          <p style={{ opacity: 0.55, fontWeight: 300, fontSize: '14px' }}>Especialistas em saúde visual e estilo.</p>
          <div style={{ fontSize: '11.5px', opacity: 0.35, marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '36px' }}>
            &copy; {new Date().getFullYear()} Ótica Di Lorenzo. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* WhatsApp flutuante */}
      <a href={WA_HREF} target="_blank" rel="noopener" style={{
        position: 'fixed', bottom: '28px', right: '28px', width: '58px', height: '58px',
        backgroundColor: '#25D366', color: '#fff', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textDecoration: 'none', zIndex: 2000, boxShadow: '0 10px 28px rgba(37,211,102,0.38)'
      }}>
        <WhatsAppIcon size={26} />
      </a>
    </div>
  )
}

export default LandingPage
