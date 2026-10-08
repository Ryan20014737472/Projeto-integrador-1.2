# Acrescentar gravações em Libras

A seção em `acessibilidade.html` lê `dados/videos.json` e apresenta controles nativos, legendas em português e transcrição expansível. Enquanto a lista está vazia, informa que as gravações ainda não estão disponíveis.

1. Produza a explicação com uma pessoa fluente em Libras, com mãos, rosto e expressões visíveis e iluminação adequada.
2. Revise ciência e tradução com as pessoas responsáveis pelo projeto.
3. Salve a gravação em `assets/videos/`, crie legendas `.vtt` e a transcrição, incluindo informações visuais relevantes.
4. Acrescente um item no formato abaixo usando arquivos existentes.

```json
{
  "videos": [
    {
      "titulo": "Como o coletor aquece a água",
      "arquivo": "assets/videos/aquecimento-libras.mp4",
      "legendas": "assets/videos/aquecimento-libras.vtt",
      "transcricao": "Transcrição completa e revisada da gravação."
    }
  ]
}
```

Esse exemplo é um formato; esses vídeos ainda não existem no projeto. O código aceita apenas arquivos da pasta local `assets/videos/`.

Exemplo de formato VTT, com tempos que devem ser adaptados à gravação:

```vtt
WEBVTT

00:00:00.000 --> 00:00:04.000
Texto correspondente a este trecho da gravação.
```

Revise reprodução, teclado, sincronia das legendas e transcrição antes de publicar.
