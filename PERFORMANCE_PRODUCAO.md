# Desempenho e sincronização

## Imagens
- Hero local: WebP optimizado.
- Logo: WebP transparente optimizado, evitando injectar dezenas de milhares de elementos SVG no DOM.
- Uploads: compressão no navegador antes do Firebase Storage.
- Upload directo exige CORS no bucket.

## Sincronização
- `site/main` é observado por Firestore `onSnapshot` e as alterações são propagadas em tempo real para outros dispositivos.
- `labProjects` também usa `onSnapshot`.

## CORS do Storage
Aplicar `cors.json` ao bucket com:

`gcloud storage buckets update gs://bilar-digitaltech-solutions.firebasestorage.app --cors-file=cors.json`

O Cloud Storage exige uma configuração CORS para uploads directos efectuados pelo navegador.
