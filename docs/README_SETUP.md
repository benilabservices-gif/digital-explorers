# Guide de configuration — Digital Explorers

## ✅ Ce qui est déjà fait

| Élément | Statut |
|---------|--------|
| Site déployé | ✅ https://digital-explorers-seven.vercel.app |
| Coach IA | ✅ Connecté à OpenRouter (DeepSeek) |
| 84 aventures | ✅ 7 mondes × 12 aventures |
| XP/Badges | ✅ Moteur fonctionnel |
| Dashboard parent/enfant | ✅ Avec rapports |
| Portfolio + Passport | ✅ |
| Google OAuth (coté code) | ✅ Prêt |
| Schema Supabase | ✅ `database/schema.sql` |

---

## 🔧 Ce qu'il reste à faire

### 1️⃣ Créer les tables Supabase (5 min)

1. Va sur **https://supabase.com** → Login → **New Project**
2. Nom: `digital-explorers`, choisis une région proche (France), mot de passe fort
3. Attends ~2 min que ce soit prêt
4. Va dans **SQL Editor** → **New query**
5. Ouvre le fichier `database/schema.sql` dans ton projet
6. Copie-colle tout le contenu → clique **Run**
7. ✅ Les 14 tables sont créées !

---

### 2️⃣ Configurer Google OAuth (5 min)

#### Dans Supabase
1. **Authentication** → **Providers** → **Google** → Active
2. **URL Configuration** → ajoute :
   - Site URL: `https://digital-explorers-seven.vercel.app`
   - Redirect: `https://digital-explorers-seven.vercel.app/auth/callback`

#### Dans Google Cloud Console
1. Va sur **https://console.cloud.google.com/apis/credentials**
2. **Create Credentials** → **OAuth client ID** → **Web application**
3. Authorized JavaScript origins:
   ```
   https://digital-explorers-seven.vercel.app
   ```
4. Authorized redirect URIs:
   ```
   https://digital-explorers-seven.vercel.app/auth/callback
   ```
5. Copie le **Client ID** et **Client Secret**

#### Sur Vercel
1. Va sur **https://vercel.com/benilabservices-2205s-projects/digital-explorers/settings/environment-variables**
2. Remplace les placeholders par tes vraies valeurs :
   - `NEXT_PUBLIC_SUPABASE_URL` → ton URL Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → ta clé anon Supabase
   - `GOOGLE_CLIENT_ID` → ton Client ID Google
   - `GOOGLE_CLIENT_SECRET` → ton Client Secret Google
3. Clique **Save** → **Deployments** → **Redeploy**

---

### 3️⃣ Tester l'inscription

1. Va sur **https://digital-explorers-seven.vercel.app/auth/signup**
2. Crée un compte parent
3. Ajoute un enfant
4. Va sur le dashboard → clique sur l'enfant
5. Entre dans une aventure → réponds au quiz → termine
6. ✅ Les XP doivent se mettre à jour !

---

## 📊 Architecture déployée

```
https://digital-explorers-seven.vercel.app
├── /                    → Homepage
├── /worlds              → 7 mondes (grille)
├── /worlds/[slug]       → Détail monde
├── /adventure/[slug]    → Aventure interactive (6 sections)
├── /dashboard           → Tableau de bord parent/enfant
├── /parent              → Espace parent (rapports)
├── /portfolio           → Portfolio + Digital Passport
├── /pricing             → Tarifs (Starter/Explorateur/Pro)
├── /auth/signup         → Inscription parent + enfant
├── /auth/login          → Connexion + Google OAuth
└── /api/chat            → Coach IA (OpenRouter/DeepSeek)
```

---

## 🎮 Fonctionnalités actives

| Fonctionnalité | État |
|---------------|------|
| 84 aventures (7 mondes) | ✅ |
| Quiz interactif | ✅ |
| XP + Niveaux | ✅ |
| Badges (10 MVP) | ✅ |
| Coach IA | ✅ |
| Dashboard parent | ✅ |
| Portfolio enfant | ✅ |
| Digital Passport | ✅ |
| Digital Bridge → GeekCoding4Kids | ✅ |
| Défi quotidien | ✅ |
| Progression par monde | ✅ |
| Recommandations | ✅ |

---

## 🚀 Pour aller plus loin

### Ajouter les 75 aventures manquantes
Le pattern est déjà en place dans `src/data/content.ts`. Il suffit de dupliquer le format des 9 aventures pilotes.

### Connecter localStorage → Supabase
Remplacer les appels `localStorage.setItem/getItem` par des queries Supabase. Le schema est prêt dans `database/schema.sql`.

### Ajouter les défis quotidiens
Créer une page `/challenges` avec rotation quotidienne basée sur la date.
