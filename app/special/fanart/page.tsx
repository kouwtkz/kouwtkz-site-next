import { Metadata } from "next";
import GivenArtPage from "./GivenArtPage";
const title = "GIVEN FANART";
export const metadata: Metadata = { title };

export default function page() {
  return <GivenArtPage />;
}
