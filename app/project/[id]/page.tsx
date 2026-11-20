import TimelineView from '@/components/TimelineView'

export default function ProjectPage({ params }: { params: { id: string } }) {
  return <TimelineView projectId={params.id} />
}
