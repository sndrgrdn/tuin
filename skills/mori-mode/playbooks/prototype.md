# Prototype

You own the decision, not the code. The prototype is a throwaway instrument. The real build follows Feature.

Speed beats polish here. The rigour goes into picking the right design cheaply, and the method is **divergence**: variants that answer the same brief differently, so flipping between them teaches the user something.

1. **Name the decision** the prototype exists to make: which layout, interaction or density, or which behaviour, timing or approach. One decision and, for a UI fork, one UI piece per run; narrow "the dashboard" to its highest-leverage piece and list the rest as follow-ups. No decision means no prototype; route to Feature.
   **Complete when** the decision and the piece fit in one sentence.
2. **Gather references** when the design space is open, and let the user pick directions. Skip when the direction is set.
3. **Diverge.** Each variant is a direction you could defend shipping, and differs from the others on a named axis (layout, density, personality, motion, interaction model), stated in a phrase. Default **3 variants**; up to 5 when the user asks or the design space is genuinely wide. More than 5 dilutes the comparison. Cut a variant that converges with another, and say so (Exhaust the Design Space: include one the user did not ask for).
   **Complete when** every variant has a name that describes its direction and an axis no other variant shares.
4. **Recon the stack** for a UI fork: framework, styling system, tokens, and where the piece renders (background, neighbours, sizes). Variants use the project's tokens and real product-shaped content, so each could ship tomorrow. With no project, use one self-contained HTML file and a plain default look.
   **Complete when** you can name the styling system, the tokens and what surrounds the piece where it renders.
5. **Build on a throwaway branch or worktree,** never on the branch that ships.

   **Visual fork:**
   - Put the variants on an isolated, dev-only route, one file per variant. Nothing in production imports it.
   - Show one variant at a time, full size, in realistic surrounding context: a toast needs a page behind it, a card its siblings.
   - Add the picker from `prototype-picker.md`. Switching is instant, and the variant is in the URL.
   - Every interaction in a variant works.

   **Behaviour or timing fork:**
   - Build it in a scratch directory, apart from production code, with the smallest script that exercises it.
   - Put the variants behind one switcher (buttons, a key or a flag), each labelled.

   **Complete when** you have flipped through every variant yourself on the running surface, each behaves correctly, and the console or output is clean. Screenshot each when browser tooling exists.
6. **Present** a neutral table: for each variant, its axis, when it wins and what it costs. Then, separately in the reply, give your pick and the reason, rooted in the product and how often the piece is used. Give the surface's URL and the keys. The choice is the user's; when they want another round, keep the harness and diverge around the direction they liked.
   **Complete when** the user has picked a variant or asked for another round.
7. **Hand off.** Hand the chosen direction to Feature as the spec. Then delete the surface, the branch and the worktree, unless the user asks to keep them.
   **Complete when** nothing from the prototype remains in the repo except what the user asked to keep.

**Reply:** the variants, the evidence, the tradeoff table, your recommendation and the surface path.
