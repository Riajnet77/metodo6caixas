# 🚀 Deploy Rápido - 3 Passos

## 📦 PASSO 1: Backend no Railway (5 min)

1. **Acesse:** https://railway.app
2. **New Project** → Empty Project
3. **Add Service** → Database → **MongoDB**
4. **Add Service** → GitHub Repo (ou Upload dos arquivos de /app/backend)
5. **Variáveis de Ambiente:**
   ```
   MONGO_URL → Copiar do serviço MongoDB
   DB_NAME → financas
   SECRET_KEY → metodo6caixas-secret-2025
   CORS_ORIGINS → https://metodo6caixas.com.br
   ```
6. **Settings** → **Generate Domain**
7. **✅ Copie a URL** (exemplo: api-production.up.railway.app)

---

## 🌐 PASSO 2: Frontend na Vercel (3 min)

1. **Acesse:** https://vercel.com
2. **New Project** → Import Git Repository
3. **Configurações:**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
4. **Environment Variables:**
   ```
   REACT_APP_BACKEND_URL → https://sua-api.up.railway.app
   (Cole a URL do Railway do passo 1)
   ```
5. **Deploy**
6. **✅ Vercel gera URL** (exemplo: metodo6caixas.vercel.app)

---

## 🔗 PASSO 3: Configurar Domínio (10 min)

1. **Na Vercel:**
   - Settings → Domains
   - Add: `metodo6caixas.com.br`
   - Vercel mostra os nameservers

2. **No Registro.br:**
   - Login → Meus Domínios
   - metodo6caixas.com.br → Alterar Servidores DNS
   - Adicionar nameservers da Vercel:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```

3. **Aguardar:** 5min a 48h (geralmente 1-2 horas)

4. **✅ SSL Automático** (Vercel ativa sozinho)

---

## 🎯 Acesse: https://metodo6caixas.com.br

**Pronto! 🎉**

---

## 💰 Custo: ~R$ 30/mês

- Railway: $5/mês
- Vercel: Grátis
- Domínio: R$ 40/ano

---

## 🆘 Problemas?

**Backend não funciona:**
- Railway → Deployments → Ver logs

**Frontend não conecta:**
- Vercel → Settings → Environment Variables
- Verificar REACT_APP_BACKEND_URL

**Domínio não funciona:**
- Aguardar propagação DNS
- Testar: https://dnschecker.org

---

## 📞 Links Úteis

- Railway: https://railway.app
- Vercel: https://vercel.com
- Registro.br: https://registro.br

**Qualquer dúvida, me chame! 🚀**
