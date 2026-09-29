# HospitalX Developer Guide

Welcome to the Bit N Build 2026 engineering guide for HospitalX—the practical companion to the product and architecture documents in [`ZRO/`](../ZRO/README.md).

If you are here because the landing page made you curious, excellent. If you are here five minutes before a demo with one eyebrow raised, also excellent—we planned for that energy. This guide answers the useful questions: where does the work live, how do you run it, and what must stay true while you change it?

## Start here

- [Bit N Build 2026 submission guide](BIT-N-BUILD-2026.md) — reviewer path, proof points, and demo scope.
- [Zero-to-Release documentation](../ZRO/README.md) — product and architecture decisions.
- [Root README](../README.md) — product overview and quick start.

## Working agreement

Before adding the next clever feature, ask: **does it make the care journey clearer, safer, or more recoverable?** If the answer is no, it may be clever—but it probably does not belong here.

- Keep user-facing operational data scoped to the authenticated organization and facility.
- Treat every clinically or financially material write as an auditable command.
- Make offline state and freshness visible; never quietly overwrite a conflict.
- Keep AI assistive and reviewable. It may prepare or summarize work, never assume clinical authority.
- Preserve the calm interface: use motion to orient people, not to distract them.

## Project map

```text
app/                         Routes, pages, API endpoints, app-level UI
components/interfrozt/       Public landing experience and product storytelling
components/system/           Client recovery and internal loading behavior
components/offline/          Service worker and offline integration surfaces
lib/                         Domain helpers, policies, validation, sync, demo data
db/                          Drizzle schema, migrations, SQL baseline
public/                      Static product assets, media, fonts, app manifest
styles/                      Shared visual system and responsive rules
ZRO/                         Product, architecture, safety, and delivery documentation
```

## Local development

Ready to make it move? The shortest route is:

```bash
npm install
npm run dev
```

For persistence, add `DATABASE_URL` to `.env.local`; run `npm run migrate` and `npm run seed` where appropriate. Without a database URL, the landing experience and demo-oriented UI can still be explored. That is intentionally useful for a demo—but a production server must fail clearly rather than invent live data. Fake confidence is still a bug.

## Quality gate

Before calling it “done,” give it the small amount of skepticism a hospital system deserves:

Before opening a release candidate:

```bash
npm test
npm run build
```

Also manually verify the landing loader, keyboard navigation, reduced-motion behavior, narrow viewport navigation, the offline/online transition, and a fresh production deployment. A green build is lovely; it is not a substitute for looking at the thing.

## Operational readiness

See the [current implementation register](../ZRO/10-current-implementation.md) for the explicit pilot blockers. A visually complete page is not evidence of clinical readiness—beautiful is not the same as safe.
