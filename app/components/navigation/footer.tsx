"use client";

import React from "react";
import Link from "next/link";
import { SiteProps } from "@/siteData/site.d";
import Image from "next/image";

type FooterProps = {
  site: SiteProps;
  currentDate: Date;
};

const Footer: React.FC<FooterProps> = ({ site, currentDate }) => {
  const snsList = site.menu?.sns || [];
  return (
    <footer className="pt-8 pb-12">
      <div className="font-Mandali">
        © {site.author.since}-{currentDate.getFullYear()} {site.author.ename}
      </div>
      {snsList.length > 0 ? (
        <div className="py-4">
          {snsList.map((sns, i) => (
            <div key={i} className="inline-block mx-1">
              {sns.mask ? (
                <Link href={sns.url} target="_blank">
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
      </footer>
  );
};

export default Footer;
