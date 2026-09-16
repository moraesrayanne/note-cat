# Note Cat 🐾

Aplicativo mobile para controle de medicamentos de gatos. Registre os remédios do seu bichinho, acompanhe o histórico de doses e mantenha um diário de saúde completo.

> Feito com carinho para o Baden 🐱

---

## Screenshots

> _Em breve: adicionar screenshots ou GIF do app rodando_

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | [Expo](https://expo.dev) ~57 / React Native 0.86 |
| Linguagem | TypeScript |
| Backend / Auth | [Supabase](https://supabase.com) |
| Navegação | React Navigation v7 (stack + bottom tabs) |
| Notificações | Expo Notifications |
| Fontes | DM Sans (Expo Google Fonts) |

---

## Funcionalidades

- **Hoje** — lista os medicamentos do dia com status de tomado/pendente e barra de progresso
- **Remédios** — cadastro e gerenciamento de medicamentos (nome, dose, horário, frequência)
- **Histórico** — navegação por data com registro de doses tomadas
- **Diário** — anotações diárias de saúde com mini cards por entrada
- **Perfil** — nome e foto do gato, configurações da conta

---

## Arquitetura

```
src/
├── assets/          # Ícones e imagens exportados por index.ts
├── components/      # Componentes reutilizáveis (cada um com styles.ts co-localizado)
├── contexts/        # AuthContext, ProfileContext
├── hooks/           # useTodayMeds e outros hooks de negócio
├── lib/             # Clientes externos (Supabase)
├── navigation/      # AppNavigator, types de navegação
├── screens/         # Uma pasta por tela, index.tsx + styles.ts
├── services/        # Camada de acesso a dados (medications, diary, profile)
├── utils/           # Helpers de data/hora
├── theme.ts         # Cores e fontes centralizados
└── types.ts         # Tipos compartilhados
```

**Convenção de estilos:** todo `StyleSheet.create` fica em um arquivo `styles.ts` co-localizado com o componente, nunca inline.

---

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Conta no [Supabase](https://supabase.com) com o schema aplicado (`src/lib/supabase-schema.sql`)

### Instalação

```bash
git clone https://github.com/moraesrayanne/note-cat.git
cd note-cat
npm install
```

### Variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais do Supabase:

```bash
cp .env.example .env
```

### Iniciar

```bash
npx expo start
```

Escaneie o QR Code com o app [Expo Go](https://expo.dev/client) ou rode diretamente em um emulador Android.

### Build APK

```bash
npm run build:apk
```

Requer conta no [Expo Application Services (EAS)](https://expo.dev/eas) e o arquivo `eas.json` configurado.

---

## Banco de dados

O schema completo está em [`src/lib/supabase-schema.sql`](src/lib/supabase-schema.sql). Rode esse script no SQL Editor do seu projeto Supabase antes de iniciar o app.

---

## Licença

Uso pessoal. Feito para o Baden. 🐾
