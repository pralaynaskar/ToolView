export type Theme = {
  name: string
  label: string
  color: string
}

export const themes: Theme[] = [
  {
    name: 'zinc',
    label: 'Zinc',
    color: 'hsl(220.9 39.3% 11%)',
  },
  {
    name: 'yellow',
    label: 'Yellow',
    color: 'hsl(45 96% 50%)',
  },
  {
    name: 'rose',
    label: 'Rose',
    color: 'hsl(346.8 77.2% 49.8%)',
  },
  {
    name: 'blue',
    label: 'Blue',
    color: 'hsl(221.2 83.2% 53.3%)',
  },
  {
    name: 'green',
    label: 'Green',
    color: 'hsl(142.1 76.2% 36.3%)',
  },
]
