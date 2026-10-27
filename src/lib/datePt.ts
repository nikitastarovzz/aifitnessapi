/** "22 de outubro de 2026", in UTC like every other date on the site. Kept
 *  apart from ./translations so a component can format a date without
 *  pulling in the translation store, which reads files at build time. */
export function formatDatePt(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
