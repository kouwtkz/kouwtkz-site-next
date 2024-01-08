export type logicalConditionsType = "AND" | "OR";
export type filterConditionsType = "equals" | "contains" | "gt" | "gte" | "lt" | "lte" | "not" | "in" | "notIn" | "startsWith" | "endsWith";
export type objectSubmitDataType<T> = { [K in keyof T]?: T[K] | { [C in filterConditionsType]?: T[K] } }
export type findWhereType<T> = { [K in logicalConditionsType]?: (findWhereType<T> | objectSubmitDataType<T>)[] } | objectSubmitDataType<T>
// includeは無理…それ以外を再現した
export type findManyProps<T> = {
  list?: T[],
  where?: findWhereType<T>;
  take?: number,
  skip?: number,
  orderBy?: { [K in keyof T]?: "asc" | "desc" }[],
  include?: any
}
