export type GradeKey = "grade4" | "grade5"
export type SubjectKey = "literacy" | "numeracy" | "performance"
export type DifficultyKey = "easy" | "moderate" | "difficult" | "mixed"

export const MAX_TEST_SLOTS = 10

export const mockCatalog: Record<
  GradeKey,
  Record<SubjectKey, Record<DifficultyKey, number[]>>
> = {
  grade4: {
    literacy: {
      easy: [1],
      moderate: [1],
      difficult: [1],
      mixed: [1, 2],
    },
    numeracy: {
      easy: [1],
      moderate: [1],
      difficult: [1],
      mixed: [1, 2],
    },
    performance: {
      easy: [1],
      moderate: [1],
      difficult: [1],
      mixed: [1, 2],
    },
  },
  grade5: {
    literacy: {
      easy: [],
      moderate: [],
      difficult: [],
      mixed: [],
    },
    numeracy: {
      easy: [],
      moderate: [],
      difficult: [],
      mixed: [],
    },
    performance: {
      easy: [],
      moderate: [],
      difficult: [],
      mixed: [],
    },
  },
}

export function isTestAvailable(
  grade: GradeKey,
  subject: SubjectKey,
  difficulty: DifficultyKey,
  testNumber: number,
) {
  return mockCatalog[grade][subject][difficulty].includes(testNumber)
}

export function getAvailableTests(
  grade: GradeKey,
  subject: SubjectKey,
  difficulty: DifficultyKey,
) {
  return mockCatalog[grade][subject][difficulty]
}

export function getTestHref(
  subject: SubjectKey,
  difficulty: DifficultyKey,
  testNumber: number,
) {
  return `/mock-tests/${subject}/${difficulty}-${testNumber}`
}
