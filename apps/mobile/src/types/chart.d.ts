export type TimeFrame = 'today' | 'weekly' | 'monthly' | 'year' | 'total';

type DataItem = {
  date: string; // x Value of the chart (ex. Date)
  value: number; // y Value of the cart (ex. Price)
};
