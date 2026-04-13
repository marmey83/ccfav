# README Marketing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the plain README with a polished terminal-native marketing page that sells `fav` to Claude Code users discovering it on GitHub.

**Architecture:** Three deliverables — a VHS tape script that captures the tool in action, the generated `demo.gif`, and the new `README.md` that wires them together. The README uses GitHub-flavored markdown with centered HTML for the header section, and the tape script is committed so the GIF can be regenerated.

**Tech Stack:** Markdown, GitHub-flavored HTML (for centering), VHS (`brew install vhs`), shields.io badges

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `.gitignore` | Modify | Add `.superpowers/` |
| `.vhs/demo.tape` | Create | VHS script to record demo GIF |
| `demo.gif` | Create (VHS output) | Hero demo at repo root |
| `README.md` | Replace | New marketing README |

---

### Task 1: Update `.gitignore`

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add `.superpowers/` to `.gitignore`**

Open `.gitignore` and append one line so the brainstorming session files are never committed:

```
node_modules/
dist/
*.db
.superpowers/
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore .superpowers/ directory"
```

---

### Task 2: Write the VHS tape script

**Files:**
- Create: `.vhs/demo.tape`

The tape records three scenes: saving a response, searching, and listing with a tag filter. VHS records real terminal output, so `fav` must be installed globally (`npm install -g .`) and you must have at least one Claude Code session transcript in `~/.claude/projects/` for the current project before recording.

- [ ] **Step 1: Create `.vhs/` directory and write the tape**

Create `.vhs/demo.tape` with this exact content:

```tape
Output demo.gif

Set Shell "zsh"
Set FontSize 14
Set Width 1000
Set Height 550
Set Theme "Dracula"
Set Padding 20
Set TypingSpeed 80ms
Set PlaybackSpeed 0.8

# Scene 1 — save the last response
Sleep 500ms
Type "fav --tag auth --note 'great middleware pattern'"
Sleep 300ms
Enter
Sleep 1500ms

# Scene 2 — interactive pick
Type "fav pick"
Sleep 300ms
Enter
Sleep 1000ms
Down
Sleep 400ms
Down
Sleep 400ms
Enter
Sleep 1500ms

# Scene 3 — search
Type `fav search "auth"`
Sleep 300ms
Enter
Sleep 1500ms

# Scene 4 — list with tag
Type "fav list --tag auth"
Sleep 300ms
Enter
Sleep 2000ms
```

- [ ] **Step 2: Commit the tape script**

```bash
git add .vhs/demo.tape
git commit -m "chore: add VHS tape script for demo GIF"
```

---

### Task 3: Record the demo GIF

**Files:**
- Create: `demo.gif` (output of VHS, at repo root)

**Pre-flight checklist before recording:**
1. `fav` is installed globally — run `which fav` to confirm
2. You have a Claude Code session transcript for this project — check `ls ~/.claude/projects/ | grep ccfav`
3. You have at least 3–5 saved favourites to make `fav list` and `fav search` look good — run `fav list` to check; if empty, run `fav` a few times from this project first

- [ ] **Step 1: Run VHS from the project root**

```bash
cd /Users/martina.meyer/Projects/ccfav
vhs .vhs/demo.tape
```

VHS will open a terminal window, type the commands, and write `demo.gif` to the current directory. Expected: a file `demo.gif` appears at the project root (~1–3 MB).

- [ ] **Step 2: Preview the GIF**

```bash
open demo.gif
```

Check: commands are readable, output looks good, timing isn't too fast or slow. If you need to adjust timing, edit `Set TypingSpeed` or `Sleep` values in `.vhs/demo.tape` and re-run `vhs .vhs/demo.tape`.

- [ ] **Step 3: Commit the GIF**

```bash
git add demo.gif
git commit -m "chore: add demo GIF recorded with VHS"
```

---

### Task 4: Write the new README

**Files:**
- Replace: `README.md`

- [ ] **Step 1: Replace `README.md` with the full marketing content**

Overwrite `README.md` entirely with:

````markdown
<div align="center">

<pre>
  ███████╗ █████╗ ██╗   ██╗
  ██╔════╝██╔══██╗██║   ██║
  █████╗  ███████║██║   ██║
  ██╔══╝  ██╔══██║╚██╗ ██╔╝
  ██║     ██║  ██║ ╚████╔╝
  ╚═╝     ╚═╝  ╚═╝  ╚═══╝
</pre>

**Bookmark and search your Claude Code responses.**

[![npm](https://img.shields.io/npm/v/ccfav?color=cb3837&label=npm&style=flat-square)](https://www.npmjs.com/package/ccfav)
[![license](https://img.shields.io/badge/license-MIT-007ec6?style=flat-square)](LICENSE)
[![node](https://img.shields.io/badge/node-%E2%89%A518-3fb950?style=flat-square)](package.json)

---

*Claude just gave you the perfect answer.*  
*You closed the terminal. It's gone.*

</div>

![demo](demo.gif)

## Install

```sh
npm install -g ccfav
```

Both `ccfav` and `fav` are available as commands after install.

## Commands

| Command | What it does |
|---|---|
| `fav` | Save the last Claude response from the current session |
| `fav 3` | Save the 3rd response from the bottom |
| `fav pick` | Interactively browse and pick a response to save |
| `fav search "query"` | Full-text search across all saved favourites |
| `fav list --tag auth` | List favourites, filtered by tag |
| `fav show 42` | Display the full content of favourite #42 |
| `fav delete 42` | Delete a favourite (prompts for confirmation) |
| `fav export -o notes.md` | Export all favourites to a Markdown file |

### Tagging & notes

```sh
fav --tag auth --tag nourli
fav --note "great pattern for generics"
fav 2 --tag typescript --note "keep this"
```

## How it works

`ccfav` reads Claude Code's session transcripts from `~/.claude/projects/` — the same JSONL files Claude Code writes locally for every conversation. It finds the most recent session for your current project, extracts assistant responses, and saves the ones you pick to a local SQLite database. No server, no account, no cloud.

## Data

| Path | Purpose |
|---|---|
| `~/.ccfav/ccfav.db` | Your favourites — SQLite, single file, portable |
| `~/.claude/projects/` | Transcripts — read-only, never modified |

---

<div align="center">
  MIT License · made for Claude Code users
</div>
````

- [ ] **Step 2: Preview locally**

Open `README.md` on GitHub (after pushing) or use a local markdown previewer to verify:
- ASCII art renders in a monospace block
- Badges appear as colored pills
- Demo GIF plays
- Table columns align
- Italic hook text is centered

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: marketing README — terminal native with demo GIF"
```

---

### Task 5: Push and verify on GitHub

- [ ] **Step 1: Push to GitHub**

```bash
git push origin main
```

- [ ] **Step 2: Open the repo page and verify**

Navigate to `https://github.com/marmey83/ccfav` and check:
- ASCII art header renders correctly in the dark theme
- Badges link to the right places (npm badge will show "not found" if ccfav isn't published to npm yet — this is expected)
- Demo GIF plays inline
- Commands table is clean and readable
- No raw HTML artifacts visible

If the npm badge shows an error because the package isn't published yet, replace the dynamic badge with a static one:

```markdown
[![npm](https://img.shields.io/badge/npm-v0.1.0-cb3837?style=flat-square)](https://www.npmjs.com/package/ccfav)
```

- [ ] **Step 3: Done**

The README is live. Share `https://github.com/marmey83/ccfav`.
