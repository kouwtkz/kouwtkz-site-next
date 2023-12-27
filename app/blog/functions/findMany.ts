type logicalConditionsType = "AND" | "OR";
type filterConditionsType = "equals" | "contains" | "gt" | "gte" | "lt" | "lte" | "not" | "in" | "notIn" | "startsWith" | "endsWith";
type objectSubmitDataType<T> = { [K in keyof T]?: T[K] | { [C in filterConditionsType]?: T[K] } }
type findWhereType<T> = { [K in logicalConditionsType]?: (findWhereType<T> | objectSubmitDataType<T>)[] } | objectSubmitDataType<T>

// includeは無理…それ以外を再現した
type findManyProps<T> = {
  list: T[],
  where?: findWhereType<T>;
  take?: number,
  skip?: number,
  orderBy?: { [K in keyof T]?: "asc" | "desc" }[],
  include?: any
}
export function findMany<T>({ list, where, take, orderBy, skip = 0 }: findManyProps<T>) {
  orderBy?.reverse().forEach((args) =>
    Object.entries(args).forEach(([k, v]) => {
      switch (v) {
        case "asc":
          list.sort((a: any, b: any) => a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0)
          break;
        case "desc":
          list.sort((a: any, b: any) => a[k] < b[k] ? 1 : a[k] > b[k] ? -1 : 0)
          break;
      }
    })
  );
  let i = 0;
  return list.filter((value) => {
    if (take !== undefined && i >= (take + skip)) return false;
    const result = whereLoop(value, where);
    if (result) i++;
    return result && i > skip;
  })
}

function whereLoop<T>(value: T, where?: findWhereType<T>) {
  const recursion = (__where: findWhereType<T>): boolean => {
    return Object.entries(__where).every(([fkey, fval]) => {
      switch (fkey) {
        case "AND":
          return (fval as findWhereType<T>[])
            .every((_val) => recursion(_val))
        case "OR":
          return (fval as findWhereType<T>[])
            .some((_val) => recursion(_val))
        default:
          const cval = (value as any)[fkey];
          if (typeof (fval) === "object") {
            return (Object.entries(fval) as [filterConditionsType, any][]).every(([k, v]) => {
              switch (k) {
                case "equals":
                  return cval == v;
                case "contains":
                  return String(cval).match(new RegExp(v, 'i'));
                case "startsWith":
                  return String(cval).startsWith(v);
                case "endsWith":
                  return String(cval).endsWith(v);
                case "gt":
                  return cval > v;
                case "gte":
                  return cval >= v;
                case "lt":
                  return cval < v;
                case "lte":
                  return cval <= v;
                default:
                  return false;
              }
            })
          } else {
            return cval == fval;
          }
      }
    })
  }
  return where ? recursion(where) : true;
}
