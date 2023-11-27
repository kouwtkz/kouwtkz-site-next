function getAMPM(d: Date, utc = false) {
  return (utc ? d.getUTCHours() : d.getHours()) / 12 < 1 ? 0 : 1;
}
function getTimezone(d: Date, RFC822: boolean) {
  const zoneOffset = d.getTimezoneOffset();
  const zoneAbs = Math.abs(zoneOffset);
  const zoneHour = Math.floor(zoneAbs / 60);
  const zoneMinute = zoneAbs % 60;
  return (zoneOffset > 0 ? '-' : '+') + `0${zoneHour}`.slice(-2) + (RFC822 ? '' : ':') + `0${zoneMinute}`.slice(-2);
}
export default function date_format(
  format_str: string,
  date = new Date(),
  utc = false,
) {
  const d = typeof date === "object" ? date : new Date(date);
  return format_str.replace(
    /Y|y|n|m|j|d|w|WW|G|g|H|h|AA|I|i|S|s|L|l|A|a|W|ZZ|Z/g,
    // mの型エラーがどうしても消えないのでエラー自体を無視
    // deno-lint-ignore ban-ts-comment
    // @ts-expect-error
    (m: string) => {
      switch (m) {
        case "Y":
          return `${utc ? d.getUTCFullYear() : d.getFullYear()}`;
        case "y":
          return `${utc ? d.getUTCFullYear() : d.getFullYear()}`.slice(-2);
        case "n":
          return `${(utc ? d.getUTCMonth() : d.getMonth()) + 1}`;
        case "m":
          return `0${(utc ? d.getUTCMonth() : d.getMonth()) + 1}`.slice(-2);
        case "j":
          return `${utc ? d.getUTCDate() : d.getDate()}`;
        case "d":
          return `0${utc ? d.getUTCDate() : d.getDate()}`.slice(-2);
        case "w":
          return `${utc ? d.getUTCDay() : d.getDay()}`;
        case "WW":
          return ["日", "月", "火", "水", "木", "金", "土"][
            utc ? d.getUTCDay() : d.getDay()
          ];
        case "W":
          return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
            utc ? d.getUTCDay() : d.getDay()
          ];
        case "G":
          return `${utc ? d.getUTCHours() : d.getHours()}`;
        case "g":
          return `${(utc ? d.getUTCHours() : d.getHours()) % 12}`;
        case "H":
          return `0${utc ? d.getUTCHours() : d.getHours()}`.slice(-2);
        case "h":
          return `0${utc ? d.getUTCHours() : d.getHours() % 12}`.slice(-2);
        case "AA":
          return ["午前", "午後"][getAMPM(d, utc)];
        case "A":
          return ["AM", "PM"][getAMPM(d, utc)];
        case "a":
          return ["am", "pm"][getAMPM(d, utc)];
        case "I":
          return `${utc ? d.getUTCMinutes() : d.getMinutes()}`;
        case "i":
          return `0${utc ? d.getUTCMinutes() : d.getMinutes()}`.slice(-2);
        case "S":
          return `${utc ? d.getUTCSeconds() : d.getSeconds()}`;
        case "s":
          return `0${utc ? d.getUTCSeconds() : d.getSeconds()}`.slice(-2);
        case "L":
          return `${utc ? d.getUTCMilliseconds() : d.getMilliseconds()}`;
        case "l":
          return `00${utc ? d.getUTCMilliseconds() : d.getMilliseconds()}`
            .slice(-3);
        case "ZZ":
          return getTimezone(d, false);
        case "Z":
          return getTimezone(d, true);
      }
    },
  );
}
