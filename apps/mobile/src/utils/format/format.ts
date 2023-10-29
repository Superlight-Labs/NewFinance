export function formatCurrency(number: number) {
  // Überprüfe, ob die Eingabe eine gültige Zahl ist
  if (isNaN(number)) {
    return 'Ungültige Zahl';
  }

  // Runde die Zahl auf zwei Dezimalstellen
  const formattedNumber = parseFloat(number.toString()).toFixed(2);

  // Füge Tausendertrennzeichen hinzu
  const parts = formattedNumber.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Füge das Währungssymbol hinzu
  const formattedCurrency = `${parts[0]},${parts[1]} €`;

  return formattedCurrency;
}
