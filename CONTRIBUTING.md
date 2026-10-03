# Colaborar no Bilar DigitalTech Solutions

## Antes de começar
- Instale Node.js LTS.
- Execute `npm install`.
- Execute `npm run lint` e `npm run build` antes de abrir um pull request.

## Regras do projecto
- Trabalhe numa branch própria; não faça alterações directamente em `main`.
- Não envie `node_modules`, `dist`, `.env` ou credenciais privadas.
- A configuração Web do Firebase em `src/lib/firebase.ts` é configuração pública do cliente; **nunca** coloque Firebase Admin SDK/service account ou outras chaves privadas no frontend.
- Alterações de conteúdo público devem ser feitas pelo Centro de Gestão quando forem dados que precisam de ser administráveis.
- Teste desktop, tablet e telemóvel.
- Evite adicionar bibliotecas apenas para resolver pequenos detalhes visuais.

## Conteúdo e redes sociais
O Super Admin gere empresa, Hero, contactos e redes sociais em **Admin → Empresa**. Os dados guardados no Firestore são usados pelo site público.

## Acessos
Não partilhe palavras-passe temporárias por commits, issues ou pull requests. O Super Admin cria colaboradores pelo painel.
