import React from "react";
import Link from "next/link";
import { SiteDataType, SiteSnsItemType } from "@/app/context/site/SiteDataType";

const SnsList = React.memo(function SnsList({
  snsList,
}: {
  snsList: SiteSnsItemType[];
}) {
  return (
    <>
      {snsList.length > 0 ? (
        <div className="py-4">
          {snsList
            .filter((sns) => !sns.none && sns.mask)
            .map((sns, i) => (
              <div
                key={i}
                className={"inline-block mx-1" + (sns.hidden ? " hidden" : "")}
              >
                <Link
                  title={sns.title || sns.name}
                  href={sns.url}
                  target={/^https?:\/\//.test(sns.url) ? "_blank" : ""}
                  rel={sns.rel}
                >
                  <div
                    className="bg-main hover:bg-main-soft w-8 h-8"
                    style={{
                      WebkitMaskImage: `url(${sns.mask})`,
                      maskImage: `url(${sns.mask})`,
                      maskSize: "cover",
                      WebkitMaskSize: "cover",
                    }}
                  ></div>
                </Link>
              </div>
            ))}
        </div>
      ) : null}
    </>
  );
});

type FooterProps = {
  since: number;
  authorEName: string;
  sns?: SiteSnsItemType[];
  currentDate: Date;
};
export default function Footer({
  since,
  authorEName,
  sns,
  currentDate,
}: FooterProps) {
  return (
    <footer className="pt-8 pb-12">
      <div className="font-Mandali">
        © {since}-
        {
          currentDate
            .toLocaleDateString("ja", { timeZone: "JST" })
            .split("/", 1)[0]
        }{" "}
        {authorEName}
      </div>
      <SnsList snsList={sns || []} />
    </footer>
  );
}
