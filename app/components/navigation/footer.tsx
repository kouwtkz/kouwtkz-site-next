"use client";

import React from "react";
import Link from "next/link";
import { SiteProps, SiteSnsProps } from "@/app/site/SiteData.mjs";

const SnsList = React.memo(function SnsList({
  snsList,
}: {
  snsList: SiteSnsProps[];
}) {
  return (
    <>
      {snsList.length > 0 ? (
        <div className="py-4">
          {snsList.map((sns, i) => (
            <div key={i} className="inline-block mx-1">
              {sns.mask && !sns.none ? (
                <Link
                  href={sns.url}
                  target={/^https?:\/\//.test(sns.url) ? "_blank" : ""}
                  className={sns.hidden ? "hidden" : ""}
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
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
});

type FooterProps = {
  site: SiteProps;
  currentDate: Date;
};
export default function Footer({ site, currentDate }: FooterProps) {
  return (
    <footer className="pt-8 pb-12">
      <div className="font-Mandali">
        © {site.author.since}-
        {
          currentDate
            .toLocaleDateString("ja", { timeZone: "JST" })
            .split("/", 1)[0]
        }{" "}
        {site.author.ename}
      </div>
      <SnsList snsList={site.menu?.sns || []} />
    </footer>
  );
}
