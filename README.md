🤖 L.I.A — Lixeira Inteligente Autônoma
Smart Trash AI • Sistema de monitoramento e controle de uma lixeira robótica inteligente

📖 Sobre

A L.I.A (Lixeira Inteligente Autônoma) é uma plataforma desenvolvida para monitorar e controlar uma lixeira robótica, combinando IoT, robótica, automação e inteligência artificial.

O projeto possui dashboard web, interface mobile, telemetria simulada, controles do robô, sensores, alertas e assistente de IA.

Status: protótipo funcional. A integração com hardware real está em desenvolvimento.

✨ Funcionalidades

🏠 Dashboard de monitoramento

📱 Interface responsiva/mobile

🎮 Controle de movimentação

🗑️ Controle da tampa

💡 Controle de LEDs

📡 Telemetria e sensores

🚨 Sistema de alertas

📊 Histórico de eventos

🧭 Modo Summon

👤 Modo Follow

🧠 Assistente de IA

🔊 Sistema de áudio

📱 Aplicação Android via Capacitor

🛠️ Tecnologias

React 19

TypeScript

Vite

Tailwind CSS

Lucide React

Recharts

Node.js

Express

Google Gemini

Capacitor

Android

📁 Estrutura

src/
├── assets/
├── components/
│   └── views/
├── lib/
├── App.tsx
├── index.css
├── main.tsx
└── types.ts

android/
server.ts
package.json
vite.config.ts
capacitor.config.ts

🚀 Instalação

Clone o projeto:

git clone https://github.com/LIA-Smart-Trash/Smart-_Trash-_AI_2026.git
cd Smart-_Trash-_AI_2026

Instale as dependências:

npm install

Execute:

npm run dev

A aplicação estará disponível em:

http://localhost:3000

🏗️ Build

npm run build

Para sincronizar com Android:

npx cap sync android
npx cap open android

🧠 Inteligência Artificial

A aplicação possui integração preparada com Google Gemini.

Crie um arquivo .env:

GEMINI_API_KEY=SUA_CHAVE_AQUI

Nunca publique chaves de API no GitHub.

📡 Futuro hardware

A arquitetura foi preparada para integração com ESP32 e sensores reais:

L.I.A App
│
▼
Backend / API
│
▼
ESP32
│
├── Sensores
├── Motores
├── Servo da tampa
└── LEDs

🔮 Roadmap

Interface de controle

Dashboard

Telemetria simulada

Alertas

Assistente IA

Projeto Android

Integração com ESP32

Sensores reais

Controle dos motores

Navegação autônoma

Follow real

Classificação de resíduos

Publicação na Google Play

🌱 Visão

A L.I.A busca unir:

IoT + Robótica + Inteligência Artificial + Sustentabilidade

para transformar a gestão de resíduos em uma experiência mais inteligente e autônoma.