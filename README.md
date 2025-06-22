# 4Classic Upgrade Cost Simulation

I made this to simulate how much it would cost to upgrade an item by myself, in
order to compare it to buying an item already upgraded.

## How it works

The script starts the simulation as if your item was already at +11.

Then, based on 4Classic upgrading rates, it simulates upgrading attempts until
it reaches your target level, following these rules:

- You can choose what to do in each level (+11 to +23): use scroll of reflection
or attempt an upgrade consuming one of the serendipity potions (100, 150, 200 or
300).
- For every attempt, it consumes a Master's Formula.
- For every failed attempt, it consumes a Survival Tincture.

You will input the cost of each upgrading material, to reflect the current state
of the market.
