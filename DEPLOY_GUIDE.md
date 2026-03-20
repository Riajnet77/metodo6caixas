# 🚀 Guia Completo de Deploy - Método 6 Caixas

## Domínio: metodo6caixas.com.br

---

## 📋 PARTE 1: Preparar Backend (Railway)

### 1.1 Criar Conta no Railway
```
1. Acesse: https://railway.app
2. Clique em "Start a New Project"
3. Login com GitHub (recomendado)
```

### 1.2 Deploy do Backend
```
1. New Project → Deploy from GitHub repo
2. Selecione o repositório (ou faça upload)
3. Railway detecta Python automaticamente
4. Adicione variáveis de ambiente:
   - DB_NAME=financas
   - SECRET_KEY=seu-secret-key-aqui-123456
   - CORS_ORIGINS=https://metodo6caixas.com.br
5. Deploy automático!
```

### 1.3 Configurar MongoDB no Railway
```
1. No projeto Railway: Add Service → Database → MongoDB
2. Copia a MONGO_URL gerada
3. Adiciona como variável de ambiente no backend
```

### 1.4 Pegar URL do Backend
```
Após deploy completo:
→ Settings → Generate Domain
→ Exemplo: seu-app-production.up.railway.app
→ Copie essa URL (vai usar na Vercel)
```

**Custo Railway:** $5/mês (Hobby Plan)

---

## 📋 PARTE 2: Deploy Frontend (Vercel)

### 2.1 Criar Conta na Vercel
```
1. Acesse: https://vercel.com
2. Sign up with GitHub
3. Grátis para sempre!
```

### 2.2 Fazer Deploy
```
OPÇÃO A - GitHub (Recomendado):
1. New Project
2. Import Git Repository
3. Selecione seu repositório
4. Configure:
   - Framework Preset: Create React App
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: build

OPÇÃO B - Upload Direto:
1. Comprima a pasta /app/frontend em ZIP
2. Arraste para Vercel
3. Configure as mesmas opções acima
```

### 2.3 Configurar Variável de Ambiente
```
No dashboard da Vercel:
1. Settings → Environment Variables
2. Adicione:
   Name: REACT_APP_BACKEND_URL
   Value: https://seu-backend.up.railway.app
   (URL que você copiou do Railway)
3. Save
4. Redeploy (Deployments → ... → Redeploy)
```

---

## 📋 PARTE 3: Configurar Domínio

### 3.1 Na Vercel
```
1. Project → Settings → Domains
2. Add Domain: metodo6caixas.com.br
3. Vercel vai pedir para configurar DNS
4. Copie os nameservers ou registros DNS
```

### 3.2 No Registro.br (seu provedor de domínio)
```
OPÇÃO A - Nameservers (Mais fácil):
1. Login no Registro.br
2. Meus Domínios → metodo6caixas.com.br
3. Alterar Servidores DNS
4. Adicione os nameservers da Vercel:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com

OPÇÃO B - Registros DNS:
1. Adicione registro A:
   - Host: @
   - Tipo: A
   - Valor: 76.76.21.21 (IP da Vercel)
2. Adicione registro CNAME:
   - Host: www
   - Tipo: CNAME
   - Valor: cname.vercel-dns.com
```

### 3.3 Aguardar Propagação
```
⏱️ Tempo: 5 minutos a 48 horas
🔍 Verificar: https://dnschecker.org
✅ SSL: Automático (Vercel gera após DNS)
```

---

## 📋 PARTE 4: Testar Tudo

### 4.1 Verificar Backend
```
1. Acesse: https://seu-backend.up.railway.app/api/
2. Deve retornar: {"message": "O Hábito da Economia..."}
3. Se erro: Verificar logs no Railway
```

### 4.2 Verificar Frontend
```
1. Acesse: https://metodo6caixas.com.br
2. Teste registro de usuário
3. Teste login
4. Teste dashboard
5. Adicione despesa de teste
```

---

## 🔧 Variáveis de Ambiente - RESUMO

### Backend (Railway):
```bash
MONGO_URL=mongodb://...  # Gerado pelo Railway
DB_NAME=financas
SECRET_KEY=gere-um-segredo-forte-aqui
CORS_ORIGINS=https://metodo6caixas.com.br,https://www.metodo6caixas.com.br
```

### Frontend (Vercel):
```bash
REACT_APP_BACKEND_URL=https://seu-backend.up.railway.app
```

---

## 💰 Custos Totais

| Serviço | Custo |
|---------|-------|
| **Railway (Backend + MongoDB)** | $5/mês |
| **Vercel (Frontend)** | Grátis |
| **Domínio .com.br** | R$ 40/ano |
| **SSL** | Grátis |
| **TOTAL** | **≈ R$ 30/mês** |

---

## 🆘 Problemas Comuns

### Backend não inicia no Railway:
```
1. Verificar requirements.txt está correto
2. Verificar Procfile existe
3. Logs: Ver erros no Railway Dashboard
```

### Frontend não conecta com Backend:
```
1. Verificar REACT_APP_BACKEND_URL está correta
2. Verificar CORS no backend permite o domínio
3. Ver console do navegador (F12)
```

### Domínio não funciona:
```
1. Aguardar propagação DNS (até 48h)
2. Verificar em https://dnschecker.org
3. Limpar cache do navegador (Ctrl+Shift+Delete)
```

### SSL não ativa:
```
1. Vercel gera SSL automaticamente
2. Pode levar até 24h após DNS propagar
3. Forçar HTTPS: Vercel faz automaticamente
```

---

## 📞 Suporte

**Railway:** https://railway.app/help  
**Vercel:** https://vercel.com/support  
**Registro.br:** https://registro.br/ajuda

---

## ✅ Checklist Final

- [ ] Backend no Railway funcionando
- [ ] MongoDB conectado
- [ ] Frontend na Vercel funcionando
- [ ] Variável REACT_APP_BACKEND_URL configurada
- [ ] Domínio apontado para Vercel
- [ ] DNS propagado
- [ ] SSL ativo (cadeado verde)
- [ ] Teste completo: Registro → Login → Dashboard → Adicionar despesa

---

**Tudo pronto! Seu sistema estará no ar em metodo6caixas.com.br! 🚀**
