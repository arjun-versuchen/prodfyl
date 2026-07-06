import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '../../components/SEO'
import { ProjectCard } from '../../components/UI'
import { projects, totalProjectCount } from '../../data/projects'
import { isPremiumProject } from '../../lib/access'
import { useAuth } from '../../contexts/AuthContext'
import { tokens } from '../../lib/design-tokens'

export default function ProjectsModuleHome() {
  const { isPremium } = useAuth()

  return (
    <>
      <SEO
        title="Data Engineering Projects"
        description="Portfolio-ready data engineering project walkthroughs — batch ETL, streaming, lakehouse, Azure, and fraud detection pipelines with interview talking points."
        path="/learn/projects"
      />

      <div>
        <p className="text-sm text-muted">Learning Path</p>
        <h1 className="mt-2 text-3xl font-bold">Project Walkthroughs</h1>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted">
          End-to-end data engineering projects you can build, explain, and put on your resume. Each walkthrough covers
          architecture, pipeline design, data quality, and how to present the project in interviews — not just a GitHub
          README.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted">
          <span className="rounded-full border border-border px-3 py-1">{totalProjectCount} projects</span>
          <span className="rounded-full border border-border px-3 py-1">Architecture diagrams</span>
          <span className="rounded-full border border-border px-3 py-1">Interview Q&amp;A</span>
          <span className="rounded-full border border-border px-3 py-1">Resume bullets</span>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <ProjectCard
                slug={project.slug}
                title={project.title}
                description={project.description}
                icon={project.icon}
                color={project.color}
                difficulty={project.difficulty}
                duration={project.duration}
                accessTier={project.accessTier}
                locked={isPremiumProject(project.slug) && !isPremium}
              />
            </motion.div>
          ))}
        </div>

        {!isPremium && (
          <div className={`${tokens.card} mt-10 p-6`}>
            <h2 className="text-lg font-semibold">Unlock all project walkthroughs</h2>
            <p className="mt-2 text-sm text-muted">
              Free access includes the E-Commerce Analytics pipeline. Premium unlocks lakehouse, Azure ADF, fraud
              detection, and full streaming walkthroughs with resume bullets and interview questions.
            </p>
            <Link to="/pricing" className={`${tokens.btnPrimary} mt-4 inline-flex`}>
              View Premium Plans
            </Link>
          </div>
        )}

        <div className={`${tokens.card} mt-8 p-6`}>
          <h2 className="text-lg font-semibold">How to use these projects</h2>
          <ol className="mt-4 space-y-3 text-sm text-muted">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                1
              </span>
              <span>Read the walkthrough and sketch the architecture on paper — interviewers love whiteboard flows.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                2
              </span>
              <span>Pick one project and implement a simplified version (even locally) to speak from experience.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                3
              </span>
              <span>Use the resume bullets and interview questions to rehearse a 2-minute project pitch.</span>
            </li>
          </ol>
        </div>
      </div>
    </>
  )
}
