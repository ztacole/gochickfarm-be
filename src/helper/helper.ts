export function calculateAge(date: Date): string {
  const now = new Date();

  let year = now.getFullYear() - date.getFullYear();
  let month = now.getMonth() - date.getMonth();

  if (month < 0) {
    year--;
    month += 12;
  }

  return `${year} tahun ${month} bulan`;
}