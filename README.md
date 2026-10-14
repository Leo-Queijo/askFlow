# askFlow

Aplicativo mobile de gerenciamento de tarefas, feito com **Expo (SDK 57)**, **React Native**, **TypeScript** e **Expo Router**. Cada usuário faz login e gerencia apenas as próprias tarefas. Os dados ficam salvos no dispositivo com **AsyncStorage**.

## Funcionalidades

- Login com sessão persistida e logout
- CRUD de tarefas (criar, listar, ver detalhes, editar, excluir) separado por usuário
- Filtro de tarefas por status
- Home com resumo das tarefas e frase motivacional vinda de uma API externa ([ZenQuotes](https://zenquotes.io))
- Tema claro e escuro, salvo entre sessões
- Configurações: dados do perfil, alternador de tema e preferência de tratamento (Sr., Sra., Srta.)

## Como executar

Pré-requisitos: Node.js 20+ e o app **Expo Go** no celular (ou um emulador).

```bash
npm install
npx expo start
```

Depois, leia o QR code com o Expo Go ou pressione `a` (Android), `i` (iOS) ou `w` (web) no terminal.

Verificação de tipos:

```bash
npx tsc --noEmit
```

## Usuários de teste

| Perfil        | Usuário | Senha |
| ------------- | ------- | ----- |
| Administrador | `admin` | `123` |
| Usuário comum | `user`  | `123` |

## Estrutura

```
src/
├── app/            # Rotas (Expo Router): cada arquivo é uma tela
│   ├── _layout.tsx         # Providers (tema, auth, tarefas) + bloqueio por login
│   └── (tabs)/             # Abas: Home, Tarefas, Configurações
│       └── tasks/          # Stack: lista, nova, detalhes ([id]), edição
├── components/     # Componentes reutilizáveis (Header, TaskCard, CustomButton...)
├── context/        # AuthContext, TaskContent (tarefas), ThemeContext
├── hooks/          # useAuth, useTasks, useTheme
├── screens/        # Telas: auth, home, tasks, settings
├── services/       # AsyncStorage (sessão, tarefas, preferências) e API
├── types/          # Tipos: user, task, theme, preferences
└── utils/          # generateId, validação de tarefas
```

## Persistência (AsyncStorage)

| Chave                        | Conteúdo                                 |
| ---------------------------- | ---------------------------------------- |
| `@askflow:session`           | Usuário autenticado                      |
| `@TaskFlow:tasks:<userId>`   | Tarefas do usuário                       |
| `@askflow:theme`             | Tema escolhido (`light` / `dark`)        |
| `@askflow:treatment:<userId>`| Tratamento preferido do usuário          |

## Tema

As cores ficam centralizadas no [`ThemeContext`](src/context/ThemeContext.tsx). As telas devem usar `useTheme()` em vez de valores fixos como `'#FFFFFF'`.

```tsx
import { useTheme } from "@/hooks/useTheme";

const { colors, isDark, toggleTheme } = useTheme();

<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.text }}>Olá</Text>
</View>;
```

Cores disponíveis: `background`, `card`, `text`, `primary`, `secondary`, `success`, `error`, `warning`, `border`, `muted`, `onPrimary`.

Enquanto o usuário não escolhe um tema em Configurações, o app segue o tema do sistema.

## Equipe

| #   | Responsabilidade                              |
| --- | --------------------------------------------- |
| 1   | Autenticação e sessão                         |
| 2   | CRUD de tarefas e persistência                |
| 3   | Navegação e telas de tarefas                  |
| 4   | Home, API e componentes reutilizáveis         |
| 5   | Tema, Configurações, acessibilidade e entrega |
