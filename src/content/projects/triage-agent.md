---
title: Test-Report Triage Agent
summary: A local-first LLM pipeline that reads lab reports, finds similar past failures, and tracks open actions.
year: 2026
order: 5
domain: AI Workflow & Tracking
categories: [software, failure]
section: software
featured: false
tools: [Python, Ollama, Claude API, SQLite, Streamlit]
role: Author
duration: 8 weeks
status: Running nightly
objective: >-
  Test and failure reports sat as PDFs and spreadsheets in shared folders. Answering "have we
  seen this before?" took about two hours of searching and usually ended with asking whoever had
  been around longest. The agent had to answer that question in under a minute and keep
  proprietary test data on a local machine by default.
outcome: >-
  The tracker is now the first stop when a new failure comes in. Five repeat failures were linked
  to earlier reports in the first quarter of use.
metrics:
  - { value: '94%', label: 'Agreement with hand labels' }
  - { value: '2 h → 41 s', label: 'Median similar-case lookup' }
  - { value: '83%', label: 'Reports handled fully locally' }
  - { value: '612', label: 'Reports indexed' }
cover: ./triage-agent/cover.svg
coverAlt: Data flow diagram of the triage pipeline from watch folder to tracker, with a cloud escalation path
gallery:
  - src: ./triage-agent/fig-02.svg
    alt: Tracker dashboard with counts, open actions and failure mode chart
    caption: Tracker dashboard
  - src: ./triage-agent/fig-03.svg
    alt: Terminal output from an ingest run of 14 reports
    caption: Ingest run, 14 reports
  - src: ./triage-agent/fig-04.svg
    alt: Bar chart of classification agreement by failure mode, keyword rules versus the agent
    caption: Agreement with hand labels
---

Three pieces: an ingest script, an agent that decides where each report goes, and a tracker.

- **Ingest.** A watch-folder script parses PDFs, CSVs, and spreadsheets, then asks a local model
  (served by Ollama) for a fixed JSON schema: part, test, failure mode, conditions, and
  disposition. Pydantic validates the output and retries twice before flagging a human.
- **Match.** Each report is embedded and stored in SQLite. New reports pull the five nearest past
  cases with their similarity scores.
- **Escalate only when needed.** If no past case scores above 0.60, the agent redacts part
  numbers and customer names and sends the summary to a cloud model for a second classification.
  About one report in six takes that path.
- **Track.** A Streamlit dashboard lists open actions, owners, and linked cases, so a repeat
  failure shows up next to its history.
- **Evaluate.** A set of 120 hand-labelled reports runs on every prompt or model change. Nothing
  ships if agreement drops.
