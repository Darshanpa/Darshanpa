---
title: Two-Stage Planetary Gearbox for a Robotic Joint
summary: A 36:1 reduction packaged inside a 68 mm envelope, holding backlash under 10 arcmin with catalogue gears.
year: 2025
order: 1
domain: Mechanism Design
categories: [hardware]
section: engineering
featured: true
tools: [SOLIDWORKS, SOLIDWORKS Simulation, GD&T, Tolerance Stack-Up, 5-Axis CNC]
role: Design lead
duration: 14 weeks
status: Prototype tested
objective: >-
  A quasi-direct-drive leg joint needed 36:1 reduction at 18 N·m continuous inside a 70 mm
  diameter, with backlash under 10 arcmin. Custom ground gears were outside the budget, so the
  precision had to come from the carrier and housing, not the teeth.
outcome: >-
  The second prototype met every target on the back-to-back rig and ran 200 hours at rated torque
  without measurable backlash growth.
metrics:
  - { value: '36:1', label: 'Reduction in a 68 mm OD' }
  - { value: '8.4′', label: 'Measured backlash (arcmin)' }
  - { value: '91%', label: 'Efficiency at rated torque' }
  - { value: '412 g', label: 'Mass, 22% under baseline' }
cover: ./planetary-gearbox/cover.svg
coverAlt: Front view drawing of a planetary gear stage with sun, three planets and ring gear
gallery:
  - src: ./planetary-gearbox/fig-02.svg
    alt: Axial section through both gear stages
    caption: Axial section, two stages
  - src: ./planetary-gearbox/fig-03.svg
    alt: Exploded view of the gearbox assembly with numbered parts
    caption: Exploded assembly
  - src: ./planetary-gearbox/fig-04.svg
    alt: Stress plot of the planet carrier at 1.5 times rated torque
    caption: Carrier stress at 1.5× overload
---

Sizing came before CAD. Lewis bending and Hertzian contact checks on a spreadsheet fixed the
module, face width, and tooth counts (24 / 48 / 120) for two identical 6:1 stages.

- **Top-down assembly.** One master sketch in SOLIDWORKS drives the centre distances, so a change
  to the tooth count updates the carrier, housing, and both drawings together.
- **Load sharing.** The sun floats radially. Three planets then share load within 8% of each
  other, which let the gears stay catalogue parts.
- **Tolerance stack-up.** An RSS stack on planet pin position showed the pins, not the teeth,
  set the backlash. That put a 0.01 mm true-position callout on three holes and relaxed
  everything else.
- **Simulation.** Carrier and ring housing were checked at 1.5× rated torque. Peak stress sits at
  the pin root with a safety factor of 2.4 in 7075-T6.
- **Test.** Two units ran back to back on a torque-sensor rig for efficiency, backlash, and
  temperature rise.
