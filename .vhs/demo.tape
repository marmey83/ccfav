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
