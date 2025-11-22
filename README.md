# Othello Spel

Ett enkelt webbaserat Othello-spel byggt med HTML, CSS och JavaScript.

## Version

1.3

## Funktioner

- 8x8 spelplan
- Grön spelplan med textur
- Två spelare: Svart (människa) och Vit (AI)
- AI med två nivåer: Slumpmässig eller Strategisk
- Automatisk vändning av brickor
- Poängräknare
- Enkelt och snyggt gränssnitt

## Hur man spelar

1. Öppna `index.html` i en webbläsare.
2. Välj AI-nivå och klicka "Starta spel".
3. Klicka på en markerad ruta för att placera en svart bricka.
4. AI:n gör sitt drag automatiskt.
5. Spelet följer standard Othello-regler: Omge motståndarens brickor för att vända dem.
6. Spelet slutar när ingen kan göra ett giltigt drag.

## AI-nivåer

- **Nivå 1**: AI:n väljer slumpmässiga giltiga drag.
- **Nivå 2**: AI:n använder enkel strategi – föredrar hörn och undviker dåliga kanter.
- **Nivå 3**: AI:n använder avancerad strategi med minimax för bättre beslut.

## Teknologier

- HTML5
- CSS3
- JavaScript (ES6)
