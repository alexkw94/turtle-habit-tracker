# turtle — Habit Tracker

Implementierung eines Claude-Design-Handoffs (`Habit Tracker.dc.html`, liegt
ausserhalb dieses Repos) in React + Vite + TypeScript.

**Live:** https://alexkw94.github.io/turtle-habit-tracker/

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview -- --host   # gebauten Stand im WLAN testen
```

## Deployment

Push auf `main` → GitHub Actions baut und veröffentlicht auf GitHub Pages
(`.github/workflows/deploy.yml`). Weil Pages unter einem Unterpfad ausliefert,
steht in `vite.config.ts` `base: '/turtle-habit-tracker/'` — bei einer eigenen
Domain muss das auf `'/'` zurück.

## Auf dem Handy installieren

Die Seite in **Safari** öffnen → Teilen → *Zum Home-Bildschirm*. Danach startet
sie ohne Browser-Leiste, mit eigenem Icon, und funktioniert dank Service Worker
auch offline. Der Geräterahmen der Design-Vorschau entfällt auf schmalen
Bildschirmen automatisch (siehe die Media Query am Ende von `app.css`).

Die Daten liegen im `localStorage` des jeweiligen Geräts — Handy und Laptop
führen getrennte Stände, und ein Löschen der Safari-Daten löscht sie mit.

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `src/styles/organic.css` | Das Design-System, unverändert aus dem Bundle übernommen — Tokens, Buttons, Dialog. Nicht editieren, sondern beim nächsten Handoff neu kopieren. |
| `src/styles/app.css` | Die App-Schicht. Jeder Wert stammt aus dem Prototyp, jede Farbe/Radius/Schatten aus einem Token. |
| `src/components/IOSFrame.tsx` | Gerätrahmen aus `ios-frame.jsx` — nur die genutzten Teile (kein NavBar, keine Tastatur). Apple-Chrome behält seine festen Werte. |
| `src/components/Tappable.tsx` | Das Tap-Target des Prototyps, zusätzlich per Enter/Space bedienbar. |
| `src/screens/` | Tag, Woche, Ziele. |
| `src/state/useHabitStore.ts` | Zustand + `localStorage`-Persistenz. |
| `src/lib/` | Bereiche und Markierungs-Zustände, Datums-/ISO-Wochen-Logik. |

## Abweichungen vom Prototyp

Der Prototyp arbeitet mit einer fixen Beispielwoche (10.–16. August, „heute" =
Samstag) und verliert seinen Zustand beim Neuladen. Diese Implementierung:

- **rechnet mit echten Daten.** Die Woche ist die laufende ISO-Woche (Mo–So),
  „heute" kommt aus der Systemzeit, künftige Tage bleiben gesperrt.
- **persistiert nach `localStorage`** unter `turtle.habits.v1`. Markierungen und
  Notizen hängen an Datums-Keys (`2026-08-17`), Wochennotizen an `2026-W34`.
- **sät die Beispieldaten einmalig** in die bereits vergangenen Tage der
  aktuellen Woche. Wer die App an einem Montag zum ersten Mal öffnet, startet
  entsprechend leer — es gibt noch keinen vergangenen Tag.

Der Auswertungstext der Wochenansicht ist wörtlich aus dem Design übernommen und
damit auf dessen Samstag gemünzt („Zwei Tage bleiben noch."). Er passt sich dem
echten Wochentag **nicht** an; das wäre neuer Text und damit eine
Design-Entscheidung.

Der Schalter „Sanfte Abenderinnerung" ist wie im Design reine Oberfläche: er
merkt sich seinen Zustand, verschickt aber nichts. Eine echte Erinnerung um
21:00 bräuchte Web Push samt Notification-Berechtigung — auf iOS erst ab 16.4
und nur für die installierte Variante.
