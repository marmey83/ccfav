# README Marketing Page Design

**Date:** 2026-04-13  
**Status:** Approved

## Goal

Replace the current functional-but-plain README with a polished, terminal-native marketing README that sells `fav` to Claude Code users discovering it on GitHub.

## Approach

**Narrative-first.** Open with the pain point before anything technical. The emotional hook ("Claude just gave you the perfect answer. You closed the terminal. It's gone.") lands the problem before the tool is mentioned. This is more memorable and shareable than a feature list or demo-first approach.

## Visual Style

**Terminal native / GitHub dark.** Monospace, green-on-black ASCII art, code blocks everywhere. Feels at home in the GitHub dark theme that most developers use. No light-mode-first assumptions, no SaaS pastels.

## Structure

### 1. Header
ASCII art rendering of `fav` in a block font, centered. Followed by a single tagline line:
> Bookmark and search your Claude Code responses.

### 2. Badges
Three badges, centered, in a row:
- `npm` version (dynamic, linked to npmjs.com)
- `license: MIT`
- `node: ≥18`

### 3. Hook
Two-line emotional hook, centered, italic:
> Claude just gave you the perfect answer.  
> You closed the terminal. It's gone.

No heading — runs directly before the demo GIF for maximum impact.

### 4. Demo GIF (hero)
A VHS-recorded GIF showing the core workflow. Preferred sequence:
1. `fav pick` — browse recent responses interactively, select one
2. `fav search "sqlite"` — show results
3. `fav list --tag auth` — filtered list

GIF to be recorded by the author using VHS (`brew install vhs`). Placeholder in spec: `demo.gif` at repo root, referenced as `![demo](demo.gif)`.

### 5. Install
Single code block:
```sh
npm install -g ccfav
```
Followed by a one-liner noting both `ccfav` and `fav` are available as commands.

### 6. Commands Table
Markdown table with two columns: `Command` and `What it does`. Rows:

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

### 7. Tagging & Notes
Small subsection under Commands showing the `--tag` and `--note` flags with two example commands.

### 8. How It Works
A brief paragraph (3–4 sentences) explaining the mechanism:
- reads `~/.claude/projects/` JSONL transcripts (read-only)
- finds the most recent session for the current project
- stores saved responses in `~/.ccfav/ccfav.db` (SQLite, local, no server)

### 9. Data
Two-row table:

| Path | Purpose |
|---|---|
| `~/.ccfav/ccfav.db` | Your favourites — SQLite, single file, portable |
| `~/.claude/projects/` | Transcripts — read-only, never modified |

### 10. Footer
Minimal: `MIT License · made for Claude Code users`

## Deliverables

1. **`README.md`** — the new marketing README, replacing the existing one
2. **`demo.gif`** — recorded with VHS, placed at repo root, referenced from README
3. **`.vhs/demo.tape`** — VHS tape script committed to repo so the GIF can be regenerated

## Out of Scope

- GitHub Pages site (not needed — README is sufficient)
- Separate documentation site
- Light mode styling (GitHub dark is the target)
