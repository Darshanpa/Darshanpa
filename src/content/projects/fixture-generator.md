---
title: 'Code-CAD Fixture Generator'
summary: Inspection fixtures generated from a YAML part spec in four minutes, where manual CAD took 3.5 hours.
year: 2025
order: 4
domain: Code-CAD & Automation
categories: [hardware, software]
section: software
featured: true
tools: [build123d, Python, pytest, GitHub Actions, FDM Printing]
role: Author and maintainer
duration: 6 weeks, then ongoing
status: In daily use
objective: >-
  Every part revision needed a new go/no-go check fixture, and each one took three to four hours
  of manual CAD that nobody reviewed. Fixtures lagged the parts they were meant to check. The aim
  was a fixture that regenerates from the part's datum scheme whenever the part changes.
outcome: >-
  Forty-one fixtures have been generated with no manual CAD edits. A revision change is now a
  one-line edit to a YAML file and a pull request.
metrics:
  - { value: '3.5 h → 4 min', label: 'Median design time per fixture' }
  - { value: '41', label: 'Fixtures generated' }
  - { value: '0', label: 'Manual CAD edits' }
  - { value: '8.2%', label: 'Gauge R&R on printed fixtures' }
cover: ./fixture-generator/cover.svg
coverAlt: Six variations of a fixture plate with locating pins, generated from one parametric model
gallery:
  - src: ./fixture-generator/fig-02.svg
    alt: Python source for the fixture model beside the resulting 3D part
    caption: Model source and STEP output
  - src: ./fixture-generator/fig-03.svg
    alt: Pipeline diagram from YAML spec through geometry tests to print queue
    caption: Commit-to-print pipeline
  - src: ./fixture-generator/fig-04.svg
    alt: Bar chart comparing manual and generated design time for four fixtures
    caption: Design time per fixture
---

The fixture is a pure function of the part spec. Nothing is drawn by hand, so nothing can drift.

- **Spec in, part out.** A YAML file lists datums, locating pin positions, the part outline, and
  clearance. A build123d function turns that into a base, a nest pocket, and pins.
- **Geometry under test.** pytest checks every generated fixture: minimum wall of 2.0 mm, no
  interference with the nominal part, pins inside the base, and a volume within print limits.
- **CI builds the lot.** Each commit rebuilds all fixtures in GitHub Actions and attaches STEP,
  STL, and a one-page drawing. A failed check comments on the pull request with the rule and the
  face that broke it.
- **Print and verify.** Fixtures print in PETG-CF. A gauge R&R study on three of them confirmed
  the printed parts are good enough to make accept/reject calls.
