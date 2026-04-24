"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useAuth } from "@/contexts/auth-context"
import { 
  FileText, 
  Crown, 
  Download, 
  ArrowLeft,
  BookOpen,
  Calculator,
  PenTool,
  Lock,
  Printer
} from "lucide-react"

interface Worksheet {
  id: string
  title: string
  description: string
  category: "language-arts" | "mathematics" | "writing"
  difficulty: "easy" | "medium" | "hard"
  pages: number
}

const worksheets: Worksheet[] = [
  // Language Arts
  {
    id: "grammar-nouns",
    title: "Nouns Practice Worksheet",
    description: "Identify common, proper, and collective nouns in sentences",
    category: "language-arts",
    difficulty: "easy",
    pages: 2
  },
  {
    id: "grammar-verbs",
    title: "Verbs and Tenses",
    description: "Practice identifying verbs and using correct tenses",
    category: "language-arts",
    difficulty: "medium",
    pages: 3
  },
  {
    id: "reading-comprehension-1",
    title: "Reading Comprehension: Jamaica Stories",
    description: "Read passages and answer questions about Jamaican culture",
    category: "language-arts",
    difficulty: "medium",
    pages: 4
  },
  {
    id: "vocabulary-synonyms",
    title: "Synonyms and Antonyms",
    description: "Match words with their synonyms and antonyms",
    category: "language-arts",
    difficulty: "easy",
    pages: 2
  },
  {
    id: "punctuation-practice",
    title: "Punctuation Practice",
    description: "Add correct punctuation to sentences",
    category: "language-arts",
    difficulty: "medium",
    pages: 3
  },
  // Mathematics
  {
    id: "addition-subtraction",
    title: "Addition and Subtraction",
    description: "Practice adding and subtracting numbers up to 1000",
    category: "mathematics",
    difficulty: "easy",
    pages: 3
  },
  {
    id: "multiplication-tables",
    title: "Multiplication Tables",
    description: "Master multiplication facts 1-12",
    category: "mathematics",
    difficulty: "medium",
    pages: 4
  },
  {
    id: "division-practice",
    title: "Division Practice",
    description: "Long division and division word problems",
    category: "mathematics",
    difficulty: "hard",
    pages: 3
  },
  {
    id: "fractions-basics",
    title: "Understanding Fractions",
    description: "Identify, compare, and work with fractions",
    category: "mathematics",
    difficulty: "medium",
    pages: 4
  },
  {
    id: "geometry-shapes",
    title: "Geometry: Shapes and Angles",
    description: "Identify shapes, calculate perimeter and area",
    category: "mathematics",
    difficulty: "medium",
    pages: 3
  },
  {
    id: "word-problems",
    title: "Math Word Problems",
    description: "Solve real-world math problems step by step",
    category: "mathematics",
    difficulty: "hard",
    pages: 4
  },
  // Writing
  {
    id: "creative-writing-prompts",
    title: "Creative Writing Prompts",
    description: "Practice creative writing with fun prompts",
    category: "writing",
    difficulty: "easy",
    pages: 3
  },
  {
    id: "letter-writing",
    title: "Letter Writing Practice",
    description: "Learn formal and informal letter formats",
    category: "writing",
    difficulty: "medium",
    pages: 2
  },
  {
    id: "paragraph-writing",
    title: "Paragraph Writing",
    description: "Structure paragraphs with topic sentences and details",
    category: "writing",
    difficulty: "medium",
    pages: 3
  },
]

const generateWorksheetHTML = (worksheet: Worksheet, studentName: string) => {
  const categoryColors = {
    "language-arts": "#0ea5e9",
    "mathematics": "#f59e0b",
    "writing": "#22c55e"
  }
  
  const color = categoryColors[worksheet.category]

  // Generate sample content based on worksheet type
  let content = ""
  
  if (worksheet.id === "grammar-nouns") {
    content = `
      <h3>Part A: Identify the Nouns</h3>
      <p class="instructions">Circle all the nouns in each sentence.</p>
      <ol class="questions">
        <li>The teacher read a book to the children.</li>
        <li>Jamaica is a beautiful island in the Caribbean.</li>
        <li>Marcus plays football with his friends at school.</li>
        <li>The team celebrated their victory with loud cheers.</li>
        <li>My grandmother makes delicious ackee and saltfish.</li>
      </ol>
      
      <h3>Part B: Common or Proper Nouns</h3>
      <p class="instructions">Write C for common noun or P for proper noun.</p>
      <ol class="questions" start="6">
        <li>Kingston ____</li>
        <li>river ____</li>
        <li>Monday ____</li>
        <li>doctor ____</li>
        <li>Blue Mountains ____</li>
      </ol>
      
      <h3>Part C: Write Your Own</h3>
      <p class="instructions">Write a sentence using at least two nouns.</p>
      <div class="write-line"></div>
      <div class="write-line"></div>
    `
  } else if (worksheet.id === "addition-subtraction") {
    content = `
      <h3>Part A: Addition</h3>
      <p class="instructions">Solve each addition problem.</p>
      <div class="math-grid">
        <div class="math-problem">345 + 267 = ____</div>
        <div class="math-problem">589 + 134 = ____</div>
        <div class="math-problem">456 + 378 = ____</div>
        <div class="math-problem">723 + 189 = ____</div>
        <div class="math-problem">294 + 508 = ____</div>
        <div class="math-problem">617 + 285 = ____</div>
      </div>
      
      <h3>Part B: Subtraction</h3>
      <p class="instructions">Solve each subtraction problem.</p>
      <div class="math-grid">
        <div class="math-problem">845 - 367 = ____</div>
        <div class="math-problem">912 - 456 = ____</div>
        <div class="math-problem">700 - 234 = ____</div>
        <div class="math-problem">568 - 189 = ____</div>
        <div class="math-problem">1000 - 473 = ____</div>
        <div class="math-problem">654 - 298 = ____</div>
      </div>
      
      <h3>Part C: Word Problems</h3>
      <p class="instructions">Read and solve each problem. Show your work.</p>
      <ol class="questions">
        <li>A farmer has 456 mangoes. He sells 189 at the market. How many mangoes does he have left?<br><div class="work-space"></div></li>
        <li>Maria collected 234 stamps. Her brother gave her 178 more. How many stamps does she have now?<br><div class="work-space"></div></li>
      </ol>
    `
  } else if (worksheet.id === "creative-writing-prompts") {
    content = `
      <h3>Writing Prompt 1</h3>
      <p class="prompt">Imagine you could fly like a bird for one day. Where would you go? What would you see?</p>
      <div class="writing-space"></div>
      
      <h3>Writing Prompt 2</h3>
      <p class="prompt">Write about your favorite place in Jamaica. Describe what makes it special.</p>
      <div class="writing-space"></div>
      
      <h3>Writing Prompt 3</h3>
      <p class="prompt">If you could have any superpower, what would it be and how would you use it to help others?</p>
      <div class="writing-space"></div>
    `
  } else {
    content = `
      <h3>Practice Questions</h3>
      <p class="instructions">Complete each question carefully.</p>
      <ol class="questions">
        <li>Question 1<div class="work-space"></div></li>
        <li>Question 2<div class="work-space"></div></li>
        <li>Question 3<div class="work-space"></div></li>
        <li>Question 4<div class="work-space"></div></li>
        <li>Question 5<div class="work-space"></div></li>
      </ol>
    `
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${worksheet.title} - Grade 4 PEP</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
          color: #1e293b;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 3px solid ${color};
          padding-bottom: 15px;
          margin-bottom: 25px;
        }
        
        .logo {
          font-size: 18px;
          font-weight: 700;
          color: ${color};
        }
        
        .title {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin-top: 5px;
        }
        
        .student-info {
          text-align: right;
        }
        
        .student-info label {
          font-size: 12px;
          color: #64748b;
          display: block;
        }
        
        .name-line {
          border-bottom: 1px solid #1e293b;
          min-width: 150px;
          display: inline-block;
          margin-top: 5px;
        }
        
        .category-badge {
          display: inline-block;
          background: ${color};
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-right: 10px;
        }
        
        .difficulty-badge {
          display: inline-block;
          background: #e2e8f0;
          color: #475569;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
        }
        
        .instructions {
          font-style: italic;
          color: #64748b;
          margin-bottom: 15px;
        }
        
        h3 {
          color: ${color};
          margin: 25px 0 15px;
          font-size: 16px;
        }
        
        .questions {
          margin-left: 20px;
        }
        
        .questions li {
          margin-bottom: 20px;
          line-height: 1.8;
        }
        
        .write-line {
          border-bottom: 1px solid #cbd5e1;
          height: 35px;
          margin-bottom: 10px;
        }
        
        .math-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px 30px;
          margin-bottom: 20px;
        }
        
        .math-problem {
          font-size: 16px;
          padding: 10px;
          background: #f8fafc;
          border-radius: 5px;
        }
        
        .work-space {
          height: 80px;
          border: 1px dashed #cbd5e1;
          border-radius: 5px;
          margin-top: 10px;
        }
        
        .writing-space {
          height: 150px;
          border: 1px solid #cbd5e1;
          border-radius: 5px;
          margin: 15px 0 25px;
          background: repeating-linear-gradient(
            transparent,
            transparent 27px,
            #e2e8f0 27px,
            #e2e8f0 28px
          );
        }
        
        .prompt {
          background: #fef3c7;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 10px;
          font-weight: 500;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 15px;
          border-top: 1px solid #e2e8f0;
          font-size: 12px;
          color: #64748b;
          text-align: center;
        }
        
        @media print {
          body {
            padding: 20px;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">Grade 4 PEP</div>
          <div class="title">${worksheet.title}</div>
          <div style="margin-top: 10px;">
            <span class="category-badge">${worksheet.category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
            <span class="difficulty-badge">${worksheet.difficulty.charAt(0).toUpperCase() + worksheet.difficulty.slice(1)}</span>
          </div>
        </div>
        <div class="student-info">
          <label>Student Name</label>
          <div class="name-line">${studentName}</div>
          <br><br>
          <label>Date</label>
          <div class="name-line">${new Date().toLocaleDateString()}</div>
        </div>
      </div>
      
      <p style="margin-bottom: 20px;">${worksheet.description}</p>
      
      ${content}
      
      <div class="footer">
        Grade 4 PEP - Jamaica Primary Exit Profile Preparation | www.grade4pep.com
      </div>
      
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `
}

export default function WorksheetsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, isPremium } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const downloadWorksheet = (worksheet: Worksheet) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const html = generateWorksheetHTML(worksheet, user.childName)
    printWindow.document.write(html)
    printWindow.document.close()
  }

  const categoryIcons = {
    "language-arts": BookOpen,
    "mathematics": Calculator,
    "writing": PenTool
  }

  const categoryColors = {
    "language-arts": "bg-sky-100 text-sky-600",
    "mathematics": "bg-amber-100 text-amber-600",
    "writing": "bg-green-100 text-green-600"
  }

  const difficultyColors = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-amber-100 text-amber-700",
    hard: "bg-red-100 text-red-700"
  }

  const categories = [
    { id: "language-arts", label: "Language Arts" },
    { id: "mathematics", label: "Mathematics" },
    { id: "writing", label: "Writing" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-50">
      <SiteHeader />

      <main className="container mx-auto px-4 py-10">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 text-slate-700 hover:text-slate-800 hover:bg-sky-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Printable Worksheets</h1>
            <p className="text-gray-600">Download and print practice worksheets</p>
          </div>
        </div>

        {!isPremium ? (
          <Card className="border-sky-200 max-w-lg mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <Lock className="h-10 w-10 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">
                Worksheets are a Premium Feature
              </h2>
              <p className="text-slate-600 mb-6">
                Upgrade to Premium to access {worksheets.length}+ printable worksheets covering Language Arts, Mathematics, and Writing!
              </p>
              <Link href="/pricing">
                <Button className="bg-amber-500 hover:bg-amber-600">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-10">
            {categories.map((category) => {
              const categoryWorksheets = worksheets.filter(w => w.category === category.id)
              const Icon = categoryIcons[category.id as keyof typeof categoryIcons]

              return (
                <div key={category.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full ${categoryColors[category.id as keyof typeof categoryColors]} flex items-center justify-center`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800">{category.label}</h2>
                    <Badge variant="secondary">{categoryWorksheets.length} worksheets</Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categoryWorksheets.map((worksheet) => (
                      <Card key={worksheet.id} className="border-sky-200 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <Badge className={difficultyColors[worksheet.difficulty]}>
                              {worksheet.difficulty}
                            </Badge>
                            <span className="text-sm text-slate-500">
                              {worksheet.pages} pages
                            </span>
                          </div>
                          <CardTitle className="text-base text-slate-800 mt-2">
                            {worksheet.title}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {worksheet.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button 
                            onClick={() => downloadWorksheet(worksheet)}
                            className="w-full bg-sky-600 hover:bg-sky-700"
                          >
                            <Printer className="h-4 w-4 mr-2" />
                            Print Worksheet
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
