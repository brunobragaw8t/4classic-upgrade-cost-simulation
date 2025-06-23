"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BLACKSMITH_TAX } from "@/constants/blacksmith-tax.constant";
import { ITEM_LEVEL, ITEM_LEVELS, RATES } from "@/constants/rates.contanst";
import { getRandomNumber } from "@/utils/get-random-number";
import { formatPrice } from "@/utils/format-price";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Simulation = {
  itemsUsed: {
    survivalTincture: number;
    serendipityPotion100: number;
    serendipityPotion150: number;
    serendipityPotion200: number;
    serendipityPotion300: number;
    mastersFormula: number;
    scrollOfReflection: number;
  };
  blacksmithTax: number;
};

export default function Home() {
  const [targetLevel, setTargetLevel] = useState(20);

  const [survivalTincturePrice, setSurvivalTincturePrice] = useState(213);
  const [serendipityPotion100Price, setSerendipityPotion100Price] =
    useState(0.731);
  const [serendipityPotion150Price, setSerendipityPotion150Price] =
    useState(1687);
  const [serendipityPotion200Price, setSerendipityPotion200Price] =
    useState(17388);
  const [serendipityPotion300Price, setSerendipityPotion300Price] =
    useState(229333);
  const [mastersFormulaPrice, setMastersFormulaPrice] = useState(0.83);
  const [scrollOfReflectionPrice, setScrollOfReflectionPrice] = useState(20);

  const [actions, setActions] = useState<
    Record<ITEM_LEVEL, -1 | 2 | 2.5 | 3 | 4>
  >({
    11: 2,
    12: -1,
    13: 2,
    14: -1,
    15: 2,
    16: -1,
    17: 2,
    18: 2,
    19: 2,
    20: 2,
    21: 2,
    22: 2,
    23: 2,
  });

  function handleActionChange(level: ITEM_LEVEL, value: string) {
    const numericValue = parseFloat(value) as -1 | 2 | 2.5 | 3 | 4;

    setActions((prev) => ({
      ...prev,
      [level]: numericValue,
    }));
  }

  const [simulations, setSimulations] = useState<Simulation[]>([]);

  function runSimulation(): Simulation {
    let currentLevel: ITEM_LEVEL = 11;

    const res: Simulation = {
      itemsUsed: {
        survivalTincture: 1,
        serendipityPotion100: 0,
        serendipityPotion150: 0,
        serendipityPotion200: 0,
        serendipityPotion300: 0,
        mastersFormula: 0,
        scrollOfReflection: 0,
      },
      blacksmithTax: 0,
    };

    while (currentLevel < targetLevel) {
      // Ensure type-safety because of manipulating currentLevel
      currentLevel = currentLevel as ITEM_LEVEL;

      const action = actions[currentLevel];

      if (action === -1) {
        res.itemsUsed.scrollOfReflection += 1;
        currentLevel -= 1;
        continue;
      }

      res.itemsUsed.mastersFormula += 1;
      res.blacksmithTax += BLACKSMITH_TAX[currentLevel];

      const successRate = RATES[currentLevel] * action;

      switch (action) {
        case 2:
          res.itemsUsed.serendipityPotion100 += 1;
          break;

        case 2.5:
          res.itemsUsed.serendipityPotion150 += 1;
          break;

        case 3:
          res.itemsUsed.serendipityPotion200 += 1;
          break;

        case 4:
          res.itemsUsed.serendipityPotion300 += 1;
          break;
      }

      const success = Math.random() < successRate;

      if (success) {
        currentLevel += getRandomNumber([1, 2, 3]);
      } else {
        currentLevel -= getRandomNumber([0, 1, 2]);
        if (currentLevel < 11) currentLevel = 11; // Prevent going below +11
        res.itemsUsed.survivalTincture += 1;
      }
    }

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

  const totalItemsUsed = simulations.reduce<
    Record<keyof Simulation["itemsUsed"], number>
  >(
    (acc, sim) => {
      acc.survivalTincture += sim.itemsUsed.survivalTincture;
      acc.serendipityPotion100 += sim.itemsUsed.serendipityPotion100;
      acc.serendipityPotion150 += sim.itemsUsed.serendipityPotion150;
      acc.serendipityPotion200 += sim.itemsUsed.serendipityPotion200;
      acc.serendipityPotion300 += sim.itemsUsed.serendipityPotion300;
      acc.mastersFormula += sim.itemsUsed.mastersFormula;
      acc.scrollOfReflection += sim.itemsUsed.scrollOfReflection;

      return acc;
    },
    {
      survivalTincture: 0,
      serendipityPotion100: 0,
      serendipityPotion150: 0,
      serendipityPotion200: 0,
      serendipityPotion300: 0,
      mastersFormula: 0,
      scrollOfReflection: 0,
    },
  );

  const total = {
    survivalTincture: totalItemsUsed.survivalTincture * survivalTincturePrice,
    serendipityPotion100:
      totalItemsUsed.serendipityPotion100 * serendipityPotion100Price,
    serendipityPotion150:
      totalItemsUsed.serendipityPotion150 * serendipityPotion150Price,
    serendipityPotion200:
      totalItemsUsed.serendipityPotion200 * serendipityPotion200Price,
    serendipityPotion300:
      totalItemsUsed.serendipityPotion300 * serendipityPotion300Price,
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

              <div className="flex w-full max-w-sm items-center gap-2">
                <span className="text-sm text-muted-foreground">+</span>

                <Input
                  id="targetLevel"
                  type="number"
                  min="12"
                  max="24"
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="survivalTincture">Survival Tincture</Label>
                <Input
                  id="survivalTincture"
                  type="number"
                  min="0"
                  step="0.001"
                  value={survivalTincturePrice}
                  onChange={(e) =>
                    setSurvivalTincturePrice(Number(e.target.value))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serendipityPotion100">
                  Seren. Potion (100 %)
                </Label>

                <Input
                  id="serendipityPotion100"
                  type="number"
                  min="0"
                  step="0.001"
                  value={serendipityPotion100Price}
                  onChange={(e) =>
                    setSerendipityPotion100Price(Number(e.target.value))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serendipityPotion150">
                  Seren. Potion (150 %)
                </Label>

                <Input
                  id="serendipityPotion150"
                  type="number"
                  min="0"
                  step="0.001"
                  value={serendipityPotion150Price}
                  onChange={(e) =>
                    setSerendipityPotion150Price(Number(e.target.value))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serendipityPotion200">
                  Seren. Potion (200 %)
                </Label>

                <Input
                  id="serendipityPotion200"
                  type="number"
                  min="0"
                  step="0.001"
                  value={serendipityPotion200Price}
                  onChange={(e) =>
                    setSerendipityPotion200Price(Number(e.target.value))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serendipityPotion300">
                  Seren. Potion (300 %)
                </Label>

                <Input
                  id="serendipityPotion300"
                  type="number"
                  min="0"
                  step="0.001"
                  value={serendipityPotion300Price}
                  onChange={(e) =>
                    setSerendipityPotion300Price(Number(e.target.value))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mastersFormula">Master&apos;s Formula</Label>
                <Input
                  id="mastersFormula"
                  type="number"
                  min="0"
                  step="0.001"
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
                  step="0.001"
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
            <CardTitle>Action configuration</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ITEM_LEVELS.map((n) => (
                <div
                  className="flex gap-2 items-center space-y-2"
                  key={`action${n}`}
                >
                  <Label className="mb-0">+{n}</Label>

                  <Select
                    value={actions[n].toString()}
                    onValueChange={(value) => handleActionChange(n, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>+{n}</SelectLabel>
                        <SelectItem value="-1">Reflection</SelectItem>
                        <SelectItem value="2">Pot. 100 %</SelectItem>
                        <SelectItem value="2.5">Pot. 150 %</SelectItem>
                        <SelectItem value="3">Pot. 200 %</SelectItem>
                        <SelectItem value="4">Pot. 300 %</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
              <span className="text-sm font-medium">
                Serendipity Potion (100 %)
              </span>

              <Badge variant="outline">
                {calcAvg(totalItemsUsed.serendipityPotion100)}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Serendipity Potion (150 %)
              </span>

              <Badge variant="outline">
                {calcAvg(totalItemsUsed.serendipityPotion150)}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Serendipity Potion (200 %)
              </span>

              <Badge variant="outline">
                {calcAvg(totalItemsUsed.serendipityPotion200)}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Serendipity Potion (300 %)
              </span>

              <Badge variant="outline">
                {calcAvg(totalItemsUsed.serendipityPotion300)}
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
              <span className="text-sm font-medium">
                Serendipity Potion (100 %)
              </span>
              <Badge variant="outline">
                {formatPrice(calcAvg(total.serendipityPotion100))}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Serendipity Potion (150 %)
              </span>
              <Badge variant="outline">
                {formatPrice(calcAvg(total.serendipityPotion150))}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Serendipity Potion (200 %)
              </span>
              <Badge variant="outline">
                {formatPrice(calcAvg(total.serendipityPotion200))}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Serendipity Potion (300 %)
              </span>
              <Badge variant="outline">
                {formatPrice(calcAvg(total.serendipityPotion300))}
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

      <div className="text-center py-6 border-t">
        <p className="text-sm text-muted-foreground">
          Made with{" "}
          <Tooltip>
            <TooltipTrigger>❤️</TooltipTrigger>
            <TooltipContent>passion!</TooltipContent>
          </Tooltip>{" "}
          by{" "}
          <a
            href="https://github.com/brunobragaw8t"
            target="_blank"
            className="text-primary hover:underline font-medium"
          >
            White8Tiger
          </a>
        </p>
      </div>
    </div>
  );
}
