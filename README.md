## What I Learned

Building ContactHub helped me practice:

- **DOM manipulation without a framework** — creating, updating, and removing
  elements directly with `document.createElement`, `querySelector`, and
  `<template>` cloning instead of relying on a library to do it for me.
- **CRUD logic** — implementing full create, read, update, and delete flows
  for contacts, including editing an existing object in place with
  `Object.assign` instead of replacing it (so the array keeps pointing at
  the right item).
- **Data persistence with `localStorage`** — saving the contacts array as
  JSON so the data survives a page refresh, and loading it back safely.
- **Form validation with regex** — writing patterns to validate a name,
  an Egyptian phone number, and an email address, then reflecting
  pass/fail state with Bootstrap's `.is-invalid` class.
- **Bootstrap 5 in depth** — building the whole layout with its grid system,
  modal component, form classes, and utility classes instead of writing
  custom layout CSS from scratch.
- **Working with Font Awesome locally** — pulling the icon font package
  through npm and linking it from a local folder instead of a CDN.
- **Small JS patterns that add up** — template literals for building
  strings, ternary operators for singular/plural text ("1 contact" vs
  "2 contacts"), `Array.filter()` for computing stats, and deterministic
  "random" values (turning a name into a consistent avatar color instead
  of a real random one).
- **Debugging a real layout bug** — tracking down why cards visually
  "floated" upward after repeated clicks: an old DOM cleanup only removed
  the *contents* of a wrapper row, not the row itself, so empty rows piled
  up and Bootstrap's negative gutter margin compounded on every re-render.
- **Writing beginner-readable code on purpose** — choosing `var` over
  `let`/`const` and `if`/`else` over `try`/`catch` where it made the logic
  easier to follow, and being deliberate about that trade-off rather than
  just defaulting to the "modern" syntax.
