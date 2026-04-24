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
  BookMarked, 
  Crown, 
  Download, 
  ArrowLeft,
  BookOpen,
  Calculator,
  PenTool,
  ClipboardList,
  Lock,
  Star
} from "lucide-react"

interface StudyGuide {
  id: string
  title: string
  description: string
  category: string
  topics: string[]
  pages: number
}

const studyGuides: StudyGuide[] = [
  {
    id: "literacy-complete",
    title: "Complete Literacy Study Guide",
    description: "Everything you need to know for the Literacy component of PEP",
    category: "Language Arts",
    topics: ["Grammar", "Reading Comprehension", "Vocabulary", "Punctuation", "Writing"],
    pages: 25
  },
  {
    id: "numeracy-complete",
    title: "Complete Numeracy Study Guide",
    description: "Master all math concepts tested on the PEP examination",
    category: "Mathematics",
    topics: ["Number Operations", "Fractions", "Geometry", "Measurement", "Data & Statistics"],
    pages: 30
  },
  {
    id: "performance-task-guide",
    title: "Performance Task Strategy Guide",
    description: "Learn how to excel at Performance Tasks with step-by-step strategies",
    category: "Performance Tasks",
    topics: ["Reading Sources", "Writing Responses", "Time Management", "Rubric Understanding"],
    pages: 15
  },
  {
    id: "grammar-essentials",
    title: "Grammar Essentials",
    description: "Quick reference guide for all grammar rules",
    category: "Language Arts",
    topics: ["Nouns", "Verbs", "Adjectives", "Adverbs", "Sentence Structure"],
    pages: 12
  },
  {
    id: "math-formulas",
    title: "Math Formulas & Tips",
    description: "Essential formulas and problem-solving strategies",
    category: "Mathematics",
    topics: ["Area & Perimeter", "Fractions", "Decimals", "Word Problem Strategies"],
    pages: 10
  },
  {
    id: "exam-tips",
    title: "PEP Exam Day Guide",
    description: "Tips and strategies for exam day success",
    category: "General",
    topics: ["Time Management", "Question Reading", "Answer Checking", "Stress Management"],
    pages: 8
  },
]

const generateStudyGuideHTML = (guide: StudyGuide, studentName: string, subscriptionTier: string) => {
  const categoryColors: Record<string, string> = {
    "Language Arts": "#0ea5e9",
    "Mathematics": "#f59e0b",
    "Performance Tasks": "#22c55e",
    "General": "#8b5cf6"
  }
  
  const color = categoryColors[guide.category] || "#64748b"

  // Generate content based on guide type
  let content = ""
  
  if (guide.id === "literacy-complete") {
    content = `
      <div class="chapter">
        <h2>Chapter 1: Grammar Fundamentals</h2>
        
        <h3>1.1 Parts of Speech</h3>
        <p>Understanding the eight parts of speech is essential for Grade 4 PEP success:</p>
        
        <div class="concept-box">
          <h4>Nouns</h4>
          <p>A noun is a word that names a person, place, thing, or idea.</p>
          <ul>
            <li><strong>Common nouns:</strong> dog, school, river (not capitalized)</li>
            <li><strong>Proper nouns:</strong> Jamaica, Kingston, Marcus (always capitalized)</li>
            <li><strong>Collective nouns:</strong> team, family, class (groups)</li>
          </ul>
          <div class="example">
            <strong>Example:</strong> The <u>children</u> visited <u>Kingston</u> with their <u>family</u>.
          </div>
        </div>
        
        <div class="concept-box">
          <h4>Verbs</h4>
          <p>Verbs show action or state of being.</p>
          <ul>
            <li><strong>Action verbs:</strong> run, jump, write, sing</li>
            <li><strong>Linking verbs:</strong> is, are, was, were, seems</li>
          </ul>
          <div class="tip-box">
            <strong>Tip:</strong> To find the verb, ask "What is happening?" or "What is the subject doing?"
          </div>
        </div>
        
        <h3>1.2 Verb Tenses</h3>
        <table class="tense-table">
          <tr>
            <th>Tense</th>
            <th>Example</th>
            <th>When to Use</th>
          </tr>
          <tr>
            <td>Present</td>
            <td>I <strong>walk</strong></td>
            <td>Actions happening now or regularly</td>
          </tr>
          <tr>
            <td>Past</td>
            <td>I <strong>walked</strong></td>
            <td>Actions that already happened</td>
          </tr>
          <tr>
            <td>Future</td>
            <td>I <strong>will walk</strong></td>
            <td>Actions that will happen</td>
          </tr>
        </table>
      </div>
      
      <div class="chapter">
        <h2>Chapter 2: Reading Comprehension</h2>
        
        <h3>2.1 Reading Strategies</h3>
        <div class="strategy-list">
          <div class="strategy">
            <span class="number">1</span>
            <div>
              <h4>Preview the Text</h4>
              <p>Before reading, look at the title, headings, and any pictures. This helps you predict what the text is about.</p>
            </div>
          </div>
          <div class="strategy">
            <span class="number">2</span>
            <div>
              <h4>Read the Questions First</h4>
              <p>Know what you're looking for before you read. This helps you focus on important information.</p>
            </div>
          </div>
          <div class="strategy">
            <span class="number">3</span>
            <div>
              <h4>Look for Key Words</h4>
              <p>Circle or underline important words that help answer the questions.</p>
            </div>
          </div>
        </div>
        
        <h3>2.2 Types of Questions</h3>
        <ul>
          <li><strong>Literal:</strong> The answer is directly stated in the text</li>
          <li><strong>Inferential:</strong> You must "read between the lines"</li>
          <li><strong>Evaluative:</strong> You give your opinion based on the text</li>
        </ul>
      </div>
      
      <div class="practice-section">
        <h2>Practice Questions</h2>
        <p>Test your understanding with these sample questions:</p>
        <ol>
          <li>Identify all the nouns in this sentence: "The teacher gave books to the students in Kingston."</li>
          <li>Change this sentence to past tense: "Maria walks to school every day."</li>
          <li>What type of noun is "Blue Mountains"? Explain your answer.</li>
        </ol>
      </div>
    `
  } else if (guide.id === "numeracy-complete") {
    content = `
      <div class="chapter">
        <h2>Chapter 1: Number Operations</h2>
        
        <h3>1.1 Place Value</h3>
        <p>Understanding place value is the foundation of mathematics:</p>
        
        <div class="concept-box">
          <table class="place-value-table">
            <tr>
              <th>Thousands</th>
              <th>Hundreds</th>
              <th>Tens</th>
              <th>Ones</th>
            </tr>
            <tr>
              <td>1,000</td>
              <td>100</td>
              <td>10</td>
              <td>1</td>
            </tr>
          </table>
          <div class="example">
            <strong>Example:</strong> In 3,456: 3 is in the thousands place, 4 is in the hundreds place, 5 is in the tens place, 6 is in the ones place.
          </div>
        </div>
        
        <h3>1.2 Addition Strategies</h3>
        <div class="method-box">
          <h4>Column Addition</h4>
          <p>Line up the numbers by place value and add from right to left.</p>
          <pre class="math-example">
    345
  + 267
  -----
    612
          </pre>
          <div class="tip-box">
            <strong>Remember:</strong> When a column adds up to 10 or more, carry the tens digit to the next column.
          </div>
        </div>
        
        <h3>1.3 Subtraction Strategies</h3>
        <div class="method-box">
          <h4>Borrowing (Regrouping)</h4>
          <p>When you can't subtract a larger digit from a smaller one, borrow from the next column.</p>
          <pre class="math-example">
    5 12
    612
  - 345
  -----
    267
          </pre>
        </div>
      </div>
      
      <div class="chapter">
        <h2>Chapter 2: Fractions</h2>
        
        <h3>2.1 Understanding Fractions</h3>
        <div class="concept-box">
          <p>A fraction represents parts of a whole.</p>
          <div class="fraction-diagram">
            <span class="numerator">Numerator</span> = How many parts you have<br>
            <span class="denominator">Denominator</span> = How many equal parts in the whole
          </div>
        </div>
        
        <h3>2.2 Comparing Fractions</h3>
        <ul>
          <li>Same denominator: Compare numerators (larger numerator = larger fraction)</li>
          <li>Same numerator: Compare denominators (smaller denominator = larger fraction)</li>
        </ul>
        
        <div class="example">
          <strong>Example:</strong> 3/4 > 1/4 (same denominator, 3 > 1)
        </div>
      </div>
      
      <div class="formula-box">
        <h2>Key Formulas</h2>
        <table>
          <tr>
            <td><strong>Perimeter of Rectangle</strong></td>
            <td>P = 2 × (length + width)</td>
          </tr>
          <tr>
            <td><strong>Area of Rectangle</strong></td>
            <td>A = length × width</td>
          </tr>
          <tr>
            <td><strong>Perimeter of Square</strong></td>
            <td>P = 4 × side</td>
          </tr>
          <tr>
            <td><strong>Area of Square</strong></td>
            <td>A = side × side</td>
          </tr>
        </table>
      </div>
    `
  } else {
    content = `
      <div class="chapter">
        <h2>Overview</h2>
        <p>This study guide covers essential concepts for ${guide.category}.</p>
        
        <h3>Topics Covered</h3>
        <ul>
          ${guide.topics.map(topic => `<li>${topic}</li>`).join('')}
        </ul>
        
        <div class="tip-box">
          <strong>Study Tip:</strong> Review this guide regularly and practice the concepts with worksheets and quizzes available in your account.
        </div>
      </div>
      
      <div class="chapter">
        <h2>Key Concepts</h2>
        <p>Focus on understanding these fundamental ideas to succeed on the PEP examination.</p>
        
        <div class="concept-box">
          <h4>Concept 1</h4>
          <p>Description of the first key concept with examples and explanations.</p>
        </div>
        
        <div class="concept-box">
          <h4>Concept 2</h4>
          <p>Description of the second key concept with examples and explanations.</p>
        </div>
      </div>
      
      <div class="practice-section">
        <h2>Practice Activities</h2>
        <p>Apply what you've learned with these practice activities.</p>
      </div>
    `
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${guide.title} - Grade 4 PEP</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Merriweather:wght@400;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          color: #1e293b;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
        }
        
        .cover {
          text-align: center;
          padding: 60px 40px;
          background: linear-gradient(135deg, ${color}15 0%, ${color}05 100%);
          border: 3px solid ${color};
          border-radius: 10px;
          margin-bottom: 40px;
        }
        
        .cover-logo {
          font-size: 24px;
          font-weight: 700;
          color: ${color};
          margin-bottom: 30px;
        }
        
        .cover-title {
          font-family: 'Merriweather', serif;
          font-size: 32px;
          color: #1e293b;
          margin-bottom: 20px;
        }
        
        .cover-description {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 30px;
        }
        
        .cover-meta {
          font-size: 14px;
          color: #94a3b8;
        }
        
        .toc {
          margin-bottom: 40px;
          padding: 30px;
          background: #f8fafc;
          border-radius: 10px;
        }
        
        .toc h2 {
          color: ${color};
          margin-bottom: 20px;
        }
        
        .toc ul {
          list-style: none;
        }
        
        .toc li {
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .chapter {
          margin-bottom: 40px;
          page-break-inside: avoid;
        }
        
        h2 {
          font-family: 'Merriweather', serif;
          font-size: 24px;
          color: ${color};
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid ${color};
        }
        
        h3 {
          font-size: 18px;
          color: #334155;
          margin: 25px 0 15px;
        }
        
        h4 {
          font-size: 16px;
          color: #475569;
          margin-bottom: 10px;
        }
        
        p {
          margin-bottom: 15px;
        }
        
        ul, ol {
          margin-left: 25px;
          margin-bottom: 15px;
        }
        
        li {
          margin-bottom: 8px;
        }
        
        .concept-box {
          background: #f8fafc;
          border-left: 4px solid ${color};
          padding: 20px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
        
        .tip-box {
          background: #fef3c7;
          border: 1px solid #fbbf24;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
        }
        
        .example {
          background: #ecfdf5;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
        }
        
        .method-box {
          background: white;
          border: 1px solid #e2e8f0;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        .math-example {
          font-family: monospace;
          font-size: 18px;
          background: #f1f5f9;
          padding: 15px;
          border-radius: 5px;
          margin: 15px 0;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        
        th, td {
          border: 1px solid #e2e8f0;
          padding: 12px;
          text-align: left;
        }
        
        th {
          background: ${color};
          color: white;
        }
        
        .strategy-list {
          margin: 20px 0;
        }
        
        .strategy {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          padding: 15px;
          background: #f8fafc;
          border-radius: 8px;
        }
        
        .strategy .number {
          width: 30px;
          height: 30px;
          background: ${color};
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }
        
        .formula-box {
          background: #1e293b;
          color: white;
          padding: 30px;
          border-radius: 10px;
          margin: 30px 0;
        }
        
        .formula-box h2 {
          color: white;
          border-bottom-color: white;
        }
        
        .formula-box table {
          color: white;
        }
        
        .formula-box th {
          background: #334155;
        }
        
        .formula-box td {
          border-color: #475569;
        }
        
        .practice-section {
          background: #f0fdf4;
          padding: 30px;
          border-radius: 10px;
          margin: 30px 0;
        }
        
        .practice-section h2 {
          color: #16a34a;
          border-bottom-color: #16a34a;
        }
        
        .footer {
          text-align: center;
          padding: 30px;
          color: #94a3b8;
          font-size: 12px;
          border-top: 1px solid #e2e8f0;
          margin-top: 40px;
        }
        
        @media print {
          body {
            padding: 20px;
          }
          .cover {
            page-break-after: always;
          }
          .chapter {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="cover">
        <div class="cover-logo">Grade 4 PEP</div>
        <h1 class="cover-title">${guide.title}</h1>
        <p class="cover-description">${guide.description}</p>
        <div class="cover-meta">
          <strong>Student:</strong> ${studentName}<br>
          <strong>Pages:</strong> ${guide.pages} | <strong>Category:</strong> ${guide.category}<br>
          <strong>Subscription:</strong> ${subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} Member
        </div>
      </div>
      
      <div class="toc">
        <h2>Topics Covered</h2>
        <ul>
          ${guide.topics.map(topic => `<li>${topic}</li>`).join('')}
        </ul>
      </div>
      
      ${content}
      
      <div class="footer">
        <p>Grade 4 PEP Study Guide | ${guide.title}</p>
        <p>Jamaica Primary Exit Profile Preparation</p>
        <p>© ${new Date().getFullYear()} Grade 4 PEP. All rights reserved.</p>
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

export default function StudyGuidesPage() {
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

  const isYearly = user.subscriptionTier === "yearly"

  const downloadGuide = (guide: StudyGuide) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const html = generateStudyGuideHTML(guide, user.childName, user.subscriptionTier)
    printWindow.document.write(html)
    printWindow.document.close()
  }

  const categoryIcons: Record<string, typeof BookOpen> = {
    "Language Arts": BookOpen,
    "Mathematics": Calculator,
    "Performance Tasks": ClipboardList,
    "General": Star
  }

  const categoryColors: Record<string, string> = {
    "Language Arts": "bg-sky-100 text-sky-600",
    "Mathematics": "bg-amber-100 text-amber-600",
    "Performance Tasks": "bg-green-100 text-green-600",
    "General": "bg-purple-100 text-purple-600"
  }

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
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
            <BookMarked className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Study Guides</h1>
            <p className="text-gray-600">Comprehensive guides to help you prepare for PEP</p>
          </div>
          {isYearly && (
            <Badge className="bg-amber-100 text-amber-700 border-amber-300 ml-auto">
              <Star className="h-3 w-3 mr-1" />
              Yearly Exclusive
            </Badge>
          )}
        </div>

        {!isYearly ? (
          <Card className="border-sky-200 max-w-lg mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <Lock className="h-10 w-10 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">
                Study Guides are a Yearly Exclusive
              </h2>
              <p className="text-slate-600 mb-6">
                Upgrade to the Yearly plan to access {studyGuides.length} comprehensive study guides covering all PEP topics!
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-amber-700 text-sm">
                  <strong>Yearly Plan Benefits:</strong> Study guides + 2 months FREE + Family account + Priority support
                </p>
              </div>
              <Link href="/pricing">
                <Button className="bg-amber-500 hover:bg-amber-600">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Yearly
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studyGuides.map((guide) => {
              const Icon = categoryIcons[guide.category] || BookMarked
              const colorClass = categoryColors[guide.category] || "bg-slate-100 text-slate-600"

              return (
                <Card key={guide.id} className="border-sky-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary">
                        {guide.pages} pages
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-slate-800 mt-3">
                      {guide.title}
                    </CardTitle>
                    <CardDescription>
                      {guide.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 mb-2">Topics covered:</p>
                      <div className="flex flex-wrap gap-1">
                        {guide.topics.slice(0, 3).map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {guide.topics.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{guide.topics.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button 
                      onClick={() => downloadGuide(guide)}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Guide
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
