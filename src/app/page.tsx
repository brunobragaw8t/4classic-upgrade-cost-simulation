"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COSTS } from "@/constants/costs.constant";
import { ITEM_LEVEL, RATES } from "@/constants/rates.contanst";
import { getRandomNumber } from "@/utils/get-random-number";
import { formatPrice } from "@/utils/number-format";
import { useState } from "react";

type Simulation = {
  itemsUsed: {
    survivalTincture: number;
    serendipityPotion: number;
    mastersFormula: number;
    scrollOfReflection: number;
  };
  blacksmithTax: number;
  finalLevel: ITEM_LEVEL;
};

export default function Home() {
  const [targetLevel, setTargetLevel] = useState(0);

  const [survivalTincturePrice, setSurvivalTincturePrice] = useState(0);
  const [serendipityPotionPrice, setSerendipityPotionPrice] = useState(0);
  const [mastersFormulaPrice, setMastersFormulaPrice] = useState(0);
  const [scrollOfReflectionPrice, setScrollOfReflectionPrice] = useState(0);

  const [simulations, setSimulations] = useState<Simulation[]>([]);

  function runSimulation(): Simulation {
    let currentLevel: ITEM_LEVEL = 11;

    const res: Simulation = {
      itemsUsed: {
        survivalTincture: 1,
        serendipityPotion: 0,
        mastersFormula: 0,
        scrollOfReflection: 0,
      },
      blacksmithTax: 0,
      finalLevel: currentLevel,
    };

    while (currentLevel < targetLevel) {
      if ([12, 14, 16, 18, 20, 22].includes(currentLevel)) {
        res.itemsUsed.scrollOfReflection += 1;
        currentLevel -= 1;
        continue;
      }

      res.itemsUsed.serendipityPotion += 1;
      res.itemsUsed.mastersFormula += 1;
      res.blacksmithTax += COSTS[currentLevel as ITEM_LEVEL];

      const successRate = RATES[currentLevel as ITEM_LEVEL];

      const success = Math.random() < successRate;

      if (success) {
        currentLevel += getRandomNumber([1, 2, 3]);
      } else {
        currentLevel -= getRandomNumber([0, 1, 2]);
        if (currentLevel < 11) currentLevel = 11; // Prevent going below +11
        res.itemsUsed.survivalTincture += 1;
      }
    }

    res.finalLevel = currentLevel as ITEM_LEVEL;

    return res;
  }

  function handleRuns(numOfRuns: number) {
    const result: Simulation[] = [];

    for (let i = 0; i < numOfRuns; i++) {
      result.push(runSimulation());
    }

    setSimulations((prev) => [...prev, ...result]);
  }

  function clearSimulations() {
    setSimulations([]);
  }

  const totalItemsUsed = simulations.reduce(
    (acc, sim) => {
      acc.survivalTincture += sim.itemsUsed.survivalTincture;
      acc.serendipityPotion += sim.itemsUsed.serendipityPotion;
      acc.mastersFormula += sim.itemsUsed.mastersFormula;
      acc.scrollOfReflection += sim.itemsUsed.scrollOfReflection;

      return acc;
    },
    {
      survivalTincture: 0,
      serendipityPotion: 0,
      mastersFormula: 0,
      scrollOfReflection: 0,
    }
  );

  const total = {
    survivalTincture: totalItemsUsed.survivalTincture * survivalTincturePrice,
    serendipityPotion:
      totalItemsUsed.serendipityPotion * serendipityPotionPrice,
    mastersFormula: totalItemsUsed.mastersFormula * mastersFormulaPrice,
    scrollOfReflection:
      totalItemsUsed.scrollOfReflection * scrollOfReflectionPrice,
    blacksmithTax: simulations.reduce((acc, i) => (acc += i.blacksmithTax), 0),
  };

  const sum = Object.values(total).reduce((acc, i) => (acc += i), 0);

  function calcAvg(value: number): number {
    if (simulations.length === 0) return 0;

    return Number((value / simulations.length).toFixed(0));
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between space-y-4">
        <h1 className="text-3xl font-bold tracking-tight mb-0">
          4Classic Upgrade Simulation
        </h1>

        <ModeToggle />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Target Level & Item Prices</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="targetLevel">Target Level</Label>

              <Input
                id="targetLevel"
                type="number"
                min="12"
                max="25"
                value={targetLevel}
                onChange={(e) => setTargetLevel(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="survivalTincture">Survival Tincture</Label>
                <Input
                  id="survivalTincture"
                  type="number"
                  min="0"
                  value={survivalTincturePrice}
                  onChange={(e) =>
                    setSurvivalTincturePrice(Number(e.target.value))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serendipityPotion">Serendipity Potion</Label>
                <Input
                  id="serendipityPotion"
                  type="number"
                  min="0"
                  value={serendipityPotionPrice}
                  onChange={(e) =>
                    setSerendipityPotionPrice(Number(e.target.value))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mastersFormula">Master's Formula</Label>
                <Input
                  id="mastersFormula"
                  type="number"
                  min="0"
                  value={mastersFormulaPrice}
                  onChange={(e) =>
                    setMastersFormulaPrice(Number(e.target.value))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scrollOfReflection">Scroll of Reflection</Label>
                <Input
                  id="scrollOfReflection"
                  type="number"
                  min="0"
                  value={scrollOfReflectionPrice}
                  onChange={(e) =>
                    setScrollOfReflectionPrice(Number(e.target.value))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Simulation Controls</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Current simulations:{" "}
                <Badge variant="secondary">{simulations.length}</Badge>
              </p>

              <p className="text-sm text-muted-foreground">
                Target level: <Badge variant="outline">+{targetLevel}</Badge>
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Run simulations:</p>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => handleRuns(1)} variant="outline">
                  1
                </Button>

                <Button onClick={() => handleRuns(10)} variant="outline">
                  10
                </Button>

                <Button onClick={() => handleRuns(100)} variant="outline">
                  100
                </Button>

                <Button onClick={() => handleRuns(1000)} variant="outline">
                  1000
                </Button>
              </div>
            </div>

            <Button
              onClick={clearSimulations}
              variant="destructive"
              className="w-full"
              disabled={simulations.length === 0}
            >
              Clear simulations
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Average items used</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Survival Tincture</span>
              <Badge variant="outline">
                {calcAvg(totalItemsUsed.survivalTincture)}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Serendipity Potion</span>
              <Badge variant="outline">
                {calcAvg(totalItemsUsed.serendipityPotion)}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Master&apos;s Formula</span>
              <Badge variant="outline">
                {calcAvg(totalItemsUsed.mastersFormula)}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Scroll of Reflection</span>
              <Badge variant="outline">
                {calcAvg(totalItemsUsed.scrollOfReflection)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average costs per item</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Survival Tincture</span>
              <Badge variant="outline">
                {formatPrice(calcAvg(total.survivalTincture))}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Serendipity Potion</span>
              <Badge variant="outline">
                {formatPrice(calcAvg(total.serendipityPotion))}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Master&apos;s Formula</span>
              <Badge variant="outline">
                {formatPrice(calcAvg(total.mastersFormula))}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Scroll of Reflection</span>
              <Badge variant="outline">
                {formatPrice(calcAvg(total.scrollOfReflection))}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Blacksmith tax</span>
              <Badge variant="outline">
                {formatPrice(calcAvg(total.blacksmithTax))}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 text-center">
        <Card className="gap-2">
          <CardHeader>
            <CardTitle>Average final cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {formatPrice(calcAvg(sum))}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Based on {simulations.length} simulation
              {simulations.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
