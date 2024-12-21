import React from "react";
import { IconExternalLink } from "@tabler/icons-react";
import licensesJSON from "../../../licenses.json";

type LicenseFormat = {
  department: string;
  relatedTo: string;
  name: string;
  licensePeriod: string;
  material: string;
  licenseType: string;
  link: string;
  remoteVersion: string;
  installedVersion: string;
  definedVersion: string;
  author: string;
};

export default function Licenses() {
  const licenses = licensesJSON as LicenseFormat[];

  return (
    <>
      <div className="flex flex-col items-center mb-10 space-y-2 mt-28">
        <h1 className="text-5xl">Licenses</h1>
        <h2 className="text-xl">
          All licenses used for Kevin Logan Electrical
        </h2>
      </div>
      <div className="grid max-w-3xl grid-cols-12 gap-10 mx-auto">
        {licenses.map((l) => (
          <a
            key={l.link}
            className="flex-col space-y-1 overflow-hidden col-span-full group"
            href={l.link.replace("git+", "").replace("ssh://", "")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open Github repo for ${l.name}`}
          >
            <div className="inline-flex items-end">
              <div className="space-x-2 duration-300 ease-in group-hover:translate-x-6 group-hover:opacity-0">
                <span className="text-2xl">{l.name}</span>
                <span className="opacity-50">{l.installedVersion}</span>
              </div>

              <div className="absolute mb-1 text-blue-600 duration-300 ease-in -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                <IconExternalLink />
              </div>
            </div>

            <div className="text-gray-400">
              {[l.licenseType, l.author].filter(Boolean).join(", ")}
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
