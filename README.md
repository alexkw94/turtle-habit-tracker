# turtle — Habit Tracker

Implementierung von `../project/Habit Tracker.dc.html` (Claude-Design-Handoff) in
React + Vite + TypeScript.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
```

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
