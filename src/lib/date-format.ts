export const SCHOOL_TIME_ZONE = "America/Sao_Paulo";
const schoolDateTimeFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: SCHOOL_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

type DateValue = Date | string | null | undefined;

function toValidDate(value: DateValue): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatCalendarDate(
  value: DateValue,
  dateStyle: Intl.DateTimeFormatOptions["dateStyle"] = "short",
): string {
  const date = toValidDate(value);
  return date
    ? new Intl.DateTimeFormat("pt-BR", {
        dateStyle,
        timeZone: "UTC",
      }).format(date)
    : "";
}

export function formatSchoolDateTime(
  value: DateValue,
  options: Pick<Intl.DateTimeFormatOptions, "dateStyle" | "timeStyle"> = {
    dateStyle: "short",
    timeStyle: "short",
  },
): string {
  const date = toValidDate(value);
  return date
    ? new Intl.DateTimeFormat("pt-BR", {
        ...options,
        timeZone: SCHOOL_TIME_ZONE,
      }).format(date)
    : "";
}

export function formatSchoolTime(value: DateValue): string {
  const date = toValidDate(value);
  return date
    ? new Intl.DateTimeFormat("pt-BR", {
        timeStyle: "short",
        timeZone: SCHOOL_TIME_ZONE,
      }).format(date)
    : "";
}

export function toCalendarDateInputValue(value: DateValue): string {
  const date = toValidDate(value);
  return date ? date.toISOString().slice(0, 10) : "";
}

export function toSchoolDateTimeInputValue(value: DateValue): string {
  const date = toValidDate(value);
  if (!date) return "";
  const parts = schoolDateTimeFormatter.formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

export function fromSchoolDateTimeInputValue(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;

  const [, yearValue, monthValue, dayValue, hourValue, minuteValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const hour = Number(hourValue);
  const minute = Number(minuteValue);
  const targetWallTime = Date.UTC(year, month - 1, day, hour, minute);
  let timestamp = targetWallTime;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const formattedParts = schoolDateTimeFormatter.formatToParts(
      new Date(timestamp),
    );
    const values = Object.fromEntries(
      formattedParts.map(({ type, value: partValue }) => [type, Number(partValue)]),
    );
    const representedWallTime = Date.UTC(
      values.year,
      values.month - 1,
      values.day,
      values.hour,
      values.minute,
    );
    timestamp += targetWallTime - representedWallTime;
  }

  const parsed = new Date(timestamp);
  return toSchoolDateTimeInputValue(parsed) === value ? parsed : null;
}

export function getSchoolDateParts(value = new Date()) {
  const parts = schoolDateTimeFormatter.formatToParts(value);
  const values = Object.fromEntries(
    parts.map(({ type, value: partValue }) => [type, partValue]),
  );
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
}

export function getSchoolDayRange(value = new Date()) {
  const { year, month, day } = getSchoolDateParts(value);
  const range = getSchoolDayRangeForDate(
    `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  );
  if (!range) throw new RangeError("Não foi possível calcular o dia escolar.");
  return range;
}

export function getSchoolDayRangeForDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, yearValue, monthValue, dayValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const selectedDate = new Date(Date.UTC(year, month - 1, day));
  if (
    selectedDate.getUTCFullYear() !== year ||
    selectedDate.getUTCMonth() !== month - 1 ||
    selectedDate.getUTCDate() !== day
  )
    return null;
  const start = fromSchoolDateTimeInputValue(
    `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00`,
  );
  const nextDate = new Date(Date.UTC(year, month - 1, day + 1));
  const nextDay = `${nextDate.getUTCFullYear()}-${String(nextDate.getUTCMonth() + 1).padStart(2, "0")}-${String(nextDate.getUTCDate()).padStart(2, "0")}`;
  const end = fromSchoolDateTimeInputValue(`${nextDay}T00:00`);
  if (!start || !end) return null;
  return { start, end };
}

export function getSchoolCalendarDateStart(value = new Date()): Date {
  const { year, month, day } = getSchoolDateParts(value);
  return new Date(Date.UTC(year, month - 1, day));
}

export function getSchoolYearStart(value = new Date()): Date {
  const { year } = getSchoolDateParts(value);
  return new Date(Date.UTC(year, 0, 1));
}
