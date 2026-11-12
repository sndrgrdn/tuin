# Prototype picker

The switcher for a visual prototype. It is harness chrome, not a contestant: it keeps its own look in every project, apart from the project's tokens, fonts and colours, so it cannot sway the choice.

**Behaviour**

- One control per variant, labelled with the variant's name from the playbook. The active one is marked, with `aria-current`.
- Fixed at the bottom centre of the viewport, above everything else on the page, with its own dark, neutral look that reads on light and dark pages.
- Number keys `1` to `9` select a variant; left and right arrows step through them, wrapping at the ends. Keys go to a text field while it has focus.
- The selection is a URL query parameter (`?v=quiet`), updated without a page load. Opening that URL shows that variant, and no parameter shows the first.
- Switching is instant: the new variant replaces the old in one frame. Remount the variant so its entrance runs again.
- When a variant has motion, add a replay control, bound to `R`, that remounts the active variant.

**Complete when** every key and control switches variants, reloading keeps the variant, and the picker looks the same on a light and a dark page.
