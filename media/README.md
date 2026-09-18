# media

Drop images and videos for each project into the matching folder.
Then open `media.js` in the repo root and add an entry to the
corresponding array. Nothing shows on the site until you add it.

## Supported types

{ "type": "image", "src": "media/number-guesser/drawing.png", "caption": "drawing a 7" }
{ "type": "video", "src": "media/number-guesser/inference.mp4", "caption": "C inference", "poster": "media/number-guesser/thumb.png" }

## Folder names must match the project slug

- number-guesser
- nn-from-scratch
- ml-models-from-scratch
- math-network

Keep filenames lowercase, no spaces. Use dashes if needed.