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

Works seamlessly from git worktrees — the main project's transcripts are always used.

## Data

| Path | Purpose |
|---|---|
| `~/.ccfav/ccfav.db` | Your favourites — SQLite, single file, portable |
| `~/.claude/projects/` | Transcripts — read-only, never modified |

---

<div align="center">
  MIT License · made for Claude Code users
</div>
