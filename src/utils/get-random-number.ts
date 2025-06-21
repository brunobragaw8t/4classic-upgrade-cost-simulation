// Get a random number from the given range
export function getRandomNumber(numbers: number[]): number {
  const randomIndex = Math.floor(Math.random() * numbers.length);
  return numbers[randomIndex];
}
