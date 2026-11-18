const SUFFIXES = [
  '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No',
  'Dc', 'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Ocd', 'Nod',
  'Vg', 'Uvg', 'Dvg', 'Tvg',
];

export function formatNumber(n: number): string {
  if (n === 0) return '0';
  if (n < 0) return '-' + formatNumber(-n);
  if (n < 1000) {
    return n < 100 ? n.toFixed(1).replace(/\.0$/, '') : Math.floor(n).toString();
  }
  const tier = Math.floor(Math.log10(n) / 3);
  if (tier >= SUFFIXES.length) {
    return n.toExponential(2);
  }
  const scaled = n / Math.pow(1000, tier);
  return scaled.toFixed(2).replace(/\.?0+$/, '') + SUFFIXES[tier];
}

export function formatMoney(n: number): string {
  return '$' + formatNumber(n);
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return Math.floor(seconds) + 's';
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ' + Math.floor(seconds % 60) + 's';
  return Math.floor(seconds / 3600) + 'h ' + Math.floor((seconds % 3600) / 60) + 'm';
}

export function formatPercent(n: number): string {
  return (n * 100).toFixed(0) + '%';
}
