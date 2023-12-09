"use client";

import { create } from "zustand";

export type ChildrenNodeType = JSX.Element | string | null;
export type ChildrenArrayType = ChildrenNodeType[];
export type ChildrenItemType = ChildrenNodeType | ChildrenArrayType;
export type ChildrenType = { row: number, column: number, children: ChildrenItemType };
export type ChildrenMapType = Map<string, ChildrenType>;

export type FixedChildrenStateType = {
  n: number
  setN: () => void
  childrenMap: ChildrenMapType
  setChildren: (key: string, value: ChildrenType) => void
  replaceChildren: (key: string, value: ChildrenType) => void
  deleteChildren: (key: string) => void
  clearChildren: () => void
}

export function createFixedState() {
  return create<FixedChildrenStateType>((set) => ({
    n: 0,
    setN: () => set(state => ({ n: state.n + 1 })),
    childrenMap: new Map(),
    setChildren(key, value) {
      set((state) => { if (!state.childrenMap.has(key)) { state.childrenMap.set(key, value); return { childrenMap: state.childrenMap }; } else return state; })
    },
    replaceChildren(key, value) {
      set((state) => { state.childrenMap.set(key, value); return { childrenMap: state.childrenMap }; })
    },
    deleteChildren(key) {
      set((state) => { state.childrenMap.delete(key); return { childrenMap: state.childrenMap } })
    },
    clearChildren() {
      set((state) => { state.childrenMap.clear(); return { childrenMap: state.childrenMap }; })
    },
  }))
}

export function GetArrayChildren(childrenMap: ChildrenMapType) {
  const arrayChildren = [] as ({ children: ChildrenItemType, key: string })[][][];
  const entries = Object.entries(Object.fromEntries(childrenMap));
  entries.forEach(([key, item]) => {
    if (!arrayChildren[item.row]) arrayChildren[item.row] = [];
    if (!arrayChildren[item.row][item.column]) arrayChildren[item.row][item.column] = [];
    arrayChildren[item.row][item.column].push({ key, children: item.children })
  })
  return arrayChildren;
}