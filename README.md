# Bilar DigitalTech Solutions — 2.0.0

Site institucional + Centro de Gestão da Bilar DigitalTech Solutions.

> **Ideias que conectam. Soluções que transformam.**

## Stack
- React + TypeScript + Vite
- Firebase Authentication + Firestore
- Firebase Spark (sem Cloud Functions obrigatórias)
- Conteúdo público controlado pelo Centro de Gestão

## Executar localmente
1. Instale Node.js LTS.
2. Execute `npm install`.
3. Execute `npm run lint`.
4. Execute `npm run build`.
5. Execute `npm run dev` ou `INICIAR_SITE.bat`.
6. Site: `http://localhost:5530/`
7. Gestão: `http://localhost:5530/admin`

O launcher trabalha sempre a partir da própria pasta do projecto e usa a porta 5530, evitando abrir uma cópia antiga presa numa porta diferente.

## Firebase
O projecto está ligado ao Firebase `bilar-digitaltech-soluti-45012`. O Super Admin inicial é `bilarjojofernando@gmail.com`. A configuração Web do Firebase está em `src/lib/firebase.ts`; as regras estão em `firestore.rules`.

## Gestão de conteúdo
O Super Admin gere a identidade da empresa, redes sociais, Hero, serviços, produtos, projectos, equipa, especialistas, insights, media, parceiros, carreiras e contactos. O conteúdo guardado no Firestore é reflectido no site público.

## Utilizadores
O Super Admin cria colaboradores no painel. O sistema gera uma palavra-passe temporária, envia a verificação de email pelo Firebase e obriga a alteração da palavra-passe no primeiro acesso.

## GitHub
O repositório está preparado para receber o código-fonte sem `node_modules`, `dist`, ficheiros `.env` ou caches locais.

Use `PUBLICAR_GITHUB.bat` para inicializar o repositório e fazer o primeiro push, depois de criar o repositório vazio no GitHub.
