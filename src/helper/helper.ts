export function calculateAgeFormatted(date: Date): string {
  const now = new Date();

  let year = now.getFullYear() - date.getFullYear();
  let month = now.getMonth() - date.getMonth();

  if (month < 0) {
    year--;
    month += 12;
  }

  return `${year} tahun ${month} bulan`;
}

export function calculateAgeInMonths(birthdate: Date): number {
    const now = new Date();
    const years = now.getFullYear() - birthdate.getFullYear();
    const months = now.getMonth() - birthdate.getMonth();
    return years * 12 + months;
}