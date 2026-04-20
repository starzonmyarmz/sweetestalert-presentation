# Sweetest Alert: A <dialog> Migration Story

## Slide 1 — Intro (~30 sec)
> Hey everyone, I'm Dan, UX Engineer on Trust & Safety. Today I want to talk to you about killing off a dependency that has been making our lives harder — and how the modern web gave us a much better path forward.

## Slide 2 — "The Sweetest Alert" title (~15 sec)
> This is a `<dialog>` migration story — part technical, part strategic, and hopefully a little inspiring for your own legacy-dependency battles.

## Slide 3 — Sweet Alert Has Overstayed (~1:30)
> **Bloated** — It does toasts, it does input modals, animations, fancy graphics… in actuality, we use very little of what it offers.

> **Overrides** — We're inconsistent with what version of Sweet Alert we're using — currently 3 different major releases across our apps. That makes it hard for us to override it consistently.

> **Inconsistent UX** — We've extended Sweet Alert in ways that don't necessarily follow suit with the Tapestry design specs. This results in inconsistent experiences within and across our apps.

> **Outdated** — Written before `<dialog>` had real browser support — that's no longer the world we live in.

> **Ethics** — I don't love shipping that into any app, but especially a church management platform.

## Slide 4 — The Browser's Gift (~1:30)
> Here's what the web gives us for free now:

> **Focus trapping** — We used to have to hand-roll this or lean on libraries, but now the browser does it for us!

> **Keyboard support** — Escape-to-close, tab order — all native.

> **`::backdrop`** — No overlay div. No extra DOM. No finicky styles. Just a simple pseudo-element you can style.

> **Top-layer promotion** — Dialogs render above *everything*. It doesn't matter where in your markup you place a `<dialog>`. And no more `z-index` wars.

> Everything SweetAlert was bundling… hundreds of lines of JS and CSS to do — the browser just… does.

> And not only do these features make the user and developer experiences consistent, and easier to work with — they increase Accessibility support.

## Slide 5 — Sweetest Alert (~1:15)
> **Imperative utility, not a component** — This is an intentional choice. Internally it's built on React, but the API is a function call… because the vast majority of the time of our usage is "user clicks a thing, we need to confirm." That's imperative in nature, and pretending it's declarative just adds ceremony.

> **Built for PCO** — Tapestry tokens are baked in, and uses Tapestry components like Icons and Buttons. It has sensible defaults. It looks like Planning Center out of the box.

Walk through the code example…

> Look how simple this is.

## Slide 6 — By the Numbers (~45 sec)
> 24KB down to 3KB. 1,378 lines of CSS down to 64. This includes the sweetalert2 library, and our Planning Center overrides. It doesn't include extra set up that happens within our apps.

> That's an 8x reduction in JS and a 20x reduction in CSS. Small per user, but multiply by our traffic and it adds up quick.

## Slide 7 — The Strategy (~1:30)
> **The temptation** — I think most everyone's first instinct is to do a big rewrite, migration plan doc, and announce a deadline. We've all been there, and there's a time and place for that.

> **What we actually did** — My approach was to simplify the process as much as possible. What would an MVP look like? What if we just focused on one app (Accounts).

> **Inventory** — Grep for every SweetAlert call. Categorize by styles, and current functionality. Talk to UXD, and have a firm understanding of Tapestry specs. Know the scope before I touch anything.

> **Proof of concept in a low-traffic area** — Pick something boring. Something that if it breaks, nobody's Sunday gets ruined.

> **Convert 2–3 at a time, growing in complexity** — Start easy, build confidence, handle the gnarly cases last when you know the shape of the problem.

> **Expand features as each wave reveals needs** — Dog-fooding Sweetest Alert allowed me to build a practical replacement for Sweet Alert. Don't build for hypothetical use cases. Let the real migrations tell you what the API needs.

## Slide 8 — Packaging (~45 sec)
> Once Accounts was stable, I extracted it to an NPM package. Tests, docs, a demo site. All the stuff you want an NPM library to have.

> This is live — take a look after if you want to use it in your app.

## Slide 9 — Rails Support (~45 sec)
> We're not a React-only shop. Plenty of Rails-rendered views still need confirmation dialogs.

> **Stimulus controller** — Thin wrapper that wires a button click to SweetestAlert and submits the form on confirm.

> **ERB helper** — `data_for_sweetest_alert` generates the right data attributes. Drops right into our Rails views.

> So whether you're in a React app or an ERB template, same dialog, same behavior.

## Slide 10 — AI as Dev Partner (~45 sec)
> **Building** — Claude Code helped me scaffold the component and iterate on the API surface.

> **Docs & demos** — Generated the boilerplate I always put off writing.

> **Migration** — AI-assisted scripts to find-and-convert across Accounts, and clean up residual aftermath — huge time saver on the mechanical work.

> **Code review & tests** — Scaffolded tests, flagged edge cases I'd missed.

> I still reviewed everything. But it compressed weeks into days.

## Slide 11 — The Payoff (~30 sec)
> 0 Sweet Alert instances remaining… `yarn remove sweetalert2`.

> That command was deeply satisfying to run


