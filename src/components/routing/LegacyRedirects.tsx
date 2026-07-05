import { Navigate, useParams } from 'react-router-dom'

export function LegacySheetRedirect() {
  const { slug = '' } = useParams()
  return <Navigate to={`/learn/sql/sheet/${slug}`} replace />
}

export function LegacyQuestionRedirect() {
  const { id = '' } = useParams()
  return <Navigate to={`/learn/sql/question/${id}`} replace />
}

export function LegacySheetsRedirect() {
  return <Navigate to="/learn/sql" replace />
}
