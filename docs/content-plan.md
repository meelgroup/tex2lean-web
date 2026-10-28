# Tex2Lean website: content and design plan

Status: revised publication plan. Reviewed against the local extension on October 4, 2026.

## Purpose and audience

Help a paper author install Tex2Lean, formalize one selected result, understand the resulting Lean project, and review the evidence before sharing it. Lead with papers that state an algorithm and prove a result about its output. A reader need not already know Lean to start, but the translated theorem needs human review.

## What to highlight

1. LaTeX to a Lean 4 project: mathematical definitions, algorithm, theorem, and proof.
2. Mathlib and arlib reuse, with machine setup handled by the extension.
3. An explicit theorem review checkpoint before proof work.
4. A visible Planning → Interface → Proof workflow.
5. Lean checks proofs; the user checks correspondence with the paper.
6. Prior results are visible hypotheses, not silently hidden proof obligations.
7. Pause, resume, project-aware questions, and checked change requests.
8. Existing Lean statements can be proved directly.
9. Several selected results can share a development.
10. Proof graphs, mechanical checks, handoff review, and optional community donation.

## Information architecture

A single page with anchored sections: overview, getting started, workflow, reviewing results, further workflows, FAQ, and help. The landing section has an install link and a tutorial link. Getting started provides exact extension button and command names, prerequisites, and expected outputs. Explain advanced features after the first result rather than introducing every setting at installation.

## Getting started outline

Install from the Marketplace or a release VSIX. Open the paper folder and the Tex2Lean sidebar. Connect a supported provider. Run Set Up, scan LaTeX sources, select Formalize, inspect the generated theorem, and begin proving. Check the final Lean evidence and handoff report.

## Design direction

Use a restrained academic notebook aesthetic: warm white canvas, dark ink, green accent, readable prose, and monospaced technical labels. Show a schematic paper-to-Lean illustration, clearly marked as illustrative. Use a sticky navigation bar, ordered tutorial steps, compact workflow cards, native FAQ disclosures, and a useful footer. At narrow widths, stack sections and keep code within scrollable containers. Use local assets and system fonts.

## Source review scope

Reviewed the extension README and package contributions; source ingestion and root selection; setup survey and plan; provider configuration and secrets; blueprint/model pipeline and theorem review; program/interface layout; proof orchestration and completion; status/checkpoints; sidebar regions; chat/change workflows; batch and existing-Lean flows; handoff and donation design notes; and the documentation inventory to distinguish implemented behavior from proposals.

The source snapshot is local `../formalize-everything`, version 0.2.15, HEAD `550ebbe`; local uncommitted changes may also be present. This is a review of the design and user-facing flows, not an execution of a paid formalization.

## Editorial review of the first draft

The first pass was too close to a feature list. These are the corrections required before implementation:

- **Connection is not just an API key.** Distinguish planning/review providers from the Claude Code or Codex CLI that edits and builds the project. An API connection alone should not be presented as sufficient for the complete agent workflow. Subscription use depends on the signed-in CLI and its provider allowance; API usage is billed by the provider. Avoid fixed prices and model recommendations.
- **A compiling project can still contain `sorry`.** Explain the selected theorem's current axiom profile, outstanding goals, explicit assumptions, and handoff findings. “Build passed” and “AI says done” are insufficient completion evidence.
- **No promise of paper correctness.** Lean checks the proposition encoded in Lean. The user must inspect quantifiers, inputs, hypotheses, algorithm semantics, probability statements, and resource definitions against the original paper.
- **Historical design is not current behavior.** Do not document retired `#driverSeal` or `Meta/Permissions.lean`. Current `Meta/` names come from `src/lean/layout.ts`. Do not claim the proposed overlapping multi-theorem scheduler is wired.
- **Platform guidance must follow the implementation.** Older setup notes describe Windows refusal. The current setup plan and machine detection support Windows-shaped toolchains; published instructions include PowerShell. Avoid copying the old refusal into the FAQ.
- **Review is on the written theorem.** Do not say users must approve every restatement/planning pass. The default theorem checkpoint asks them to inspect actual Lean files. Optional pass review is configurable.
- **Follow the actual Pause handler.** `RunControl.pause()` is a lower-level boundary signal, but the current sidebar calls `pauseRunNow()`, which cancels active processes and records paused state. Teach the visible Pause → cleanup → Resume workflow, not the older boundary-wait behavior.
- **Prior work is conditional.** A sorry-free theorem may still assume borrowed results through `Prior`. Inspect the fields and their citations; never describe this as an unconditional verification of every cited result.
- **PDF is a fallback.** Require `pdftotext` or `mutool`; recommend LaTeX, and explain loss of mathematical structure rather than making PDF the main flow.
- **Illustrations need truthful captions.** The website's diagram is a conceptual example, not a captured extension UI, working embedded prover, or measured successful run.
- **Distribution and source are different.** Link installation/support to the public release repository and Marketplace. Do not send new users to the private extension source repository.
- **Donation is optional.** It proposes material to `arlib-community` through a review workflow; it is not automatic inclusion in curated arlib.

## Revised publication specification

The final page follows this reader journey:

1. **Overview.** “From a paper to a Lean proof.” State the algorithm-paper focus, selected-result scope, AI assistance, Lean 4, Mathlib, and arlib. Two actions: install the extension and read the tutorial.
2. **Before you begin.** VS Code ≥1.90, Git, paper source, network access and space for Lean libraries, and a signed-in Claude Code or Codex CLI for coding-agent work. Explain API providers separately. Avoid claims about a precise setup duration, disk requirement, proof runtime, or guaranteed success.
3. **Install and open.** Marketplace first; release VSIX fallback. Open the entire paper folder, not just a single TeX buffer; run `Tex2Lean: Open in Side bar`.
4. **Connect and set up.** Choose Connect, select the intended connection, and run Set Up. Follow the setup survey and readiness result. Libraries are reused where possible; toolchain-specific setup can be needed again. Setup failures should be addressed before starting paid proof work.
5. **Scan and choose.** Scan LaTeX sources, check the root paper, inspect the source link, choose one result with Formalize. Mention source selection's context menu and Formalize several… after the first-run path.
6. **Review the statement.** Open `Model/Theorem.lean` and the relevant `Model/` definitions/program. Compare inputs, assumptions, conclusions, probability, and cost claims. Accept the review card when it matches. Otherwise edit the Lean file and Resume, or use `/change` in chat. Do not provide a synthetic paper that purports to prove an algorithm's full correctness.
7. **Prove and steer.** Describe the Planning, Interface, and Proof milestones as conceptual stages. Interfaces are generated when needed; proof dispatch waits for the required bridge. Explain progress and long-running work, questions, the visible Pause/Resume control, cleanup before editing, and checked changes after pausing.
8. **Read the result.** Inspect the selected theorem's current Lean check, `sorryAx`, standard Lean axioms versus additional axioms, explicit Prior hypotheses, and the handoff findings. Separate machine verification from semantic review.
9. **Go further.** Existing saved `Model/` theorem/lemma statements with `sorry` → Prove; multi-result selection; GUI view of the formalization; mechanical checks and CI export; optional community donation. Keep exact command names in an expandable/reference area rather than the hero.
10. **FAQ and help.** Lean experience, PDF, provider/CLI distinction, privacy/SecretStorage, time/cost, pause/cancel, assumptions, existing Lean projects, setup failure, and reporting an issue. Give the public issue tracker, extension log command, version information, and contact address.

## Evidence map and maintenance

Paths below are relative to the reviewed extension, not this website. Read implementation before treating an older design proposal as product behavior.

| Topic | Implementation inspected | Design/readme context | Website consequence |
| --- | --- | --- | --- |
| Installation and commands | `package.json`, `src/extension.ts` | `README.md`, `docs/installing-the-tool.md` | Exact sidebar command; stable Marketplace/release links |
| Paper scan and context | `src/ingest/latex/project.ts`, `rootRank.ts`, `environments.ts`, `src/flows/scan.ts` | `docs/reading-the-right-paper.md` | Folder, root, source navigation, selection fallback |
| Setup and platforms | `src/setup/{machine,survey,plan,preflight}.ts`, `src/flows/setup.ts` | `docs/{setup-machine,setting-up-a-machine}.md` | Git prerequisite; survey; reuse; no outdated Windows refusal |
| Connection and credentials | `src/llm/index.ts`, `src/secrets.ts`, `src/agents/runner.ts`, `src/config.ts` | `README.md`, `docs/more-providers.md` | Distinguish pass providers from coding CLI; SecretStorage |
| Planning and review | `src/model/{pipeline,surfacePolicy,denotationReview}.ts`, `src/flows/statementCard.ts`, `src/model/early.ts` | `docs/{the-four-folders,what-the-author-is-shown}.md` | Inspect actual Lean contract; do not promise automatic fidelity |
| Program/interface/proof | `src/phases.ts`, `src/steps.ts`, `src/interface/`, `src/analysis/`, `src/lean/layout.ts` | `docs/{the-shape-of-a-run,the-bridge-that-was-never-built}.md` | Three milestones, four folders; interface only where needed |
| Proof completion | `src/run/completionGate.ts`, `src/lean/{axioms,axiomOutput,proofFacts}.ts` | `docs/{reliable-kernel-probe,persisting-kernel-completion}.md` | Build alone is insufficient; fresh axiom evidence |
| Prior work | `src/model/priorSurface.ts`, `src/lean/assumptions.ts`, `src/flows/assumptions.ts` | `docs/{prior-work-architecture,prior-work-in-the-list}.md` | Explicit conditional assumptions, separate from paper results |
| Controls and recovery | `src/run/{control,resumeContract,checkpoint}.ts`, `src/flows/checkpoints.ts`, `media/sidebar.js` | `docs/{resume-to-completion,stopping-a-run}.md` | Sidebar Pause stops active work and records resumable state; generated files are kept |
| Chat and changes | `src/session/session.ts`, `src/flows/change.ts`, `src/chat/{answer,runChange}.ts` | `README.md`, `docs/{editing-the-formalization-in-the-chat,chat-development-insight}.md` | Read-only questions, pause before editing, checked changes |
| Multiple and Lean targets | `src/flows/{batch,leanTargets}.ts`, `src/lean/modelTargets.ts` | `docs/{several-statements-at-once,surface-the-batch-before-proving}.md` | Shared statement surface first; direct Lean Prove path |
| Visible state | `src/ui/regions.ts`, `media/sidebar.js`, `src/status/`, `src/flows/topControl.ts` | `docs/{what-the-author-cannot-miss,theorem-status-database}.md` | Explain pinned controls, questions, findings, and theorem-local Resume |
| Audits and sharing | `src/handoff/{mechanical,pipeline}.ts`, `src/flows/{handoff,donate,donateProject}.ts` | `docs/{donating-to-arlib-community,donating-whole-lean-projects}.md` | Build, axiom/closure/bridge checks, semantic handoff, optional reviewed donation |
| Terminal alternative | `src/cli/args.ts`, `src/cli/commands.ts` | `README.md`, `docs/the-tool-without-the-editor.md` | Label experimental; link release instructions; `tex2lean --help` |

Refresh this map and the public copy when extension labels, provider requirements, review behavior, or completion policy change. The website deliberately avoids a hardcoded “latest version” or preferred model.

## Implementation and acceptance

- Plain HTML/CSS and a small progressive-enhancement script; no runtime dependencies, external fonts, trackers, or signup.
- Root entry point with relative asset links; works at `/tex2lean-web/` and locally.
- All tutorial steps and FAQs readable without JavaScript. JS supplies the mobile navigation control and the active section indicator.
- Semantic landmarks, skip link, heading order, keyboard focus, accessible disclosure controls, readable contrast, reduced-motion support, and minimum comfortable touch targets.
- Review desktop and mobile browser screenshots, navigation, keyboard interactions, FAQ expansion, section links, asset responses, and overflow at 320–1440px.
- A dependency-free build copies only public files to `_site/`; documentation and repository metadata are excluded from the deploy artifact.
- GitHub Actions validates the site and deploys through GitHub Pages on main. Repository Pages must use the Actions source. Keep repository visibility as configured.

## Revision outcome

This second version replaces the draft feature list with an actionable first-result tutorial and an evidence map. The review corrected provider prerequisites, completion claims, historical platform guidance, review timing, and conditional prior-work claims before site design began. A final implementation review must confirm that the shipped HTML follows these constraints.

## Final implementation review

The page implements all six tutorial steps, the three conceptual milestones, four-folder explanation, proof/meaning distinction, current axiom evidence, conditional Prior hypotheses, direct Lean targets, multi-result selection, project-aware chat, optional donation, and ten practical FAQs. Twelve command references were checked against the current extension contribution manifest. The current sidebar's immediate Pause handler was verified in `src/run/slot.ts`, correcting the older lower-level boundary-pause description.

Visual review covered desktop and mobile screenshots. Browser interaction checks covered widths 320, 375, 600, 768, 900, 1024, and 1440px, menu state and Escape focus, section anchors, FAQ keyboard activation and deep links, no-JavaScript fallback, and local asset responses. The contrast audit initially found a low-contrast schematic code comment; the comment color was darkened and the code font sizing corrected before publication.

GitHub Pages was enabled using the workflow source while preserving the repository's private visibility. Its public deployment contains only the tutorial and local assets.

## Charged time-complexity explanation

The home page's structure section explains Model, Interface, and Analysis
around the same modeled program. The detailed Charged explanation appears
inside the “What does ‘proved’ mean?” section alongside the result checklist. The operation tally
is carried by `Charged`; composition adds tallies, bounded iteration accumulates
them, and a declared `Rate` translates the tally into work. A time proof bounds
this measured quantity. For randomized programs, the expectation is over the
charged run distribution.

Primary implementation evidence:

- `esa22-copy/lean/.lake/packages/arlib/Arlib/Computation/Charged.lean`:
  private constructor, `bind`, `foldl`, `cost`, `steps`, and `steps_bind`.
  `Charged` is paired with sealed carrier operations and program checks to
  prevent expensive work from being hidden in free expressions.
- `formalize-everything/src/model/surfacePolicy.ts`: admitted program grammar,
  `Model/Operations.lean` cost currency, and `#programSeal` requirements.
- `esa22-copy/lean/Esa22Copy/Model/Operations.lean` and `Model/Program.lean`:
  roster updates, paid tests, charged scan visits, loop, and output operations.
- `esa22-copy/lean/Esa22Copy/Interface/ProgramModel.lean`: proved connection
  between the program and its mathematical pseudocode representation.
- `esa22-copy/lean/Esa22Copy/Model/Theorem.lean`: expected-work claim over the
  charged tally, under an explicit dictionary work contract.

Copy distinguishes automatic composition of charges from the modeling choices
that specify primitives and rates. It does not equate abstract charged steps
with measured wall-clock runtime or claim `Charged` alone accounts for arbitrary
Lean computation. No separate hand-written cost total is used in the example.


## Plain documentation style

Reviewed both public pages for promotional headings and unnecessary decoration.
The illustrated tutorial is titled “Using Tex2Lean, step by step.” Main-page
headings name the content: user guide, getting started, formalization structure,
statement and proof review, time complexity with Charged, extension features,
and frequently asked questions. Removed ornamental icons, mock window dots,
placeholder paper lines, display italics, and the tilted example panel.
Typography is smaller, backgrounds are neutral, and the mockup callouts use
subdued blue outlines. Numbered steps and control markers remain because they
identify the instructions and buttons. The actual extension PNGs are unchanged.


## CLI walkthrough revision (October 28, 2026)

The CLI tutorial now follows a single interactive first-result journey in nine
numbered steps: install, open the paper folder, connect, set up Lean, scan and
choose a result, formalize, review the written statement, follow/pause/resume,
and inspect proof evidence. Each step gives an action and an expected next
state. Shell commands and Tex2Lean input are labeled separately; `t1` is an
explicit placeholder, and no successful proof transcript is fabricated.

Command names and behavior were checked against the local extension's
`src/cli/{commands,prompt,interactive,screen,menu,main}.ts`,
`src/flows/{statementReview,statementCard,app}.ts`, `src/status/report.ts`,
`src/model/early.ts`, and its README. Public installation and inspection commands
were cross-checked with the release repository README. The local implementation
uses `formalize` for preparation, review, and proving; the release README's
older separate `plan`/`prove` sequence is not used for the main walkthrough.
Autonomy and batch work follow the manual first-run path. This review did not
execute a paid model run or establish that an example paper was proved.


## Site presentation review (October 28, 2026)

Reviewed all three public pages and all nine tutorial images. Removed the
homepage's synthetic paper-to-Lean theorem graphic, decorative selector icons
and arrows, checklist ticks, and AI-focused introductory and sharing copy.
The homepage uses a single text column, and tutorial choices use plain labels
with restrained borders. Provider names, actual interface labels, numbered
instructions, the established book logo, and the extension interface images
remain because they identify the product and explain its operation.
