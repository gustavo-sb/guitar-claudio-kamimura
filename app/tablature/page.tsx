import type { Metadata } from "next"
import { TablatureEditor } from "@/components/editor/tablature-editor"
import { tablatureMeta } from "@/lib/tablature-ui"

export const metadata: Metadata = {
  title: tablatureMeta.title,
  description: tablatureMeta.description,
}

export default function TablaturePage() {
  return <TablatureEditor />
}
