# FlowForge UI/UX Koncepció — Visily.ai Promptok

4 prompt, mindegyik max 4000 karakter. Sorrendben generáld!

Design tokenek a Unity Visual Scripting referencia képekből (csspicker.dev):
- Canvas: #1a1a1a, vonalrács #222 40px
- Node body: #262626, border #333, border-radius 4px, shadow 0 4px 15px rgba(0,0,0,0.5)
- Header: színezett bg + ikon + kétsoros (típus 11px felül, név 13px alul)
- Selected: #3b82f6 border + glow
- Port kör: 8px, execution: chevron nyíl
- Sidebar: #252525, toolbar: #333

---

## Prompt 1 — Teljes Editor Layout (Edit mód)

```
Design a dark-themed visual node-based PLC programming editor called "FlowForge". Style matches Unity Visual Scripting exactly.

LAYOUT (full-screen, no scroll):
- TOP: Slim toolbar (48px), #333333
- LEFT: Node Toolbox panel (260px wide, #252525)
- CENTER: Flow Canvas (#1a1a1a with thin line grid #222, 40px spacing)
- RIGHT: Node Inspector panel (280px wide, #252525)
- BOTTOM: Collapsed Watch bar (32px, #333)

TOOLBAR (left-center-right):
- Left: "FF" teal logo + "Motor Control v2.1" breadcrumb
- Center: Segmented toggle "Edit" (active, filled #3b82f6) / "Online" (inactive, gray)
- Right: Build (hammer icon), Deploy (rocket icon), "Saved 2 min ago" muted, user avatar circle

LEFT PANEL — NODE TOOLBOX:
- "Nodes" title, search input below (#171717, border #404040, "Search nodes...")
- Filter chips: "All" (active #3b82f6), "Favorites", "I/O", "Logic", "Timers", "Math"
- Expandable category sections with colored dots:
  I/O (teal #4A9E9E): Digital Input, Digital Output, Analog Input, Analog Output
  Timers (blue #5BA0D5): TON, TOF, TP
  Logic (collapsed), Math (collapsed), Counters (collapsed)
- Each item: colored icon | name (bold) | description (muted #999) | star for favorite
- Footer: "Drag to canvas or double-click to add"

CENTER — CANVAS:
6 connected nodes on line grid. Nodes are dark rounded rectangles (#262626, 4px radius, 1px #333 border, shadow 0 4px 15px rgba(0,0,0,0.5)). Each node has a colored category header strip with icon + TWO lines (small type name 11px + node name 13px bold below). Ports are 8px colored circles at node edges with 11px labels. Execution ports use chevron arrows, not circles.

Nodes left-to-right:
1. "Start Button" (teal I/O header) — OUT port (green #84cc16)
2. "Delay T#2S" (blue Timer header) — IN, PT inputs / Q, ET outputs
3. "Part Counter" (steel blue Counter header, SELECTED: #3b82f6 border + blue glow) — CU, RESET, PV / Q, CV
4. ">=" (purple Compare header) — A, B inputs / OUT output
5. "Motor ON" (teal Output header) — IN port
6. "Batch Done" (teal Output header) — IN port

Wires: smooth bezier, 2px. green=#84cc16 (BOOL), blue=#60a5fa (INT), teal=#2dd4bf (TIME).
MiniMap bottom-right, zoom controls bottom-left.

RIGHT PANEL — NODE INSPECTOR:
- "Properties" title + "CTU" pill badge
- General: Label "Part Counter", Type "CTU (Up Counter)", ID "counter_1"
- Input Ports: CU "← Start Button.OUT" (teal chip), RESET "Not connected", PV "10"
- Output Ports: Q "Not connected", CV "→ Comparison.A" (teal chip)
- Notes textarea
- Footer: "1 node selected"

BOTTOM: "▸ Watch" left, "0 variables" right

STYLE: Inter font, #e0e0e0 primary text, #999 secondary, #3b82f6 accent. Clean, professional.
```

---

## Prompt 2 — Canvas Node-ok részletesen (zoom)

```
Design a zoomed-in canvas showing 6 interconnected nodes for a PLC visual editor "FlowForge". Matches Unity Visual Scripting exactly. Show ONLY the canvas area, no panels or toolbar.

BACKGROUND: #1a1a1a with thin line grid (#222 lines, 40px spacing)

NODE DESIGN (critical):
- Body: #262626, border-radius 4px, 1px solid #333, shadow 0 4px 15px rgba(0,0,0,0.5)
- Header: colored background strip with icon on left + TWO text lines:
  Line 1: component type (11px, semibold, slightly transparent)
  Line 2: node name (13px, medium weight)
- Header bottom border: 1px solid rgba(0,0,0,0.2)
- Port rows: 24px each, 8px colored circle at edge + label (11px, #a3a3a3)
- Execution ports: white chevron arrow (not circle)
- Width: 160-200px

CATEGORY HEADER COLORS:
- I/O: teal #4A9E9E, gamepad icon
- Timer: sky blue #5BA0D5, clock icon
- Counter: steel blue #6A8EBF, tally icon
- Compare: purple #8B6BBF, compare icon

PORT COLORS (circle + wire):
- BOOL: green #84cc16
- INT: blue #60a5fa
- TIME: teal #2dd4bf

NODE 1 — "Start Button":
Header teal bg: "INPUT" (11px) / "Start Button" (13px bold)
Right side: OUT green circle

NODE 2 — "Delay T#2S":
Header blue bg: "TIMER" / "Delay T#2S"
Left: IN (green), PT (teal) | Right: Q (green), ET (teal)

NODE 3 — "Part Counter" SELECTED (bright #3b82f6 border + box-shadow 0 0 0 1px #3b82f6):
Header steel blue bg: "COUNTER" / "Part Counter"
Left: CU (green), RESET (green), PV (blue) | Right: Q (green), CV (blue)

NODE 4 — ">=":
Header purple bg: "COMPARE" / ">="
Left: A (blue), B (blue) | Right: OUT (green)

NODE 5 — "Motor ON":
Header teal bg: "OUTPUT" / "Motor ON"
Left: IN (green)

NODE 6 — "Batch Done":
Header teal bg: "OUTPUT" / "Batch Done"
Left: IN (green)

WIRES (smooth bezier curves, 2px):
- Start Button OUT -> Delay IN: GREEN #84cc16
- Start Button OUT -> Part Counter CU: GREEN (branches from same port)
- Delay Q -> Motor ON IN: GREEN
- Part Counter CV -> >= A: BLUE #60a5fa
- >= OUT -> Batch Done IN: GREEN

Dark MiniMap (bottom-right), zoom buttons (bottom-left).
```

---

## Prompt 3 — Oldalsó panelek részletesen

```
Design two side panels for a dark PLC node editor "FlowForge" matching Unity Visual Scripting style. Show both panels side by side on #1a1a1a background.

=== LEFT — NODE TOOLBOX (260px wide) ===

Background #252525, right border 1px #444.

Header: "Nodes" (14px semibold, #e0e0e0)

Search: full-width input (#171717, border 1px #404040, focus border #3b82f6, placeholder "Search nodes..." with magnifying glass icon, 12px)

Filter chips (horizontal): "All" (active — #3b82f6 fill, white text), "Favorites", "I/O", "Logic", "Timers", "Counters", "Math", "Compare" — inactive: #333 bg, #999 text, 10px

Category sections with collapsible headers:

"I/O" (expanded):
Header row: teal dot #4A9E9E + "I/O" bold + "4 nodes" #999 + chevron down
Item rows (each ~36px, #333 bg, 3px radius, 2px gap):
- teal square icon | "Digital Input" (bold #e0e0e0) | "Read PLC input" (#999) | star outline
- "Digital Output" — Write PLC output
- "Analog Input" — Read analog value (star FILLED = favorited)
- "Analog Output" — Write analog value

"Timers" (expanded):
Blue dot #5BA0D5 + "Timers" + "3 nodes"
- "TON" — On-delay timer
- "TOF" — Off-delay timer
- "TP" — Pulse timer

"Logic" (collapsed): green dot #6B9E5B + "Logic" + "4 nodes" + chevron right
"Math" (collapsed): orange dot #C89B5B + "Math" + "4 nodes"
"Counters" (collapsed): steel blue dot #6A8EBF + "Counters" + "3 nodes"

Footer: "Drag to canvas or double-click to add" (#666, 11px)

=== RIGHT — NODE INSPECTOR (280px wide) ===

Background #252525, left border 1px #444.

Header: "Properties" (14px semibold) + small pill "CTU" (#333 bg, #999 text)

Collapsible sections (11px uppercase headers, #999):

"General":
- Label: text input (#171717, border #404040) -> "Part Counter"
- Type: read-only pill "CTU (Up Counter)" colored #6A8EBF
- ID: muted #666 -> "counter_1"

"Input Ports":
- CU (BOOL): "← Start Button.OUT" as teal #4A9E9E link chip with arrow
- RESET (BOOL): "Not connected" italic #666
- PV (INT): number input (#171717) -> "10"

"Output Ports":
- Q (BOOL): "Not connected" italic #666
- CV (INT): "→ Comparison.A" teal chip

"Notes":
- Textarea (#171717, border #404040), placeholder "Add notes..."

Footer: "1 node selected" (#666, 12px)

FONTS: Inter 12-13px, JetBrains Mono 11px for values/monospace.
Text: #e0e0e0 primary, #a3a3a3 labels, #999 secondary, #666 muted.
```

---

## Prompt 4 — Online Monitor nézet (élő PLC adatokkal)

```
Design the ONLINE MONITORING view of a dark PLC node editor "FlowForge". Same Unity Visual Scripting style but showing LIVE PLC data. The canvas should look ALIVE — like a control room dashboard overlaid on a node graph.

TOOLBAR CHANGES from edit mode:
- Segmented toggle: "Online" active (filled #22C55E green, white text), "Edit" inactive gray
- New: green dot + "PLC-Demo (5.39.123.1.1.1)" label + "Connected" green text
- Right side: red "Go Offline" button

LEFT PANEL: Collapsed to thin 16px vertical strip with toggle arrow

CANVAS (#1a1a1a, line grid #222, 40px):
Same 6 nodes (#262626, 4px radius, #333 border), now with live data overlays:

Each port shows CURRENT VALUE in a small rounded pill next to the label:
- BOOL TRUE: "TRUE" in green #84cc16 on rgba(132,204,22,0.12) bg
- BOOL FALSE: "FALSE" in gray #666 on rgba(100,100,100,0.1) bg
- INT: "7" in blue #60a5fa on rgba(96,165,250,0.12) bg
- TIME: "T#1400MS" in teal #2dd4bf on rgba(45,212,191,0.12) bg

Node execution glow effects:
- ACTIVE: green border #22C55E + glow shadow (0 0 15px rgba(34,197,94,0.35))
- ERROR: red border #EF4444 + red glow
- IDLE: normal, no glow

Node states:
- "Start Button" ACTIVE (green glow), OUT: TRUE
- "Delay T#2S" ACTIVE, IN: TRUE, PT: T#2S, Q: TRUE, ET: T#1400MS
- "Part Counter" ACTIVE+SELECTED (#3b82f6 border, green glow behind), CU: TRUE, RESET: FALSE, PV: 10, Q: FALSE, CV: 7
- "Motor ON" ACTIVE, IN: TRUE
- ">=" ACTIVE, A: 7, B: 10, OUT: FALSE
- "Batch Done" IDLE (no glow), IN: FALSE

WIRE BADGES: Active wires 3px thick, brighter. At each wire midpoint, a floating dark pill (#1a1a1a, 1px #444 border) with type-colored value text:
- Start Button -> Delay: "TRUE" (green)
- Counter CV -> >= A: "7" (blue)
- >= OUT -> Batch Done: "FALSE" (gray)

RIGHT PANEL — INSPECTOR with extra "Live Values" section at top:
Green dot + "Live Values" header:
CU: TRUE (green pill), RESET: FALSE (gray), PV: 10 (blue), Q: FALSE (gray), CV: 7 (blue)

BOTTOM — WATCH TABLE (expanded ~200px):
Header: "Watch" + "2 variables" badge + search input + "Add" button
Table: Variable | Value | Type | Timestamp | x
Row 1: MAIN.counter_1.CV | "7" (blue mono) | INT | 14:23:05.123 | x
Row 2: MAIN.timer_1.ET | "T#1400MS" (teal mono) | TIME | 14:23:05.089 | x
Alternating row bg: #252525 / #2a2a2a. Headers: uppercase 10px #999.
```

---

## Használati sorrend

1. **Prompt 1** — Teljes layout áttekintés
2. **Prompt 2** — Canvas zoom, node-ok és vezetékek részletesen
3. **Prompt 3** — Toolbox + Inspector panelek
4. **Prompt 4** — Online monitor nézet élő adatokkal

## Frissített design tokenek (referencia képekből)

| Token | Érték |
|-------|-------|
| Canvas háttér | #1a1a1a |
| Grid | vonalrács, #222, 40px |
| Node body | #262626 |
| Node border | 1px solid #333 |
| Node radius | 4px |
| Node shadow | 0 4px 15px rgba(0,0,0,0.5) |
| Sidebar/panel bg | #252525 |
| Toolbar bg | #333333 |
| Panel border | 1px solid #444 |
| Input fields | #171717, border #404040 |
| Selected node | #3b82f6 border + glow |
| Primary text | #e0e0e0 |
| Secondary text | #999 |
| Port labels | #a3a3a3 |
| Muted/disabled | #666 |
| BOOL port | #84cc16 (green) |
| INT port | #60a5fa (blue) |
| TIME port | #2dd4bf (teal) |
| REAL port | #f97316 (orange) |
| STRING port | #CC5BAA (magenta) |
| Execution port | white chevron arrow |
