---
title: 'Track Build: Big-Brake Conversion and Engine Top-End Refresh'
summary: Cured brake fade and an 18% leak-down on a 2.0 L track car, keeping the stock master cylinder and ABS.
year: 2023
order: 3
domain: Automotive Systems
categories: [hardware]
section: engineering
featured: true
tools: [SOLIDWORKS, FEA, Brake Bias Model, Leak-Down Testing, Data Logging]
role: Owner, designer, mechanic
duration: 4 months of weekends
status: Running, 11 track days since
objective: >-
  The car lost its brake pedal after four hot laps and cylinder 3 leaked 18% at TDC. The goal was
  a full 20-minute session with a consistent pedal and even compression, without disturbing the
  factory master cylinder, ABS calibration, or front-to-rear balance.
outcome: >-
  Peak rotor temperature dropped 145 °C and stays below pad fade for the whole session. All four
  cylinders now leak down within one point of each other.
metrics:
  - { value: '640 → 495 °C', label: 'Peak front rotor temperature' }
  - { value: '18% → 3%', label: 'Cylinder 3 leak-down' }
  - { value: '38.9 → 35.2 m', label: '100–0 km/h, third stop' }
  - { value: '64.1%', label: 'Front bias, stock is 64.8%' }
cover: ./track-brake-engine-build/cover.svg
coverAlt: Drawing of a slotted brake rotor with a four-piston caliper and a highlighted adapter bracket
gallery:
  - src: ./track-brake-engine-build/fig-02.svg
    alt: Section through a cylinder showing piston, ring pack and measured ring gaps
    caption: Cylinder 3 section and ring gaps
  - src: ./track-brake-engine-build/fig-03.svg
    alt: Line chart of rotor temperature over a 20 minute session, before and after
    caption: Rotor temperature, 20 min session
  - src: ./track-brake-engine-build/fig-04.svg
    alt: Bar chart of stopping distance over repeated stops, before and after
    caption: Repeated-stop distance
---

**Brakes.** A bias model built from piston areas, effective rotor radius, tyre radius, and CG
height picked the hardware before anything was bought. A four-piston caliper on a 330 mm
two-piece rotor kept front bias within one point of stock, so the ABS never saw a different car.

- The caliper adapter bracket was designed in SOLIDWORKS around a scan of the upright, checked in
  FEA at 1.6 g with a safety factor of 3.1, and machined from 7075-T6.
- Ducting from the bumper to the rotor eye was sized from the heat the old rotors were failing to
  shed. IR sensors logged at 10 Hz verified the result.

**Engine.** The leak-down traced to a worn top ring and a slightly warped deck on cylinder 3.

- Head off, deck skimmed 0.08 mm, valves lapped and vacuum checked.
- New rings file-fitted to measured gaps for each bore, then a torque-angle sequence on new
  head studs.
- A written break-in schedule, followed by leak-down and compression tests at 0, 500, and
  2,000 km.
