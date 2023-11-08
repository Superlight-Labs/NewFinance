export function formatCurrency(number: number, currency: Currency = '€') {
  // Überprüfe, ob die Eingabe eine gültige Zahl ist
  if (isNaN(number)) {
    return 'Ungültige Zahl';
  }

  if (currency === 'BTC') return number + ' ' + currency;
  if (currency === 'sats') return number.toFixed(0) + ' ' + currency;

  // Runde die Zahl auf zwei Dezimalstellen
  const formattedNumber = parseFloat(number.toString()).toFixed(2);

  // Füge Tausendertrennzeichen hinzu
  const parts = formattedNumber.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Füge das Währungssymbol hinzu
  const formattedCurrency = `${parts[0]},${parts[1]} ` + currency;

  return formattedCurrency;
}
