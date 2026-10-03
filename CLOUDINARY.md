# Cloudinary — configuração de produção Bilar 3.0.0

A versão de lançamento usa Cloudinary para imagens, evitando Firebase Storage.

## Configuração actual

```text
Cloud name: dczg8gaw
Upload preset: bilar_media
Mode: Unsigned
```

O Cloud name e o Upload preset unsigned são valores usados pelo cliente web e não são API secrets.

## Upload

O site:

1. recebe a imagem no navegador;
2. redimensiona quando necessário;
3. converte formatos raster para WebP quando necessário;
4. envia para `bilar_media`;
5. recebe a `secure_url`;
6. guarda essa URL no Firestore.
