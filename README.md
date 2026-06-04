# Método HAG

Site institucional do consultório do Dr. Henrique Alves Gonzaga, médico com atuação em
nutrologia e medicina do esporte (CRM/SP 226530), sob a marca **Método HAG**.

Stack: **HTML + CSS + JavaScript vanilla**, sem frameworks. Mobile first, foco em
performance (meta Lighthouse 95+), acessibilidade e SEO básico. Publicação via **GitHub
Pages** (o `index.html` fica na raiz).

## Identidade visual (v2): luxo tech monocromático

- Grafite `#1E2023` como único acento; fundos `#FAFAF8` / `#F0F0EC`; hairlines `#E7E6E2`.
- Tipografia: **Space Grotesk** (display), **IBM Plex Sans** (corpo), **IBM Plex Mono**
  (eyebrows, etiquetas, números).
- Detalhes: marca `Método HAG_` com cursor, molduras de visor (cantos em L), etiquetas
  `HAG · NN`, divisores hairline, camada gráfica hi-tech (campo de pontos no hero e
  blueprint sutil em seções).
- Movimento: revelação no scroll (IntersectionObserver), parallax leve no desktop, hover
  refinado. Tudo em `transform`/`opacity` e respeitando `prefers-reduced-motion`.

## Estrutura

```
.
├── index.html              Home
├── sobre.html              Sobre o Dr. Henrique
├── metodo.html             Método HAG (filosofia de acompanhamento)
├── acompanhamento.html     Como funciona o acompanhamento (sem planos, sem preços)
├── atendimento.html        Tatuapé, Pinheiros e online (só bairros)
├── contato.html            Falar com a equipe (contate.me) + WhatsApp da equipe
├── privacidade.html        Política de Privacidade (LGPD)
├── design-system.html      Styleguide visual, referência interna (noindex)
├── favicon.svg             Monograma da marca (grafite)
├── robots.txt / sitemap.xml  SEO
└── assets/
    ├── css/hag.css         Design system (tokens, componentes, camada gráfica)
    ├── js/hag.js           Reveal no scroll, parallax, navegação mobile, ano
    └── img/                Imagens reais (quando houver)
```

Header e footer são consistentes em todas as páginas: o markup se repete, mas todo o
estilo e o comportamento vivem em `assets/css/hag.css` e `assets/js/hag.js`.

## Regras de conteúdo

- **Sem travessões (—)** como separador. Use vírgula, ponto ou ponto e vírgula.
- **Contato**: todos os botões e CTAs de contato apontam para `https://contate.me/dr-henrique`.
  Na página Contato também é exibido o WhatsApp da equipe: `+55 11 97796-2914`.
- **Conformidade CFM**: sem promessa de resultado, cura ou garantia; sem antes e depois; sem
  depoimento de resultado; sem preço. Tom técnico e sóbrio. Nenhuma imagem ou animação pode
  sugerir resultado de paciente.

## Rodar localmente

Por usar caminhos relativos, basta um servidor estático simples:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicar no GitHub Pages

1. Settings, Pages, Build and deployment, **Deploy from a branch**.
2. Branch `main`, pasta `/ (root)`.
3. Domínio personalizado (quando decidir ativar): configure em Pages e adicione um arquivo
   `CNAME` na raiz com `clinicahag.com`, mais o apontamento de DNS.

## Pendências (procure por `TODO` e `[PREENCHER:` )

- [x] **Domínio**: definido como `clinicahag.com` (apex). `canonical`, Open Graph, `robots.txt`
      e `sitemap.xml` já apontam para `https://clinicahag.com`.
- [x] **Contato**: CTAs em `contate.me/dr-henrique`; número `+55 11 97796-2914` exibido.
- [x] **Sobre**: formação e aperfeiçoamento preenchidos.
- [ ] **Contato** (`contato.html`): preencher o horário de atendimento da equipe.
- [ ] **Privacidade** (`privacidade.html`): preencher o canal do encarregado (DPO) e revisar
      com assessoria jurídica.
- [ ] **Imagem social** (opcional): adicionar `assets/img/og.jpg` (1200×630) e descomentar a
      metatag `og:image`.
- [ ] **Fotos**: substituir os blocos `.placeholder` (estilo visor) por `<img loading="lazy">`
      reais. O tratamento monocromático (dessaturação e contraste) já está no CSS; o grão fino
      entra junto com as fotos.
