# 2026-10-27: The estimator moves to the client's real prices

## Context

The client sent their prices and rules. Guests are no longer fixed at 100. Venue hire includes 50 guests, extra day guests cost £95 each up to 100, and there are three paid extras: evening guests from 8pm at £45 each, a ceremony in the gardens at £750, and the dressing room the night before at £400. May moves from peak to shoulder.

## Decisions

- **Real prices.** `IS_PLACEHOLDER = false`, so there's no "Illustrative figures" note. "A guide, not a quote" stays.
- **Exact totals.** Totals are exact rather than rounded to £250. Every line is a real price, so rounding would only blur them.
- **Choices.** `estimate(choices)` takes season, day, day guests, evening guests and the two extras. It keeps guest numbers within range (`clampCount`) and returns line items and a total. Every figure lives in `pricing.ts`, and a content test stops guest numbers and prices from being typed into the copy.
- **Wording.** "Up to 100 guests" everywhere (Jan). "Why 100" keeps its argument as a ceiling.
- **Evening guest cap.** Evening guests are capped at 100 in the tool until the client confirms the real limit (Open Question 12).
- **Hand-off.** It carries every choice to the enquiry form (`choicesToSearch` / `choicesFromSearch`). The form gains optional guest numbers and the two extras, prefilled.
- **Default.** Peak Saturday with the 50 included guests, so the first figure shown is the plain venue hire.

## Consequences

- The estimator section is taller. On desktop the result card stays in view beside the choices at 1280×720 and up. On phones, the summary line under the choices repeats the total.
- Copy and FAQ answers built from the constants update automatically if prices change.

**Update (2026-10-27, Jan):** day and evening guests together come to no more than 100. Evening guests fill whatever the day guests leave (`eveningGuestLimit()`), replacing the provisional separate cap of 100 evening guests.
