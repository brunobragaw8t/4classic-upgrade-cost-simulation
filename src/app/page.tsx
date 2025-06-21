"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      ? parseFloat((value / simulations.length).toFixed(0))
      : 0;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Upgrade Simulation to +20
        </h1>
        <Button
          size="lg"
          onClick={() => {
            for (let i = 0; i < 1000; i++) {
              handleRun();
            }
          }}
          className="px-8 py-3"
        >
          RUN 1000 SIMULATIONS
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Average Items Used
              <Badge variant="secondary">Per Simulation</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Survival Tincture</span>
              <Badge variant="outline">
                {calcAvg(totals.itemsUsed.survivalTincture)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Serendipity Potion</span>
              <Badge variant="outline">
                {calcAvg(totals.itemsUsed.serendipityPotion)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Master&apos;s Formula</span>
              <Badge variant="outline">
                {calcAvg(totals.itemsUsed.mastersFormula)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Scroll of Reflection</span>
              <Badge variant="outline">
                {calcAvg(totals.itemsUsed.scrollOfReflection)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Average Costs per Item
              <Badge variant="secondary">Silver</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Survival Tincture</span>
              <Badge variant="outline">
                {calcAvg(totals.costs.survivalTincture).toLocaleString()}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Serendipity Potion</span>
              <Badge variant="outline">
                {calcAvg(totals.costs.serendipityPotion).toLocaleString()}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Master&apos;s Formula</span>
              <Badge variant="outline">
                {calcAvg(totals.costs.mastersFormula).toLocaleString()}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Scroll of Reflection</span>
              <Badge variant="outline">
                {calcAvg(totals.costs.scrollOfReflection).toLocaleString()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Average Blacksmith tax Costs
              <Badge variant="secondary">Silver</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Blacksmith tax</span>
              <Badge variant="outline">
                {calcAvg(totals.upgradeCost).toLocaleString()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 text-center">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              Average Final Cost
              <Badge variant="secondary">Silver</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {calcAvg(totals.sumOfCosts).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
