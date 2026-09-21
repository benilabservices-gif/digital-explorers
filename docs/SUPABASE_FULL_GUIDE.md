# Guide Complet — Configuration Supabase + Vercel

Ce guide va t'aider à connecter Digital Explorers à une vraie base de données Supabase.

---

## ÉTAPE 1 : Créer le projet Supabase (5 min)

### 1.1 — Créer un compte et un projet

1. Va sur **https://supabase.com**
2. Clique **"Start your project"** → Connecte-toi avec GitHub ou email
3. Clique **"New Project"**
4. Remplis :
   - **Organization** : choisis la tienne (ou crée "Personal")
   - **Name** : `digital-explorers`
   - **Database Password** : choisis un mot de passe fort (ex: `DEx2024!Secure`) → **COPIE-LE**
   - **Region** : `France (Paris)` ou `West Europe`
   - **Pricing Plan** : **Free**
5. Clique **"Create new project"**
6. Attends ~2 minutes que le projet soit prêt

### 1.2 — Récupérer les credentials

Une fois le projet créé :

1. Clique sur le nom du projet dans le dashboard
2. Dans le menu à gauche → **Settings** (roue crantée en bas) → **API**
3. Copie ces 2 valeurs :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 1.3 — Créer les tables

1. Dans le menu à gauche → **SQL Editor** → **New query**
2. Ouvre le fichier `database/schema.sql` dans ton projet Digital Explorers
3. Copie **toute** le contenu (642 lignes)
4. Colle dans l'éditeur SQL
5. Clique **"Run"**
6. ✅ Tu dois voir "Success. No rows returned"

### 1.4 — Activer l'authentification

1. Menu → **Authentication** → **Providers**
2. Active **Email** (déjà activé)
3. Active **Google** :
   - Clique sur **Google** → **Enable**
   - Dans **URL Configuration** :
     - Site URL : `https://digital-explorers-seven.vercel.app`
     - Redirect URLs : `https://digital-explorers-seven.vercel.app/auth/callback`
   - Reserve URLs : `https://digital-explorers-seven.vercel.app/*`

### 1.5 — Configurer Google OAuth (Google Cloud Console)

1. Va sur **https://console.cloud.google.com/**
2. Crée un nouveau projet (nom: `digital-explorers`)
3. Va dans **APIs & Services** → **Credentials**
4. Clique **+ CREATE CREDENTIALS** → **OAuth client ID**
5. Application type: **Web application**
6. Nom: `Digital Explorers Web`
7. Authorized JavaScript origins :
   ```
   https://digital-explorers-seven.vercel.app
   ```
8. Authorized redirect URIs :
   ```
   https://digital-explorers-seven.vercel.app/auth/callback
   ```
9. Clique **Create**
10. Copie le **Client ID** et **Client Secret**

---

## ÉTAPE 2 : Configurer Vercel (5 min)

### 2.1 — Aller sur les variables d'environnement

1. Va sur **https://vercel.com/benilabservices-2205s-projects/digital-explorers/settings/environment-variables**

### 2.2 — Ajouter/modifier les variables

Supprime les anciennes valeurs et ajoute :

| Variable | Valeur | Source |
|----------|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase Settings → API |
| `SUPABASE_DB_URL` | (optionnel) | Supabase Settings → Database |
| `GOOGLE_CLIENT_ID` | `123456-abc.apps.googleusercontent.com` | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-xxxxx` | Google Cloud Console |
| `AI_API_KEY` | `sk-or-v1-xxxxx` | OpenRouter (déjà configuré) |
| `AI_ENDPOINT` | `https://openrouter.ai/api/v1/chat/completions` | (déjà configuré) |
| `AI_MODEL` | `deepseek/deepseek-chat` | (déjà configuré) |

### 2.3 — Sauvegarder et redéployer

1. Clique **"Save"**
2. Va dans **Deployments**
3. Clique les **3 points** sur le dernier deployment → **Redeploy**

---

## ÉTAPE 3 : Tester (2 min)

### 3.1 — Tester l'inscription

1. Va sur **https://digital-explorers-seven.vercel.app/auth/signup**
2. Crée un compte parent avec email + mot de passe
3. Ajoute un enfant (nom, âge, classe)
4. Tu seras redirigé vers le dashboard

### 3.2 — Vérifier dans Supabase

1. Retourne sur **https://supabase.com/dashboard**
2. Dans ton projet → **Table Editor**
3. Tu devrais voir :
   - Table `parents` → ton compte parent
   - Table `children` → ton enfant
   - Table `xp_events` → vide (pas encore d'XP)

### 3.3 — Tester le Coach IA

1. Sur n'importe quelle page, clique le bouton violet 💬 en bas à droite
2. Pose une question au Coach IA
3. ✅ La réponse arrive en quelques secondes

---

## ÉTAPE 4 : Migration des données (optionnel)

Si tu as déjà des données dans localStorage, tu peux les migrer :

### 4.1 — Scripts de migration

Ouvre la console du navigateur (F12) sur https://digital-explorers-seven.vercel.app/dashboard

```javascript
// Migrer les enfants depuis localStorage vers Supabase
const supabase = window.supabase.createClient(
  'https://xxxxx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
);

const children = JSON.parse(localStorage.getItem('de_children') || '[]');
if (children.length > 0) {
  const { data, error } = await supabase
    .from('children')
    .insert(children.map(c => ({
      parent_id: 'parent_123', // à remplacer par l'ID réel
      ...c
    })));
  console.log(error || 'Migration réussie!');
}
```

---

## Dépannage

### Problème : "Invalid API key"
→ Vérifie que `NEXT_PUBLIC_SUPABASE_ANON_KEY` est bien configuré dans Vercel

### Problème : "Tables not found"
→ Relance le SQL Editor avec le contenu de `database/schema.sql`

### Problème : Google OAuth ne fonctionne pas
→ Vérifie que les URLs sont correctes dans Supabase ET Google Cloud Console

### Problème : Les données ne persistent pas
→ C'est normal ! Le localStorage est local au navigateur. Avec Supabase, les données seront sur le serveur.

---

## Fichiers importants

| Fichier | Usage |
|---------|-------|
| `database/schema.sql` | Création des tables Supabase |
| `docs/SUPABASE_SETUP.md` | Guide détaillé |
| `src/lib/supabase/client.ts` | Client Supabase |
| `src/lib/supabase/auth.ts` | Fonctions d'auth |

---

## Prochaines étapes après configuration

1. ✅ Migrer le code pour utiliser Supabase au lieu de localStorage
2. ✅ Ajouter les triggers Supabase pour les XP automatiques
3. ✅ Connecter le formulaire d'inscription à Supabase Auth
4. ✅ Tester avec plusieurs enfants
5. ✅ Configurer les rôles RLS pour la sécurité
