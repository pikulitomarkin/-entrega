# ÓEntrega

Sistema moderno de gestão de pedidos e entregas, com integração WhatsApp e IA.

## Funcionalidades
- Dashboard com estatísticas em tempo real
- Gestão de pedidos e entregas
- Níveis de acesso: admin e usuário
- Visual moderno com gradientes, glassmorphism e ícones grandes
- Integração com WhatsApp Web e OpenAI API
- Persistência local dos dados

## Tecnologias
- React + TypeScript
- Zustand (state management)
- TailwindCSS
- Vite
- Node.js (backend)
- whatsapp-web.js
- OpenAI API

## Como rodar o projeto

### Frontend
```bash
npm install
npm run dev
```

### Backend (WhatsApp Bot)

1. **Navegue até a pasta do bot:**
   ```bash
   cd whatsapp-bot
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   - Crie um arquivo chamado `.env` dentro da pasta `whatsapp-bot`.
   - Adicione sua chave da OpenAI neste formato:
     ```
     OPENAI_API_KEY=sua_chave_aqui
     ```

4. **Inicie o bot:**
   ```bash
   npm start
   ```

## Estrutura de pastas
```
src/
  pages/         # Telas principais
  components/    # Componentes reutilizáveis
  hooks/         # Hooks customizados
  services/      # Serviços e stores
  types/         # Tipos TypeScript
  utils/         # Funções utilitárias
```

## Níveis de acesso
- **admin**: acesso total ao sistema
- **usuário**: acesso restrito às funções básicas

## Customização visual
- Gradiente de fundo suave
- Cards com efeito glassmorphism
- Ícones grandes e coloridos
- Layout responsivo

## Contribuição
Pull requests são bem-vindos! Para sugestões, abra uma issue.

## Licença
MIT
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
