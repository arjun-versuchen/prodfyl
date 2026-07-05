import { useParams } from 'react-router-dom'
import { ComingSoonPage, OfflinePage } from './ErrorPages'
import { useOnlineStatus } from '../../../hooks/useOnlineStatus'

export default function ComingSoonRoute() {
  const { pathSlug } = useParams()
  const online = useOnlineStatus()

  if (!online) return <OfflinePage />
  return <ComingSoonPage pathSlug={pathSlug} />
}
