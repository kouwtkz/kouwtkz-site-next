import {
  Mochiy_Pop_One,
  Zen_Maru_Gothic,
  Kosugi_Maru,
  Mandali,
} from "next/font/google";

import localFont from "next/font/local"

export const KosugiMaruFont = Kosugi_Maru({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-KosugiMaru",
});
export const MochiyPopOneFont = Mochiy_Pop_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-MochiyPopOne",
});
// export const ZenMaruFont = Zen_Maru_Gothic({
//   weight: "400",
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-ZenMaru",
// });
// export const MandaliFont = Mandali({
//   weight: "400",
//   subsets: ["latin"],
//   variable: "--font-Mandali",
// });
export const LuloCleanFont = localFont({
  src: "LuloCleanOneBold.woff2",
  variable: "--font-LuloClean",
  display: 'swap',
})