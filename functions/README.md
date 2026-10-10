# Publicacao social Meta

A Function `publishMetaCampaign` prepara a publicacao de campanhas do Firestore em paginas Facebook e contas Instagram profissionais. O codigo esta preparado localmente; nao foi publicado nem ligado ao botao do painel.

## Requisitos

- Firebase project atualizado para Blaze para poder publicar Cloud Functions.
- Aplicacao Meta com acesso aprovado aos produtos e permissoes de publicacao necessarios.
- Pagina Facebook ligada a uma conta Instagram profissional.
- Imagem com URL HTTPS publicamente acessivel para publicacoes no Instagram.

## Configuracao segura

O token da Pagina fica no Firebase Secret Manager, nunca no frontend nem no Firestore:

```powershell
firebase functions:secrets:set META_PAGE_ACCESS_TOKEN
```

Introduza o token diretamente no prompt local do Firebase CLI. Nao o coloque no repositorio, numa mensagem ou num ficheiro `.env`.

Os parametros nao secretos sao pedidos pelo Firebase CLI no deploy ou podem ser definidos num ficheiro `.env.<project-id>` local, fora do controlo de versao:

- `META_PAGE_ID`
- `META_INSTAGRAM_ACCOUNT_ID`
- `META_GRAPH_API_VERSION` (por exemplo, o valor suportado pela aplicacao Meta configurada)

## Fases seguintes

1. Confirmar o plano Firebase e configurar a aplicacao/permissoes Meta.
2. Instalar as dependencias desta pasta com `npm install`.
3. Publicar primeiro as Firestore Rules e a Function, depois integrar o callable `publishMetaCampaign` no botao de confirmacao do painel.
4. Fazer um teste privado numa pagina de teste antes de permitir publicacoes reais.

A interface mantem a publicacao desativada ate a chamada callable ser integrada. A Function aceita apenas contas activas, com email confirmado e funcao `Marketing`, `Admin` ou `Super Admin`; impede publicacao duplicada do mesmo rascunho e guarda o resultado por canal.
