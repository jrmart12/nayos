"use client"

import { NextStudio } from "next-sanity/studio"
import config from "@/sanity.config"

export default function Studio() {
  //  Workaround for https://github.com/sanity-io/next-sanity/issues/551
  return <NextStudio config={config} />
}
