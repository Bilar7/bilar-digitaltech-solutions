# Firebase — Bilar DigitalTech Solutions 2.0.0

## Projecto
- Firebase project: `bilar-digitaltech-soluti-45012`
- Plano: Spark
- Super Admin: `bilarjojofernando@gmail.com`

## Serviços utilizados
- Firebase Authentication: Email/Password e Google
- Cloud Firestore
- Firebase Hosting (opcional)
- Cloudinary Free para uploads de imagens

## Authentication
1. Authentication → Sign-in method → Email/Password → Activar.
2. Google pode ser activado para contas autorizadas.
3. Authentication → Settings → Authorized domains → adicionar `localhost`, `127.0.0.1` e o domínio de produção usado no lançamento.

## Firestore
Criar em Production mode e publicar `firestore.rules`.

O conteúdo público vive em `site/main`. Dados administrativos privados usam `admins`, `productOperations`, `labProjects` e `contactMessages` conforme as regras.

## Super Admin
A conta oficial é `bilarjojofernando@gmail.com`. Depois de confirmar o email, o sistema garante automaticamente o perfil `Super Admin` em `admins/{uid}`.

## Colaboradores
O Super Admin cria contas em **Utilizadores & Permissões**. O sistema gera uma palavra-passe temporária, envia a verificação de email e obriga a troca da palavra-passe no primeiro login.

## Media
Os uploads podem usar Cloudinary Free. O Firebase Storage não é necessário para o funcionamento base.
