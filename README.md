# 4Classic Upgrade Cost Simulation

I made this to simulate how much it would cost to upgrade an item by myself, in
order to compare it to buying an item already upgraded.

## How it works

The script starts the simulation as if your item was already at +11.

Then, based on 4Classic upgrading rates, it simulates upgrading attempts until
it reaches your target level, following these rules:

- Whenever the item reaches +12, +14, +16, +18, +20 or +22, a Scroll of Reflection
is used.
- For every attempt, it counts a Serendipity Potion and a Master's Formula.
- For every failed attempt, it counts a Survival Tincture.

You will input the cost of each upgrading material, to reflect the current state
of the market.
