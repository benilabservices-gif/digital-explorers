# Guide Supabase — Digital Explorers

## ÉTAPE 1 : Créer le projet Supabase

1. Va sur **https://supabase.com** → Connecte-toi → **New Project**
2. Remplis :
   - **Organization** : benilabservices-2205s-projects (ou crée une org)
   - **Name** : `digital-explorers`
   - **Database Password** : Choisis un mot de passe fort (ex: `DEx2024!Secure`) → **copie-le**
   - **Region** : France (Paris)
   - **Pricing Plan** : Free
3. Clique **Create new project**
4. Attends ~2 minutes que le projet soit prêt

---

## ÉTAPE 2 : Récupérer les identifiants

Dans le dashboard Supabase → **Settings** (roue crantée en bas à gauche) → **API** :

- **Project URL** : `https://xxxxx.supabase.co` → **copie cette valeur**
- **anon public key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` → **copie cette valeur**

---

## ÉTAPE 3 : Créer les tables

1. Dans le menu à gauche → **SQL Editor** → **New query**
2. Ouvre le fichier : `database/schema.sql` (dans ton projet)
3. Copie **tout** le contenu
4. Colle dans l'éditeur SQL
5. Clique **Run**
6. ✅ Tu devrais voir "Success. No rows returned"

---

## ÉTAPE 4 : Activer l'authentification

1. Menu → **Authentication** → **Providers**
2. Active **Email** (déjà activé par défaut)
3. Active **Google** → note les étapes plus bas

### Configurer Google OAuth

#### Dans Supabase
1. **Authentication** → **Providers** → **Google** → **Enable**
2. **URL Configuration** :
   - Site URL : `https://digital-explorers-seven.vercel.app`
   - Redirect URLs : `https://digital-explorers-seven.vercel.app/auth/callback`
   - Reserve URLs : `https://digital-explorers-seven.vercel.app/*`

#### Dans Google Cloud Console
1. Va sur **https://console.cloud.google.com/apis/credentials**
2. **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `Digital Explorers`
5. Authorized JavaScript origins :
   ```
   https://digital-explorers-seven.vercel.app
   ```
6. Authorized redirect URIs :
   ```
   https://digital-explorers-seven.vercel.app/auth/callback
   ```
7. Clique **Create**
8. Copie le **Client ID** et **Client Secret**

---

## ÉTAPE 5 : Mettre à jour Vercel

Va sur **https://vercel.com/benilabservices-2205s-projects/digital-explorers/settings/environment-variables**

Supprime les anciennes valeurs et ajoute :

| Variable | Valeur | Source |
|----------|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase Settings → API |
| `GOOGLE_CLIENT_ID` | `123456-abc.apps.googleusercontent.com` | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-xxxxx` | Google Cloud Console |
| `AI_API_KEY` | `sk-or-v1-...` | OpenRouter (déjà configuré) |

Clique **Save** → Va dans **Deployments** → clique les 3 points → **Redeploy**

---

## ÉTAPE 6 : Tester

1. Va sur **https://digital-explorers-seven.vercel.app/auth/signup**
2. Crée un compte avec email + mot de passe
3. Ajoute un enfant (nom, âge, classe)
4. Va sur **https://digital-explorers-seven.vercel.app/dashboard**
5. Vérifie que l'enfant apparaît
6. Clique sur un monde → entre dans une aventure
7. Complète l'aventure → vérifie que les XP sont mis à jour
8. Retourne sur le dashboard → vérifie que les XP ont changé

---

## ÉTAPE 7 : Vérifier dans Supabase

1. Dans Supabase → **Table Editor**
2. Tu devrais voir les tables : `parents`, `children`, `child_adventures`, `child_badges`, etc.
3. Clique sur `children` → tu devrais voir ton enfant créé
4. Clique sur `child_adventures` → tu devrais voir les aventures complétées
