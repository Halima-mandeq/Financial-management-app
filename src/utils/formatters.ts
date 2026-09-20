export function formatMoney(amount: number, currency: string = 'USD ($)'): string {
  const isSOS = currency.includes('SOS');
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: isSOS ? 0 : 2,
    maximumFractionDigits: isSOS ? 0 : 2,
  });

  if (isSOS) {
    return `${formatted} Sh.So`;
  }
  return `$${formatted}`;
}

export function formatDateSomali(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
}
