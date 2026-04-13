# ccfav

Bookmark and search your Claude Code responses. Save the output you want to keep, tag it, find it later.

## Install

```sh
npm install -g ccfav
```

After installing, both `ccfav` and `fav` are available as commands.

## Usage

```sh
# Save the last response from the current Claude Code session
fav

# Save with tags
fav --tag "auth" --tag "nourli"

# Save the 4th response from the bottom
fav 4 --tag "schema"

# Interactively pick a response from the last 10
fav pick

# Search full-text
fav search "tombstone"

# List all favourites
fav list

# Filter by tag
fav list --tag "auth"

# Show full content of a favourite
fav show 42

# Delete a favourite (prompts for confirmation)
fav delete 42
fav delete 42 --force

# Export as Markdown
fav export --tag "nourli" -o favourites.md
fav export > all.md
```

## How it works

ccfav reads Claude Code's session transcripts from `~/.claude/projects/` (or `$CLAUDE_CONFIG_DIR/projects/`), finds the most recent session for the current project, and extracts assistant responses. Favourites are stored in `~/.ccfav/ccfav.db` (SQLite — no setup required).

## Data

- **Database:** `~/.ccfav/ccfav.db` — SQLite, single file, no server needed
- **Transcripts:** Read-only access to `~/.claude/projects/` — ccfav never modifies them

## License

MIT
