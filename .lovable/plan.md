## Diagnostic

**1. Produits qui disparaissent d'une machine à l'autre**
Le back-end existe déjà (table `products` dans Lovable Cloud, fonctions serveur `listPublicProducts`, `listAdminProducts`, `upsertProduct`, `deleteProduct`, upload d'images vers le bucket `product-images`). MAIS les 3 écrans concernés lisent/écrivent dans `localStorage` via `loadManagedProducts` / `saveManagedProducts` :
- `src/routes/admin.tsx` — ajout / édition / suppression
- `src/components/Products.tsx` — carrousel de la page d'accueil
- `src/routes/commander.tsx` — page de commande

D'où le comportement observé : chaque navigateur voit ses propres produits, rien n'est partagé, rien ne survit à un changement d'appareil.

**2. Vidéos "disparues"**
Les fichiers `var-monitor-loop.mp4` et `var-showroom-loop.mp4` sont bien en ligne (HTTP 200 vérifié) et référencés dans `Hero.tsx` + `ScrollVideo.tsx`. Le problème visuel vient probablement de l'affichage mobile (viewport 766px) où la colonne moniteur du Hero est masquée par `lg:` et la section `ScrollVideo` est sombre. Je vais forcer la visibilité mobile et ajouter une 2e vidéo (showroom) visible dès le haut du site.

## Plan d'action

### A. Migration Admin → Lovable Cloud (fin du localStorage)
1. Réécrire `src/routes/admin.tsx` pour appeler `listAdminProducts`, `upsertProduct`, `deleteProduct` via `useServerFn` + TanStack Query. Formulaire adapté aux champs de la table (`name_fr`, `price_dzd`, `stock`, `category_id`, `images[]`, `featured`, `active`).
2. Upload d'images via la route existante `POST /api/admin/upload` (bucket `product-images`), aperçu + suppression.
3. Suppression du bouton "Reset catalogue local" (n'a plus de sens).

### B. Frontend public branché sur la DB
4. `src/components/Products.tsx` : remplacer `loadManagedProducts` par `useQuery(listPublicProducts)`. Mapping des champs DB → shape existante (`priceValue`, `image`, `code`, etc.) pour ne pas casser le rendu et le panier.
5. `src/routes/commander.tsx` : idem, lecture via `listPublicProducts`.
6. Garder `ProductModal` et le panier tels quels (ils reçoivent déjà un objet produit).

### C. Vidéos remises en avant
7. `Hero.tsx` : rendre la vidéo moniteur visible aussi en mobile (retirer le `lg:` bloquant) + poster + `preload="metadata"`.
8. Ajouter un bandeau vidéo court juste après le Hero (avant `Categories`) qui rejoue `var-showroom-loop.mp4` en pleine largeur, pour que la vidéo soit visible sans scroller loin.
9. Vérifier `ScrollVideo` : conserver, ajuster l'opacité de l'overlay pour que la vidéo se voie mieux.

### D. Vérification
10. Ouvrir l'admin, créer un produit test avec image, recharger, vérifier qu'il apparaît sur la home et sur `/commander`.
11. Vérifier les 2 vidéos à l'écran en mobile + desktop via Playwright + captures.

## Détails techniques

- Les fonctions serveur `upsertProduct` / `deleteProduct` exigent `requireAdmin` (mot de passe admin déjà en place via cookie/JWT admin) — la page `/admin` fait déjà ce login, aucun changement d'auth nécessaire.
- Images : le back-end signe déjà les URLs (`withSignedImages`), donc côté client on affiche directement `product.images[0]`.
- Aucune migration SQL nécessaire, la table `products` existe.
- Les helpers `loadManagedProducts` / `saveManagedProducts` / `resetManagedProducts` seront supprimés de `local-store.ts`. `loadLocalOrders` reste (commandes locales, hors sujet ici).

## Fichiers modifiés
- `src/routes/admin.tsx` (réécriture partielle CRUD)
- `src/components/Products.tsx` (lecture DB)
- `src/routes/commander.tsx` (lecture DB)
- `src/components/Hero.tsx` (vidéo visible mobile)
- `src/routes/index.tsx` (nouveau bandeau vidéo)
- `src/components/ScrollVideo.tsx` (overlay allégé)
- `src/lib/local-store.ts` (nettoyage)
