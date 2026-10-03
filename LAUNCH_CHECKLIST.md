# Bilar DigitalTech Solutions — Checklist de lançamento 2.0.0

## Código
- [ ] `npm install`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Não existe `node_modules/` no repositório
- [ ] Não existe `dist/` no repositório
- [ ] Não existem ficheiros `.env` com segredos

## Site público
- [ ] Header azul-navy e menu centralizado
- [ ] Hero legível, sem espaço vazio excessivo
- [ ] Slogan correcto: “Ideias que conectam. Soluções que transformam.”
- [ ] Texto do Hero correcto e legível
- [ ] Serviços, produtos e projectos responsivos
- [ ] Footer social uniforme em desktop, tablet e mobile
- [ ] Privacidade, Termos e Cookies abrem em modal

## Centro de Gestão
- [ ] Login por email funciona
- [ ] Verificação de email funciona
- [ ] Google só é usado para contas autorizadas
- [ ] Super Admin entra com `bilarjojofernando@gmail.com`
- [ ] Redes sociais podem ser editadas em **Empresa**
- [ ] Alterações em Empresa aparecem no público
- [ ] Super Admin consegue criar colaboradores
- [ ] Palavra-passe temporária + troca obrigatória no primeiro acesso

## Firebase
- [ ] Authentication → Email/Password activo
- [ ] Firestore criado
- [ ] `firestore.rules` publicado
- [ ] Domínios usados em produção adicionados em Authentication → Settings → Authorized domains

## GitHub
- [ ] Criar repositório vazio
- [ ] Executar `PUBLICAR_GITHUB.bat`
- [ ] Confirmar `main` no GitHub
- [ ] Confirmar que nenhum arquivo antigo de release/migração foi enviado
