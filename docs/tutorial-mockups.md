# Illustrated button tutorial

The public tutorial is `tutorial.html`. It explains the interface controls,
using reconstructed screens from the real extension renderer and the ESA22
workspace as an example. It does not report or assess the run's proof outcome.

## Sources and review

- Extension snapshot: `formalize-everything` commit `550ebbe`.
- Layout, wording, and click targets: `media/sidebar.js`, `media/sidebar.css`,
  `media/chat.js`, `media/chat.css`, and `src/ui/chatPanel.ts`.
- State model: `src/session/session.ts` and `scripts/mock-entry.ts`.
- Statement card: `src/flows/statementCard.ts` and `src/model/early.ts`.
  The tutorial uses the current actions, **Start proving** and
  **I want to edit it first**, rather than the older mock-card action labels.
- Example paper: `esa22-copy/esa22-final.tex`, root recorded in
  `.blueprint/root.json`.
- Result labels and locations: `.blueprint/status.json`.
- Model filenames and purposes: `.blueprint/thm-main-5e5f26eaeb/blueprint.json`.
- Resume example: `.blueprint/run/thm-main-2b14xc/checkpoint.json`.
  The stopped state is reconstructed to explain Resume, not taken from a
  screenshot of that checkpoint. Its original state was complete.

Reviewed the explanations against the controls' handlers and tooltips. The
illustrations cover connection and scanning, one-result and multiple-result
selection, settings, statement review, Pause, Resume, Blueprint, Log, and Chat.
Chat suggestion buttons populate drafts; **Send message** submits the draft.
These are separate actions in the tutorial. No conversation reply is invented.

The proposed-restatement example calls the actual `askAboutRestate` function
in `src/analysis/recovery/statementDrift.ts`. It uses a hypothetical
`Example.space_bound` and a proposal to add `n ≥ 2`, rather than attributing
this request to the ESA22 run. Descriptions were checked against this function,
`src/analysis/recovery/authorRestate.ts`, and `src/topdown/loop.ts`.
Typed modifications override the displayed suggestion. Keeping the statement
continues proof work; manual editing stops the run for author edits.
The generic **Not now** control dismisses the choice and stops the run.

Use `--only restate` to regenerate just this screen and its control metadata.

The descriptive title “Distinct elements in a stream” is supplied for the
mockup; the paper's own target identifier is `thm:main`. Provider and model
availability vary by installation. The example model entry is “Provider
default”; it is not a list of available provider models.

## Regeneration

The PNGs are generated with the extension's actual provider, view model, CSS,
and JavaScript. VS Code services are stubbed; no agents or commands execute.
The script only reads the sibling extension and run directories.

```sh
node scripts/render-tutorial.mjs \
  --extension ../formalize-everything \
  --run ../esa22-copy \
  --playwright /path/to/playwright/index.mjs \
  --chrome /path/to/chrome
```

Requires esbuild in the extension checkout and a local Playwright installation.
The normal website check/build uses no browser dependencies. The generator
records the measured click targets in `assets/tutorial/controls.json`; match
those coordinates when updating the overlay buttons in `tutorial.html`.
The Settings image is displayed cropped at 510 CSS pixels to keep the focus
on the settings panel. Coordinates use that displayed height.

The public build allowlist includes the HTML, website styles/scripts, SVG icon,
and PNGs. It excludes extension source, raw paper, checkpoints, metadata JSON,
and internal documentation. All explanatory text remains readable without
JavaScript. With JavaScript, controls select and focus the corresponding
explanation; on mobile it scrolls into view.


## Reset explanation

The Settings callout for **Reset project state** was expanded against
`media/sidebar.js` (`resetRow`) and `src/flows/machine.ts` (`deleteEverything`).
It covers the active-run guard, the paper-specific defaults, optional shared
machine resources and saved keys, the confirmation actions, and recovery after
reset. The existing Settings mockup and hotspot still show the same control;
no reset or deletion was executed to document it.
