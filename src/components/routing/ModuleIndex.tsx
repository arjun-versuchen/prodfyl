import { useParams } from 'react-router-dom'
import { NotFoundPage } from '../../modules/marketing/errors/ErrorPages'
import { isQuestionModule } from '../../data/questionModules'
import ModuleHome from '../../modules/learn/ModuleHome'
import ProjectsModuleHome from '../../modules/projects/ProjectsModuleHome'

export default function ModuleIndex() {
  const { pathSlug = '' } = useParams()

  if (isQuestionModule(pathSlug)) return <ModuleHome />
  if (pathSlug === 'projects') return <ProjectsModuleHome />

  return <NotFoundPage />
}
