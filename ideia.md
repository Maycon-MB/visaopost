Objetivo: Criar um sistema automatizado para gerar, agendar e postar conteúdos no Instagram com aprovação via mobile. O foco é baixo custo operacional e alta consistência visual para pequenos negócios.
1. Stack Tecnológico:
Backend: Python (para manipulação de imagem e IA) ou Node.js/TypeScript.
Frontend: React (PWA Mobile-first) para o painel do cliente.
Banco de Dados: PostgreSQL (Supabase) para fila, logs e preferências.
Infra: Docker (rodando em Railway ou Render).
APIs: Instagram Graph API (Oficial), OpenAI (GPT-4o-mini).
2. O Motor de Imagem "Inteligente":
Composição de Camadas (Lib Pillow): O script deve unir [Fundo] + [Personagem em poses variadas] + [Texto da IA].
Variedade Dinâmica: Implementar lógica para evitar repetições imediatas de assets. Incluir inversão de imagem (mirroring) e ajuste de cor da fonte baseado na cor predominante do fundo.
Mood & Assets: Vincular o "clima" da frase gerada pela IA (ex: motivacional, engraçado, sério) a pastas específicas de fundos e poses do personagem.
3. Inteligência e Calendário:
Sistema de Aprendizado: Criar campos de feedback na tabela de posts. O prompt da OpenAI deve ser few-shot, enviando os exemplos de maior sucesso/aprovação do cliente para guiar a criação de novos textos.
Calendário de Datas Comemorativas: Tabela auxiliar de feriados/eventos. Se data_post == feriado, o sistema deve ignorar o post regular e gerar um temático (ex: Natal, Black Friday) usando assets específicos para a data.
4. Fluxo do Cliente (UX):
Notificação: Bot de Telegram (grátis) notificando o cliente 1h antes da postagem programada com link para o PWA.
Painel de Aprovação (React): Interface simples para o cliente: Ver Preview -> Editar Legenda -> Aprovar/Agendar ou Reprovar (gerando nova opção).
5. Estrutura de Banco de Dados Desejada (PostgreSQL):
posts: id, image_url, caption, scheduled_at, status (draft/approved/posted), mood_tag, feedback_score, is_holiday (bool), metadata_assets (jsonb).
assets: id, type (bg/character), file_path, tags (mood/holiday).
6. Definição de Custos e Negócio (Para Referência):
Custo Operacional: ~R$ 35,00/mês (Hospedagem + OpenAI).
Ticket Sugerido: Setup (R

 1.500) + Mensalidade (R

 350).
