---
title: 'Root Cause: Field Fatigue Cracks in a Stamped Bracket'
summary: Brackets cracked at 38k cycles against a 250k design life. The cause was a burr, not the design.
year: 2024
order: 2
domain: Forensic Failure Analysis
categories: [failure]
section: engineering
featured: true
tools: [Shainin Red X, Fractography, Minitab, Strain Gauging, FEA]
role: Investigation lead
duration: 5 weeks
status: Closed, corrective action verified
objective: >-
  A stamped steel mounting bracket came back from the field with fatigue cracks at a 1.8% rate.
  FEA said the part had margin and three earlier design changes had not moved the number.
  The job was to find the dominant cause from the parts themselves, without another guess.
outcome: >-
  The Red X was a sheared-edge burr over 0.12 mm sitting on the tension side of the bend,
  produced by a worn trim die. Flipping the blank and adding a burr-height check fixed it with
  no change to the drawing geometry.
metrics:
  - { value: '38k → 310k', label: 'Cycles to failure, C vs B' }
  - { value: '6 / 6', label: 'B units reached run-out' }
  - { value: '1.8% → 0.05%', label: 'Field return rate' }
  - { value: '9 days', label: 'To containment' }
cover: ./bracket-fatigue-root-cause/cover.svg
coverAlt: Drawing of an L-shaped bracket with a crack at the inside bend and a magnified detail of the crack origin
gallery:
  - src: ./bracket-fatigue-root-cause/fig-02.svg
    alt: Map of a fracture surface showing beach marks spreading from one corner
    caption: Fracture surface map
  - src: ./bracket-fatigue-root-cause/fig-03.svg
    alt: Multi-vari chart comparing fatigue life across five stamping lots
    caption: Multi-vari, lot to lot
  - src: ./bracket-fatigue-root-cause/fig-04.svg
    alt: Dot plot of six current parts failing early and six corrected parts reaching run-out
    caption: B vs C confirmation
---

The investigation followed the Shainin sequence: let the parts talk, converge on one family of
variation, then prove the cause can be switched on and off.

- **Fractography first.** Stereo and SEM images of eight returns all showed beach marks starting
  at the sheared edge on the inside of the bend. One origin, one mechanism.
- **Multi-vari.** Forty-five brackets across five lots went on the fatigue rig. Lot-to-lot
  variation dwarfed part-to-part, which ruled out assembly and pointed at the press.
- **Paired comparison.** Eight best and eight worst parts were measured on 14 features. Only burr
  height and burr side separated the groups completely.
- **Strain gauging.** Gauges at the bend confirmed FEA was right about nominal stress. The model
  had no burr in it.
- **B vs C.** Six parts with the burr on the compression side and under 0.05 mm ran against six
  current parts. No overlap, so the cause was confirmed at better than 99% confidence.
