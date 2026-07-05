import { sheets } from '../data/sheets'
import { getQuestionsBySheet, totalQuestionCount } from '../data/questions'
import { SheetCard } from '../components/UI'

export default function SheetsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-widest text-indigo-400">All Sheets</p>
      <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">SQL Interview Question Sheets</h1>
      <p className="mt-4 max-w-2xl text-zinc-400">
        {totalQuestionCount}+ questions organized by topic. Best for 2–3 months of SQL interview prep.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {sheets.map((sheet) => (
          <SheetCard key={sheet.slug} {...sheet} count={getQuestionsBySheet(sheet.slug).length} />
        ))}
      </div>
    </div>
  )
}
