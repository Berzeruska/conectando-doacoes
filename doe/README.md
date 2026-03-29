# 🤝 Conectando Doações

Plataforma web que conecta **doadores** e **instituições** (asilos, escolas, ONGs) de forma simples e acessível via QR Code.

🔗 **Demo ao vivo:** [https://doeja-2333f.web.app](https://doeja-2333f.web.app)

---

## 📱 Como funciona

1. **Doador** anuncia itens que deseja doar (título, descrição, categoria, foto, localização)
2. **Instituição** busca doações disponíveis e manifesta interesse
3. Ambos conversam pelo **chat interno** para combinar a retirada
4. Doador encerra a doação quando concluída

---

## ✨ Funcionalidades

- Login sem senha via **link mágico** enviado por e-mail
- Perfis distintos: **Doador** e **Instituição**
- Criação e gerenciamento de anúncios com upload de foto
- Busca e filtro de doações por categoria e localização
- Chat em tempo real entre doador e instituição (Firestore)
- Status de anúncios: disponível → reservado → finalizado
- Interface **mobile-first**, acessível via QR Code
- Hospedagem gratuita no Firebase Hosting

---

## 🏗️ Arquitetura

Aplicação web **estática e autocontida** — cada página é um arquivo HTML com CSS e JavaScript inline. Essa abordagem foi escolhida intencionalmente para:

- Eliminar a necessidade de bundler, build system ou servidor
- Simplificar o deploy em hospedagem estática
- Facilitar manutenção sem dependências de frameworks

O único arquivo compartilhado entre páginas é o `style.css` (estilos globais) e o `firebase-config.js` (configuração do Firebase).

---

## 🗂️ Estrutura de arquivos

```
├── index.html          # Página inicial e login (link mágico)
├── perfil.html         # Seleção de perfil no primeiro acesso
├── doador.html         # Dashboard do doador (gerenciar anúncios)
├── instituicao.html    # Dashboard da instituição (buscar doações)
├── chat.html           # Chat em tempo real entre os participantes
├── style.css           # Estilos globais compartilhados
├── firebase-config.js  # Configuração do Firebase (⚠️ não versionar em produção)
└── firebase.rules.js   # Regras de segurança do Firestore e RTDB
```

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Autenticação | Firebase Authentication (Email Link) |
| Banco de dados | Cloud Firestore |
| Armazenamento de fotos | Base64 inline no Firestore |
| Hospedagem | Firebase Hosting |

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Conta no [Firebase](https://console.firebase.google.com)
- Node.js instalado
- Firebase CLI: `sudo npm install -g firebase-tools`

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/conectando-doacoes.git
cd conectando-doacoes
```

**2. Configure o Firebase**

Crie um projeto no Firebase Console e ative:
- Authentication → Link de e-mail (sem senha)
- Firestore Database
- Realtime Database
- Firebase Hosting

**3. Configure as credenciais**

Edite o `firebase-config.js` com as credenciais do seu projeto:
```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO-default-rtdb.firebaseio.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

**4. Configure as regras do Firestore**

No Firebase Console → Firestore → Regras:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**5. Rode localmente**
```bash
firebase login
firebase init hosting
# Public directory: .
# Single-page app: No
# Overwrite index.html: No
```

Abra com Live Server no VS Code ou:
```bash
python3 -m http.server 8000
```

Acesse: `http://localhost:8000`

**6. Deploy**
```bash
firebase deploy --only hosting
```

---

## 📋 Regras de segurança

As regras de segurança completas estão no arquivo `firebase.rules.js`. Para produção, aplique as regras específicas por coleção em vez das regras abertas usadas no desenvolvimento.

---

## 🔮 Melhorias futuras

- [ ] Notificações push para novas mensagens
- [ ] Moderação de anúncios
- [ ] Avaliação pós-doação
- [ ] Integração com mapa para localização
- [ ] Histórico completo de doações por instituição
- [ ] Painel administrativo

---

## 📄 Licença

MIT License — sinta-se livre para usar, modificar e distribuir.

---

Feito com ❤️ para conectar quem quer ajudar com quem precisa.
