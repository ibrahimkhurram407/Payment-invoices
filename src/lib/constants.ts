export const EU_COUNTRIES = [
  { code: "AT", name: "Austria", vatRate: 20 },
  { code: "BE", name: "Belgium", vatRate: 21 },
  { code: "BG", name: "Bulgaria", vatRate: 20 },
  { code: "HR", name: "Croatia", vatRate: 25 },
  { code: "CY", name: "Cyprus", vatRate: 19 },
  { code: "CZ", name: "Czech Republic", vatRate: 21 },
  { code: "DK", name: "Denmark", vatRate: 25 },
  { code: "EE", name: "Estonia", vatRate: 20 },
  { code: "FI", name: "Finland", vatRate: 24 },
  { code: "FR", name: "France", vatRate: 20 },
  { code: "DE", name: "Germany", vatRate: 19 },
  { code: "GR", name: "Greece", vatRate: 24 },
  { code: "HU", name: "Hungary", vatRate: 27 },
  { code: "IE", name: "Ireland", vatRate: 23 },
  { code: "IT", name: "Italy", vatRate: 22 },
  { code: "LV", name: "Latvia", vatRate: 21 },
  { code: "LT", name: "Lithuania", vatRate: 21 },
  { code: "LU", name: "Luxembourg", vatRate: 17 },
  { code: "MT", name: "Malta", vatRate: 18 },
  { code: "NL", name: "Netherlands", vatRate: 21 },
  { code: "PL", name: "Poland", vatRate: 23 },
  { code: "PT", name: "Portugal", vatRate: 23 },
  { code: "RO", name: "Romania", vatRate: 19 },
  { code: "SK", name: "Slovakia", vatRate: 20 },
  { code: "SI", name: "Slovenia", vatRate: 22 },
  { code: "ES", name: "Spain", vatRate: 21 },
  { code: "SE", name: "Sweden", vatRate: 25 }
];

export const EU_COUNTRY_CODES = EU_COUNTRIES.map(country => country.code);

export function isEuCountry(countryCode: string | undefined): boolean {
  if (!countryCode) return false;
  return EU_COUNTRY_CODES.includes(countryCode.toUpperCase());
}

export function getVatRateByCountry(countryCode: string): number {
  const country = EU_COUNTRIES.find(c => c.code === countryCode.toUpperCase());
  return country ? country.vatRate : 0;
}

export function getCountryNameByCode(countryCode: string | undefined | null): string {
  if (!countryCode) return '';
  const country = EU_COUNTRIES.find(c => c.code === countryCode.toUpperCase());
  return country ? country.name : countryCode;
}