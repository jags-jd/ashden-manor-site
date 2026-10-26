# The MatchMaker: pricing test scenarios

Use these to check the price tool by hand on the live or preview site. Each scenario lists what to choose and what the card should show. Every total was worked out by hand from the client's prices (2026-10-27). The unit tests in `tests/estimate.test.ts` cover the same rules.

## The rules being tested

| Item | Price |
|---|---|
| Venue hire, Nov–Mar | Mon–Thu £4,500 · Fri/Sun £6,000 · Sat £8,000 |
| Venue hire, Apr/May/Oct | Mon–Thu £5,500 · Fri/Sun £7,500 · Sat £10,000 |
| Venue hire, Jun–Sep | Mon–Thu £6,500 · Fri/Sun £9,000 · Sat £12,000 |
| Guests included in venue hire | 50 |
| Each extra day guest | £95 |
| Each evening guest | £45 |
| Ceremony in the gardens | £750 |
| Dressing room the night before | £400 |
| Guest limit | Day + evening together: 100 at most |

Totals are exact. No rounding.

## How to run a scenario

1. Reload the page so you start from the defaults: June to September, Saturday, 50 day guests, 0 evening guests, no extras (£12,000).
2. Make the choices listed in the scenario.
3. Click outside any number box you typed into, so the number settles.
4. Check the total and the breakdown lines. On phones, also check the bar at the bottom of the screen.

## A. Venue hire only (50 day guests, 0 evening guests, no extras)

The card should show a single "Venue hire" line, and the total should equal it.

| # | Season | Day | Expected total |
|---|---|---|---|
| A1 | November to March | Monday to Thursday | £4,500 |
| A2 | November to March | Friday or Sunday | £6,000 |
| A3 | November to March | Saturday | £8,000 |
| A4 | April, May or October | Monday to Thursday | £5,500 |
| A5 | April, May or October | Friday or Sunday | £7,500 |
| A6 | April, May or October | Saturday | £10,000 |
| A7 | June to September | Monday to Thursday | £6,500 |
| A8 | June to September | Friday or Sunday | £9,000 |
| A9 | June to September | Saturday | £12,000 |

## B. One thing at a time

| # | Choices | Breakdown should show | Expected total |
|---|---|---|---|
| B1 | Apr/May/Oct, Mon–Thu, **51** day guests | Additional day guests: 1 × £95 = £95 | £5,595 |
| B2 | Nov–Mar, Fri/Sun, **75** day guests | Additional day guests: 25 × £95 = £2,375 | £8,375 |
| B3 | Jun–Sep, Sat, **100** day guests | Additional day guests: 50 × £95 = £4,750 | £16,750 |
| B4 | Nov–Mar, Fri/Sun, 50 day, **20 evening** | Evening guests: 20 × £45 = £900 | £6,900 |
| B5 | Apr/May/Oct, Sat, 50 day, **50 evening** | Evening guests: 50 × £45 = £2,250 | £12,250 |
| B6 | Jun–Sep, Mon–Thu, **garden ceremony** | Ceremony in the gardens: £750 | £7,250 |
| B7 | Jun–Sep, Mon–Thu, **dressing room** | Dressing room the night before: £400 | £6,900 |

## C. Full weddings

| # | Choices | Sum | Expected total |
|---|---|---|---|
| C1 | Jun–Sep, Sat, 80 day, 20 evening, both extras | 12,000 + 2,850 + 900 + 750 + 400 | **£16,900** |
| C2 | Apr/May/Oct, Fri/Sun, 60 day, 40 evening, garden ceremony | 7,500 + 950 + 1,800 + 750 | **£11,000** |
| C3 | Nov–Mar, Mon–Thu, 50 day, 0 evening, dressing room | 4,500 + 400 | **£4,900** |
| C4 | Highest possible: Jun–Sep, Sat, 100 day, 0 evening, both extras | 12,000 + 4,750 + 750 + 400 | **£17,900** |
| C5 | Lowest possible: Nov–Mar, Mon–Thu, 50 day, nothing else | 4,500 | **£4,500** |

## D. Limits and edge cases

| # | What to do | What should happen |
|---|---|---|
| D1 | Type 49 day guests, then click away | Box snaps to 50. No "Additional day guests" line. |
| D2 | Type 120 day guests, then click away | Box snaps to 100. Line shows 50 × £95. Evening guests go to 0. |
| D3 | Clear the day guests box, then click away | Box goes back to 50. |
| D4 | Set 80 day guests, then type 30 evening guests and click away | Evening snaps to 20. The note says "No evening places left." |
| D5 | Set 80 day guests, then press + on evening guests repeatedly | It stops at 20. |
| D6 | Jun–Sep, Sat. Set 70 day and 30 evening (£15,250), then raise day guests to 85 | Evening drops to 15 by itself. Total is 12,000 + 3,325 + 675 = **£16,000**. |
| D7 | Set 100 day guests | Evening is 0, and the note says "No evening places left." |
| D8 | Set 60 day guests, 0 evening | The note says "40 evening places left." |
| D9 | Turn an extra on, then off again | Its line disappears and the total drops by £750 or £400. |
| D10 | Press Enter inside a guest number box | The number settles. Nothing is sent and the popup doesn't open. |

## E. The total carries through to the enquiry

| # | What to do | What should happen |
|---|---|---|
| E1 | Set up C1 (£16,900), then click "Enquire now" | The popup shows "Your estimate £16,900". |
| E2 | Send the enquiry with a name and email | The thank-you message says "your estimate of £16,900". |
| E3 | Close the popup, change a choice, then open it again | The popup shows the new total. |
| E4 | On a phone, scroll through steps 01–04 | The bar at the bottom always matches the card's total. |

## F. Labels

| # | Check |
|---|---|
| F1 | The venue hire line names the season and day you chose, e.g. "April, May or October, Friday or Sunday. Includes 50 guests". |
| F2 | Season buttons show months only. "Peak", "shoulder" or "off-peak" appear nowhere on the page. |
| F3 | All amounts are in pounds with commas and no pence, e.g. £16,900. |
