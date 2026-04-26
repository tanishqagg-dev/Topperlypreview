# Topperly Capabilities Guide

[Source-of-truth document — referenced by the marketing copy on /, /product, /story, /access. Last imported by Claude on 2026-04-25 from the brief the user provided.]

## What Topperly Is
Topperly is a study-and-creation workspace that combines AI conversation with live outputs you can inspect beside the chat. It is built for people who do not just want an answer in paragraph form. They want something usable: a quiz, a worksheet, a chart, a slide deck, a runnable mini-app, printable notes, or editable code.

The most important product truth: Topperly is not just a chatbot with a nice theme. It is a multi-output workspace where the conversation can generate structured artifacts, open them in a side panel or a dedicated tool page, and let the user keep working from there.

## Audiences
- **Students** — primary. Study a chapter, build flashcards, solve math step by step, generate worksheets, create revision notes, build presentations.
- **Independent learners** — same tools without the classroom wrapper. Learn a topic, turn a chapter into revision material, create self-tests, build interactive explainers.
- **Educators and tutors** — generate practice material quickly. Worksheets, quizzes, flashcards, presentations, PDFs.
- **Secondary** — developers (Python IDE, web app generator), knowledge workers (chart, doc, sheet, PDF, presentation tools).

## Core Product Powers (14)
1. Dynamic Artifact Panel and Canvas System
2. Resizable Split Workspace
3. Simultaneous Multi-Artifact Generation
4. Live Web Search (optional mode)
5. File Uploads and Context Ingestion (images + PDFs, max 4 attachments per message)
6. Transparent Thinking Blocks (surfaced planning trace, not literal CoT)
7. Real-Time Streaming Responses
8. LaTeX and Math Rendering
9. SVG and Diagram Rendering (incl. Mermaid)
10. Code Generation and Execution
11. Export-Style Deliverables (PDF, MD, CSV, PPTX, HTML)
12. Thread History and Dedicated Tool Workspaces (`/tools/*`)
13. Guided Long-Task Planning and Approval
14. Mode Toggles (web search, NCERT-focused, assignment, deliberate)

## The 15 Tools

### Learning Suite
- **Quiz Generator** — interactive scored quiz with answer key + feedback
- **Flashcards** — flippable study deck (not full SRS)
- **Math Solver** — step-by-step worked solution with rendered equations
- **Worksheet Generator** — printable practice sheets with sections

### Visual Lab
- **Interactive Presentation** — clickable in-app slide deck (stays in workspace)
- **Process Animation** — SVG-based animated explainer with stage rail
- **Interactive Simulation** — parameter-driven model with sliders + live view (sandboxed iframe)
- **Data Visualization** — line/bar/pie chart rendered in a dark canvas

### Build & Export
- **Interactive Web App** — self-contained runnable HTML/CSS/JS artifact
- **Python IDE** — IDLE-style editor + console + browser runtime
- **PDF Notes** — A4 document viewer with markdown, math, tables, PDF download
- **Google Doc Draft** — doc-style preview with copy + open-in-Docs
- **Google Sheet Draft** — grid preview, CSV download, optional Sheets pre-fill
- **PowerPoint Builder** — downloadable .pptx file
- **Canva Design Spec** — structured creative brief (palette, type, layout, copy) — NOT a native Canva file

## Truthfulness Boundaries (do not over-claim)
- File ingestion: images + PDFs only, max 4 attachments per message
- Web search: optional toggle, not always-on
- Thinking blocks: surfaced UI trace, not the model's literal hidden reasoning
- Flashcards: deck navigation, not a full spaced-repetition scheduler
- Web App: single-file HTML artifact, not a multi-file production scaffold
- Python IDE: browser runtime, not a full local desktop IDE
- Google Doc Draft: copy-and-open behavior, not a full embedded Docs editor
- Google Sheet Draft: pre-fill depends on Google client config in env
- Canva: design brief, not a native Canva file
- Not implemented: live team collaboration, multi-user editing, enterprise admin, voice assistant, native mobile app

## Internal Mapping (for engineering reference)
| Public name | Tool id | Route | Artifact |
|---|---|---|---|
| Quiz Generator | `quiz` | `/tools/quiz` | `quiz` |
| Flashcards | `flashcards` | `/tools/flashcards` | `flashcards` |
| Math Solver | `math-solver` | `/tools/math-solver` | `math_solver` |
| Worksheet Generator | `worksheet` | `/tools/worksheet` | `worksheet` |
| Interactive Presentation | `presentation` | `/tools/presentation` | `presentation` |
| Process Animation | `animation` | `/tools/animation` | `animation` |
| Interactive Simulation | `simulation` | `/tools/simulation` | `simulation` |
| Data Visualization | `chart` | `/tools/chart` | `chart` |
| Interactive Web App | `web-app` | `/tools/web-app` | `html` |
| Python IDE | `python` | `/tools/python` | `python` |
| PDF Notes | `pdf` | `/tools/pdf` | `pdf` |
| Google Doc Draft | `gdoc` | `/tools/gdoc` | `gdoc` |
| Google Sheet Draft | `gsheet` | `/tools/gsheet` | `gsheet` |
| PowerPoint Builder | `ppt` | `/tools/ppt` | `ppt` |
| Canva Design Spec | `canva` | `/tools/canva` | `canva` |
