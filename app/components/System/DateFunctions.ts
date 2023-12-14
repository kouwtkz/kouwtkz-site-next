export type AutoAllotDateProps = {
  value: string,
  replaceT?: boolean
  dayFirst?: boolean
  dayLast?: boolean
  forceDayTime?: boolean
}

export function AutoAllotDate({ value, replaceT = true, dayFirst = false, dayLast = false, forceDayTime = false }: AutoAllotDateProps) {
  if (replaceT) value = value.replace(/[\s_]/, "T");
  if (dayFirst || dayLast) {
    if (forceDayTime) value = value.replace(/[T\s][\d.:]+/, '');
    if (forceDayTime || !/[T\s]/.test(value)) {
      if (dayFirst) value = value.replace(/([\d.:])(\+[\d:]+|Z|)$/, "$1T00:00:00.000$2");
      if (dayLast) value = value.replace(/([\d.:])(\+[\d:]+|Z|)$/, "$1T23:59:59.999$2");
    }
    console.log(value);
    if (value.endsWith("Z") || /\+/.test(value))
      return new Date(value);
    else
      return new Date(`${value}+09:00`);
  }
}