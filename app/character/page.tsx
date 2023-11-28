import React from "react";
import { charaList } from "./[name]/getList";
import Image from "next/image";
import Link from "next/link";

export default function Page({
  params,
  searchParams,
}: {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="text-center">
      <h1 className="font-LuloClean text-4xl text-main pt-8 mb-12">
        CHARACTER
      </h1>
      {Object.entries(charaList).map(([name, chara], index) => {
        const icon = chara.icon || "";
        return (
          <div key={index} className="m-4 h-8 inline-block">
            <Link href={`character/${name}`}>
              {icon ? (
                <Image
                  className="inline-block mr-2"
                  src={icon}
                  alt={chara.name}
                  width={24}
                  height={24}
                />
              ) : null}
              <span className="align-middle">{chara.name}</span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
