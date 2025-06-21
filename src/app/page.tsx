"use client";

import { COSTS } from "@/constants/costs.constant";
import { ITEM_COSTS } from "@/constants/item-costs.constant";
import { RATES } from "@/constants/rates.contanst";
import { getRandomNumber } from "@/utils/get-random-number";
import { useState } from "react";

type SimulationResult = {
  itemsUsed: {
    survivalTincture: number;
    serendipityPotion: number;
    mastersFormula: number;
    scrollOfReflection: number;
  };
  costs: {
    survivalTincture: number;
    serendipityPotion: number;
    mastersFormula: number;
    scrollOfReflection: number;
  };
  upgradeCost: number;
  sumOfCosts: number;
  finalLevel: number;
};

export default function Home() {
  const [simulations, setSimulations] = useState<SimulationResult[]>([]);

  function runSimulation() {
    let currentLevel: keyof typeof RATES = 11;

    const itemsUsed = {
      survivalTincture: 1,
      serendipityPotion: 0,
      mastersFormula: 0,
      scrollOfReflection: 0,
    };

    let upgradeCost = 0;

    while (currentLevel < 20) {
      if ([12, 14, 16, 18].includes(currentLevel)) {
        itemsUsed.scrollOfReflection += 1;
        currentLevel -= 1;
      }

      itemsUsed.serendipityPotion += 1;
      itemsUsed.mastersFormula += 1;
      upgradeCost += COSTS[currentLevel as keyof typeof COSTS];

      const successRate = RATES[currentLevel as keyof typeof RATES];

      const success = Math.random() < successRate;

      if (success) {
        currentLevel += getRandomNumber([1, 2, 3]);
      } else {
        currentLevel -= getRandomNumber([0, 1, 2]);
        if (currentLevel < 11) currentLevel = 11;
        itemsUsed.survivalTincture += 1;
      }
    }

    return {
      itemsUsed,
      costs: {
        survivalTincture:
          itemsUsed.survivalTincture * ITEM_COSTS.survivalTincture,
        serendipityPotion:
          itemsUsed.serendipityPotion * ITEM_COSTS.serendipityPotion,
        mastersFormula: itemsUsed.mastersFormula * ITEM_COSTS.mastersFormula,
        scrollOfReflection:
          itemsUsed.scrollOfReflection * ITEM_COSTS.scrollOfReflection,
      },
      upgradeCost,
      sumOfCosts:
        itemsUsed.survivalTincture * ITEM_COSTS.survivalTincture +
        itemsUsed.serendipityPotion * ITEM_COSTS.serendipityPotion +
        itemsUsed.mastersFormula * ITEM_COSTS.mastersFormula +
        itemsUsed.scrollOfReflection * ITEM_COSTS.scrollOfReflection +
        upgradeCost,
      finalLevel: currentLevel,
    };
  }

  function handleRun() {
    const result = runSimulation();
    // console.log("Simulation Result:", result);
    setSimulations((prev) => [...prev, result]);
  }

  const totals = simulations.reduce(
    (acc, sim) => {
      acc.itemsUsed.survivalTincture += sim.itemsUsed.survivalTincture;
      acc.itemsUsed.serendipityPotion += sim.itemsUsed.serendipityPotion;
      acc.itemsUsed.mastersFormula += sim.itemsUsed.mastersFormula;
      acc.itemsUsed.scrollOfReflection += sim.itemsUsed.scrollOfReflection;

      acc.costs.survivalTincture += sim.costs.survivalTincture;
      acc.costs.serendipityPotion += sim.costs.serendipityPotion;
      acc.costs.mastersFormula += sim.costs.mastersFormula;
      acc.costs.scrollOfReflection += sim.costs.scrollOfReflection;

      acc.upgradeCost += sim.upgradeCost;
      acc.sumOfCosts += sim.sumOfCosts;
      acc.finalLevel = Math.max(acc.finalLevel, sim.finalLevel);

      return acc;
    },
    {
      itemsUsed: {
        survivalTincture: 0,
        serendipityPotion: 0,
        mastersFormula: 0,
        scrollOfReflection: 0,
      },
      costs: {
        survivalTincture: 0,
        serendipityPotion: 0,
        mastersFormula: 0,
        scrollOfReflection: 0,
      },
      upgradeCost: 0,
      sumOfCosts: 0,
      finalLevel: 11,
    },
  );

  function calcAvg(value: number): number {
    return simulations.length > 0
      ? parseFloat((value / simulations.length).toFixed(2))
      : 0;
  }

  return (
    <div>
      <h1>Upgrade Simulation</h1>

      <button
        type="button"
        onClick={() => {
          for (let i = 0; i < 1000; i++) {
            handleRun();
          }
        }}
      >
        RUN 1000 SIMULATIONS
      </button>

      <h2>Average items used</h2>

      <ul>
        <li>Survival Tincture: {calcAvg(totals.itemsUsed.survivalTincture)}</li>
        <li>
          Serendipity Potion: {calcAvg(totals.itemsUsed.serendipityPotion)}
        </li>
        <li>
          Master&apos;s Formula: {calcAvg(totals.itemsUsed.mastersFormula)}
        </li>
        <li>
          Scroll of Reflection: {calcAvg(totals.itemsUsed.scrollOfReflection)}
        </li>
      </ul>

      <h2>Average costs per item</h2>

      <ul>
        <li>
          Survival Tincture:{" "}
          {calcAvg(totals.costs.survivalTincture).toLocaleString()}
        </li>
        <li>
          Serendipity Potion:{" "}
          {calcAvg(totals.costs.serendipityPotion).toLocaleString()}
        </li>
        <li>
          Master&apos;s Formula:{" "}
          {calcAvg(totals.costs.mastersFormula).toLocaleString()}
        </li>
        <li>
          Scroll of Reflection:{" "}
          {calcAvg(totals.costs.scrollOfReflection).toLocaleString()}
        </li>
      </ul>

      <h2>Average upgrade cost</h2>

      <p>{calcAvg(totals.upgradeCost).toLocaleString()}</p>

      <h2>Average final cost</h2>

      <p>{calcAvg(totals.sumOfCosts).toLocaleString()}</p>
    </div>
  );
}
