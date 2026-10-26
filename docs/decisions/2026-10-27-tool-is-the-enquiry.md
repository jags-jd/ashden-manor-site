# The price tool is the enquiry form

**Date:** 2026-10-27
**Status:** Accepted (Jan)

## Context

The page had a price estimator and, separately, an enquiry form that the estimator prefilled through the URL. The client wants every estimate to become a lead: the tool should end by asking for a name and email, with an itemised total that updates as answers change.

## Decision

- Merge the two into one `<form>` in `src/components/Estimate.astro`, with five numbered steps on one screen: season, day, guests, extras, then names and email.
- Remove the separate Enquire section (`Enquire.astro`), the preferred-date field and the URL hand-off between the two.
- Collect names and email only. The lead (`LeadData`) carries every choice and the total.
- Label seasons by months only; "peak", "shoulder" and "off-peak" no longer appear on the page.
- On desktop the result card is sticky beside the steps; on phones a sticky bar mirrors the total. The section is no longer pinned by the scroll motion, because sticky positioning doesn't work inside a pin.
- `submitEnquiry()` stays the single seam for a real handler. Phase 1 still sends, logs and stores nothing.

## Consequences

- Links that used to point at the Enquire section (footer, food CTA, menu) now point at `#enquire`, step 05 of the tool. A content test guards this.
- Couples can no longer leave a phone number, date or message. If the client wants those back, add them to step 05 and to `LeadData`.
- Until a real handler is wired (Open Question 11), the site's only enquiry route sends nothing.
