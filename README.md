# Método HAG — site institucional

Site institucional do consultório do Dr. Henrique Alves Gonzaga, médico nutrólogo e do
esporte (CRM/SP 226530), sob a marca **Método HAG**.

Stack: **HTML + CSS + JavaScript vanilla**, sem frameworks. Mobile first, foco em
performance (meta Lighthouse 95+), acessibilidade e SEO básico. Publicação via **GitHub
Pages** (o `index.html` fica na raiz).

## Estrutura

```
.
├── index.html              Home
├── sobre.html              Sobre o Dr. Henrique
├── metodo.html             Método HAG (filosofia de acompanhamento)
├── acompanhamento.html     Como funciona o acompanhamento (sem planos/preços)
├── atendimento.html        Tatuapé, Pinheiros e online (só bairros)
├── contato.html            Falar com a equipe (WhatsApp)
├── privacidade.html        Política de Privacidade (LGPD)
├── design-system.html      Styleguide visual — referência interna (noindex)
├── favicon.svg             Monograma da marca
├── robots.txt / sitemap.xml SEO
└── assets/
    ├── css/styles.css      Design system compartilhado (tokens + componentes)
    ├── js/main.js          Navegação mobile + ano do rodapé (mínimo)
    └── img/                Imagens reais (quando houver)
```

Header e footer são **compartilhados pelo design**: o markup se repete em cada página, mas
todo o estilo e o comportamento vivem em `assets/css/styles.css` e `assets/js/main.js`.

## Rodar localmente

Por usar caminhos relativos, basta um servidor estático simples:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicar no GitHub Pages

1. Settings → Pages → Build and deployment → **Deploy from a branch**.
2. Branch: a branch publicada (ex.: `main`) · pasta `/ (root)`.
3. Domínio personalizado (opcional): configure em Pages e adicione um arquivo `CNAME` na
   raiz com o domínio. Ajuste então as URLs canônicas/OG (veja abaixo).

## ✅ Antes de publicar — o que preencher

Procure por `TODO` e `[PREENCHER: ...]` no código. Os principais pontos:

- [ ] **WhatsApp**: trocar o número placeholder `5511000000000` pelo número real da
      secretaria em **todas** as páginas (busque por `wa.me/5511000000000`). Formato
      internacional, só dígitos (ex.: `5511987654321`).
- [ ] **Domínio**: confirmar o domínio de produção e ajustar as URLs em `<link rel="canonical">`
      e nas metatags Open Graph de cada página, além de `robots.txt` e `sitemap.xml`.
- [ ] **Sobre** (`sobre.html`): preencher formação e títulos **apenas com informações
      verificadas** (graduação, nutrologia, medicina do esporte). Nada foi presumido.
- [ ] **Contato** (`contato.html`): preencher o horário de atendimento da secretaria.
- [ ] **Privacidade** (`privacidade.html`): preencher o canal do encarregado (DPO) e revisar
      com assessoria jurídica.
- [ ] **Imagem social** (opcional): adicionar `assets/img/og.jpg` (1200×630) e descomentar a
      metatag `og:image`.
- [ ] **Fotos**: substituir os blocos `.placeholder` por `<img>` reais quando houver.

## Conformidade (CFM)

O conteúdo segue, por padrão: sem promessa de resultado/cura/garantia, sem antes-e-depois,
sem depoimento de resultado, sem preço de procedimento. Tom técnico e sóbrio. Mantenha
esse critério ao editar os textos.
