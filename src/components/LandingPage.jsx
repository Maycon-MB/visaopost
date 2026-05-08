import React from 'react'
import { motion } from 'framer-motion'
import { 
  Eye, 
  Crown, 
  UserCheck, 
  Calendar, 
  MapPin, 
  Phone, 
  Instagram, 
  Star,
  ArrowRight,
  Clock,
  MessageCircle
} from 'lucide-react'

const LandingPage = () => {
  const brands = ['RAY-BAN', 'OAKLEY', 'PRADA', 'VOGUE', 'CARRERA', 'EMPORIO ARMANI', 'GRAZI', 'GUCCI']

  const reviews = [
    { name: 'Ana Beatriz', text: 'O atendimento visagista mudou minha autoestima! Encontrei óculos que realmente combinam comigo.', time: 'Cliente há 3 anos' },
    { name: 'Marcos Oliveira', text: 'Fiz meu exame e escolhi a armação no mesmo dia. Entrega rápida e o óculos é perfeito.', time: 'Cliente satisfeito' },
    { name: 'Juliana Costa', text: 'Ambiente super elegante e atendimento nota 1000. Não troco a Di Lorenzo por nenhuma outra.', time: 'Cliente fiel' }
  ]

  // Estilos inline para garantir as cores da marca sem depender de Tailwind
  const colors = {
    green: '#0D3322',
    orange: '#D4880A',
    orangeLight: '#F5A623',
    white: '#ffffff',
    gray: '#F8F9FA'
  }

  return (
    <div style={{ backgroundColor: '#fff', color: '#1A2E1C', fontFamily: "'Montserrat', sans-serif" }}>
      {/* Navbar Luxo */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        backgroundColor: colors.green, backdropFilter: 'blur(10px)',
        height: '80px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '50%', border: `2px solid ${colors.orange}`, 
              overflow: 'hidden', backgroundColor: colors.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '900', fontSize: '14px' 
            }}>
              <img 
                src="otica_logo.jpg" 
                alt="Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              DL
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff', letterSpacing: '1px' }}>DI LORENZO</span>
          </div>
          
          <div style={{ display: 'flex', gap: '30px' }} className="nav-links-container">
            {['Experiência', 'Grifes', 'Agendar', 'Unidade'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{
                textDecoration: 'none', color: '#fff', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8
              }}>
                {item}
              </a>
            ))}
          </div>

          <a href="#agendar" style={{
            backgroundColor: colors.orange, color: '#fff', padding: '12px 25px', borderRadius: '50px',
            textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem', transition: '0.3s'
          }}>
            AGENDAR EXAME
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{
        height: '90vh', minHeight: '600px', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#fff',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: -1,
          backgroundImage: 'linear-gradient(rgba(13, 51, 34, 0.7), rgba(13, 51, 34, 0.7)), url("/hero_otica_premium_1778270703774.png")',
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />

        <div style={{ maxWidth: '850px', padding: '0 20px' }}>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: colors.orange, background: 'rgba(212, 136, 10, 0.1)', padding: '5px 15px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', display: 'inline-block', border: `1px solid ${colors.orange}` }}
          >
            Tradição & Estilo em um só lugar
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, marginBottom: '25px', lineHeight: 1.1, color: colors.orange }}
          >
            Visão que Transforma seu Olhar
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ fontSize: '1.2rem', color: colors.orange, opacity: 0.9, marginBottom: '40px', maxWidth: '600px', marginInline: 'auto', fontWeight: 500 }}
          >
            A melhor curadoria de armações do mundo aliada à tecnologia de ponta para sua saúde ocular.
          </motion.p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#agendar" className="btn-p" style={{
              backgroundColor: colors.orange, color: '#fff', padding: '18px 45px', borderRadius: '50px',
              fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 10px 30px rgba(212, 136, 10, 0.4)'
            }}>
              Agendar Consulta
            </a>
            <a href="#grifes" className="btn-o" style={{
              backgroundColor: colors.orange, color: '#fff', padding: '18px 45px', borderRadius: '50px',
              fontWeight: 800, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 10px 30px rgba(212, 136, 10, 0.4)'
            }}>
              Conhecer Coleções
            </a>
          </div>
        </div>
      </header>

      {/* Diferenciais Section */}
      <section id="experiencia" style={{ padding: '100px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ color: colors.orange, fontWeight: 800, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Diferenciais</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', color: colors.green, fontWeight: 900 }}>Por que a Di Lorenzo?</h2>
            <p style={{ color: '#5A7A62', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Combinamos 15 anos de história com o que há de mais moderno no mercado óptico mundial.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {[
              { icon: Eye, title: 'Saúde em Foco', desc: 'Consultórios equipados com tecnologia alemã para um diagnóstico preciso e confortável do seu grau.' },
              { icon: Crown, title: 'Grifes Exclusivas', desc: 'Ray-Ban, Prada, Oakley e muito mais. Modelos que você só encontra aqui na região.' },
              { icon: UserCheck, title: 'Visagismo', desc: 'Consultoria personalizada para encontrar a armação que melhor se adapta ao formato do seu rosto.' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                style={{ padding: '40px', borderRadius: '25px', backgroundColor: '#F8F9FA', borderBottom: `5px solid ${colors.orange}`, transition: '0.4s' }}
              >
                <item.icon size={40} color={colors.orange} style={{ marginBottom: '25px' }} />
                <h3 style={{ fontSize: '1.4rem', color: colors.green, marginBottom: '15px', fontWeight: 800 }}>{item.title}</h3>
                <p style={{ color: '#5A7A62', fontSize: '0.95rem' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Impacto Visual - Óculos de Luxo */}
      <section style={{ padding: '100px 20px', backgroundColor: '#fff', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '60px' }}>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ flex: '1', minWidth: '300px' }}
          >
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3.5rem', fontWeight: 900, color: colors.green, lineHeight: 1.1, marginBottom: '30px' }}>
              A perfeição em <br /> cada <span style={{ color: colors.orange }}>detalhe</span>
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#5A7A62', lineHeight: 1.8, marginBottom: '40px' }}>
              Não vendemos apenas óculos. Entregamos uma nova forma de ver e ser visto pelo mundo. Nossa curadoria seleciona apenas peças que unem design atemporal e conforto absoluto.
            </p>
            <div style={{ display: 'flex', gap: '30px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: colors.orange }}>15+</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: colors.green }}>Anos de Tradição</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: colors.orange }}>20k+</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: colors.green }}>Vidas Transformadas</div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ flex: '1.2', minWidth: '350px', position: 'relative' }}
          >
            <img 
              src="/oculos_luxo_close_1778271030465.png" 
              alt="Detalhe Óculos" 
              style={{ width: '100%', borderRadius: '40px', boxShadow: '0 40px 80px rgba(0,0,0,0.15)' }} 
            />
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', backgroundColor: colors.orange, color: '#fff', padding: '20px', borderRadius: '20px', fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
              QUALIDADE <br /> PREMIUM
            </div>
          </motion.div>
        </div>
      </section>

      {/* Agendamento Section */}
      <section id="agendar" style={{ padding: '100px 20px', backgroundColor: colors.green, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '80px', alignItems: 'center' }}>
            <div>
              <span style={{ color: colors.orangeLight, fontWeight: 800, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Agendamento</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', color: '#fff', fontWeight: 900, marginBottom: '20px' }}>Pronta para ver o mundo melhor?</h2>
              <p style={{ marginBottom: '30px', opacity: 0.9 }}>Preencha os dados e nossa equipe entrará em contato via WhatsApp para confirmar o melhor horário para você.</p>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={18} /></div>
                  <span style={{ fontWeight: 600 }}>Confirmação em menos de 10 min</span>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Star size={18} /></div>
                  <span style={{ fontWeight: 600 }}>Exame gratuito na compra dos óculos</span>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '50px', borderRadius: '30px', color: '#1A2E1C', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '25px', color: colors.green, fontWeight: 800 }}>Agendar Visita</h3>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5A7A62', textTransform: 'uppercase' }}>Nome</label>
                  <input type="text" placeholder="Seu nome completo" style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #E9ECEF', background: '#F8F9FA' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5A7A62', textTransform: 'uppercase' }}>WhatsApp</label>
                  <input type="tel" placeholder="(00) 90000-0000" style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #E9ECEF', background: '#F8F9FA' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#5A7A62', textTransform: 'uppercase' }}>Qual o seu interesse?</label>
                  <select style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #E9ECEF', background: '#F8F9FA' }}>
                    <option>Exame de Vista</option>
                    <option>Novas Armações</option>
                    <option>Lentes de Contato</option>
                  </select>
                </div>
                <button type="submit" style={{ width: '100%', padding: '20px', background: colors.orange, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>Solicitar Agendamento</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Marcas Section */}
      <section id="grifes" style={{ padding: '100px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: colors.orange, fontWeight: 800, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Coleções</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', color: colors.green, fontWeight: 900, marginBottom: '40px' }}>As melhores marcas do mundo</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {brands.map((brand) => (
              <div key={brand} style={{ background: '#F8F9FA', padding: '15px 35px', borderRadius: '15px', fontWeight: 800, color: colors.green, border: '1px solid transparent', fontSize: '1rem' }}>
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos Section */}
      <section style={{ padding: '100px 20px', backgroundColor: '#F8F9FA' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ color: colors.orange, fontWeight: 800, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase' }}>Depoimentos</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', color: colors.green, fontWeight: 900 }}>O que dizem nossas clientes</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {reviews.map((review, i) => (
              <div key={i} style={{ background: '#fff', padding: '40px', borderRadius: '25px', position: 'relative', boxShadow: '0 5px 15px rgba(0,0,0,0.02)' }}>
                <div style={{ color: colors.orange, marginBottom: '20px', fontSize: '0.8rem' }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" style={{ display: 'inline' }} />)}
                </div>
                <p style={{ fontSize: '1rem', color: '#1A2E1C', marginBottom: '25px', lineHeight: 1.8, fontStyle: 'italic' }}>"{review.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: colors.green }}>{review.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#5A7A62' }}>{review.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unidade Section */}
      <section id="unidade" style={{ padding: '100px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px' }} className="unidade-grid">
            <div style={{ width: '100%', height: '400px', background: '#E9ECEF', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
              <img src="https://i.imgur.com/8Km9tLL.png" alt="Localização" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, filter: 'grayscale(1)' }} />
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', padding: '20px', background: '#fff', borderRadius: '15px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', fontSize: '0.8rem', fontWeight: 700 }}>
                <MapPin size={16} color={colors.orange} style={{ marginRight: '10px' }} />
                Rua das Óticas, 123 - Centro
              </div>
            </div>
            <div style={{ background: colors.green, color: '#fff', padding: '50px', borderRadius: '30px' }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '30px', fontWeight: 800 }}>Horário Local</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ opacity: 0.8 }}>Segunda a Sexta</span>
                <span style={{ fontWeight: 700, color: colors.orangeLight }}>08:00 - 18:00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ opacity: 0.8 }}>Sábado</span>
                <span style={{ fontWeight: 700, color: colors.orangeLight }}>08:00 - 12:00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0' }}>
                <span style={{ opacity: 0.8 }}>Domingo</span>
                <span style={{ fontWeight: 700, color: colors.orangeLight }}>Fechado</span>
              </div>
              <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}><Phone size={16} /> (00) 3333-4444</p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Instagram size={16} /> @oticadilorenzo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#05140B', padding: '80px 20px', color: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 900, marginBottom: '15px', display: 'block' }}>DI LORENZO</span>
          <p style={{ opacity: 0.6 }}>Especialistas em saúde visual e estilo desde 2011.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', margin: '30px 0' }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.8rem' }}>Política de Privacidade</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.8rem' }}>Termos de Uso</a>
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
            &copy; 2026 Ótica Di Lorenzo. Todos os direitos reservados.<br />
            Tecnologia <strong style={{ color: colors.orangeLight }}>VisaoPost</strong> por Maycon Bruno
          </div>
        </div>
      </footer>

      <a href="https://wa.me/5500000000000" target="_blank" style={{
        position: 'fixed', bottom: '100px', right: '30px', width: '65px', height: '65px',
        backgroundColor: '#25D366', color: '#fff', borderRadius: '50%', display: 'flex',
        alignItems: 'center', justifyContent: 'center', textDecoration: 'none', zIndex: 2000,
        boxShadow: '0 10px 30px rgba(37, 211, 102, 0.4)'
      }}>
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  )
}

export default LandingPage
