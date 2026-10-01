import type { Metadata } from "next"
import { GuitarTuner } from "@/components/tuner/guitar-tuner"
import { tunerMeta } from "@/lib/tuner-ui"

export const metadata: Metadata = {
  title: tunerMeta.title,
  description: tunerMeta.description,
}

export default function TunerPage() {
  return <GuitarTuner />
}
