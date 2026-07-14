# My Pokedex

Aplicativo mobile criado com Expo + React Native para consultar Pokemons, visualizar detalhes, status base e efetividade de tipos.

## Visao geral

O projeto utiliza roteamento por arquivos com `expo-router` e duas telas principais:

- `app/index.tsx`: lista de Pokemons com cache local e estado de carregamento.
- `app/[pokemonId].tsx`: tela de detalhes com descricao, atributos fisicos, tipos, status e counters.

## Funcionalidades

- Listagem de Pokemons com imagem oficial.
- Persistencia local com `@react-native-async-storage/async-storage`.
- Fallback offline: quando possivel, carrega dados do armazenamento local.
- Skeleton loading com `react-content-loader`.
- Tela de detalhes com:
   - descricao e categoria do Pokemon,
   - altura e peso,
   - tipos com cor e icone,
   - barras de status base,
   - fraquezas e vantagens por tipo.

## Stack e bibliotecas principais

- Expo SDK 53
- React 19 + React Native 0.79
- TypeScript
- Expo Router
- `pokenode-ts` (dados da PokeAPI)
- AsyncStorage
- `react-content-loader`
- `expo-network`

## Estrutura do projeto

```text
app/
   _layout.tsx          # configuracao global de rotas
   index.tsx            # home/listagem
   [pokemonId].tsx      # detalhes do pokemon
components/
   PokemonStatsCard.tsx
   utils/
      getColor.ts
      typeIcons.tsx
assets/
   images/
   fonts/
```

## Pre-requisitos

Antes de instalar, garanta que voce tenha:

1. Node.js LTS (recomendado: 18+)
2. npm (ja vem com o Node)
3. Expo Go no celular (opcional, para testar rapidamente)
4. Para emuladores:
    - Android Studio (Android)
    - Xcode (iOS, apenas macOS)

## Instalacao passo a passo

1. Clone o repositorio

```bash
git clone <url-do-repositorio>
```

2. Entre na pasta do projeto

```bash
cd my-pokedex
```

3. Instale as dependencias

```bash
npm install
```

4. Inicie o servidor de desenvolvimento

```bash
npm run start
```

5. Abra o app

- No celular (Expo Go): escaneie o QR code mostrado no terminal.
- Android emulador/dispositivo: pressione `a` no terminal ou execute:

```bash
npm run android
```

- iOS simulador (macOS): pressione `i` no terminal ou execute:

```bash
npm run ios
```

- Web:

```bash
npm run web
```

## Scripts disponiveis

- `npm run start`: inicia o Expo.
- `npm run android`: gera/executa build Android local (`expo run:android`).
- `npm run ios`: gera/executa build iOS local (`expo run:ios`).
- `npm run web`: executa no navegador.
- `npm run test`: executa testes com Jest em modo watch.
- `npm run lint`: roda lint com configuracao Expo.
- `npm run reset-project`: script utilitario para resetar estrutura base.

## Build com EAS (opcional)

O projeto possui configuracao em `eas.json` com perfis de build (`preview`, `production`, etc.).

Exemplo de build Android preview:

```bash
eas build --platform android --profile preview
```

## Testes

Para rodar os testes:

```bash
npm run test
```

Atualmente existe teste de snapshot para componente tematico em `components/__tests__/ThemedText-test.tsx`.

## Observacoes

- O app depende de internet para buscar dados da API na primeira carga.
- Depois da primeira sincronizacao, a lista pode ser reaproveitada do armazenamento local.

## Referencias

- Expo: https://docs.expo.dev/
- Expo Router: https://docs.expo.dev/router/introduction/
- PokeAPI (via pokenode-ts): https://pokeapi.co/
