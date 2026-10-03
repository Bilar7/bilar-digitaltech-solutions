# Acessos Bilar — Firebase Spark

## Fluxo actual
1. O Super Admin `bilarjojofernando@gmail.com` entra após confirmar o email.
2. O sistema cria/garante automaticamente o documento `admins/{uid}` como `Super Admin`.
3. O Super Admin cria colaboradores em **Utilizadores & Permissões**.
4. O cliente cria a conta Firebase com uma palavra-passe temporária e envia a verificação de email.
5. O perfil `admins/{uid}` recebe a função escolhida e `mustChangePassword: true`.
6. No primeiro login, o colaborador é obrigado a trocar a palavra-passe.

## Por que não existe Cloud Functions agora
O fluxo actual funciona no plano Firebase Spark e não depende de Cloud Functions, Firebase Admin SDK ou Resend. A palavra-passe temporária é apresentada uma única vez ao Super Admin para partilha segura.

## Futuro
Uma camada de backend pode ser adicionada depois para automação de emails, auditoria e tarefas servidoras, sem alterar o modelo público/administrativo.
