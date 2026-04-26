// lib/mock-catalog.ts
import fs from "fs"
import path from "path"

export type LevelKey = "easy" | "moderate" | "difficult" | "mixed"
export type SubjectKey = "literacy" | "numeracy" | "performance"

export type SubjectCatalog = Record<LevelKey, number[]>

const LEVELS: LevelKey[] = ["easy", "moderate", "difficult", "mixed"]

function emptyCatalog(): SubjectCatalog {
  return {
    easy: [],
    moderate: [],
    difficult: [],
    mixed: [],
  }
}

export function getSubjectCatalog(subject: SubjectKey): SubjectCatalog {
  const basePath = path.join(process.cwd(), "app", "mock-tests", subject)
  const catalog = emptyCatalog()

  if (!fs.existsSync(basePath)) return catalog

  const entries = fs.readdirSync(basePath, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const match = entry.name.match(/^(easy|moderate|difficult|mixed)-(\d+)$/)
    if (!match) continue

    const level = match[1] as LevelKey
    const number = Number(match[2])

    if (!Number.isNaN(number)) {
      catalog[level].push(number)
    }
  }

  for (const level of LEVELS) {
    catalog[level].sort((a, b) => a - b)
  }

  return catalog
}
