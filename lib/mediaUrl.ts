export function mediaUrl(storagePath: string | null): string {
  if (!storagePath) return ''
  // Convert full storage URL to /api/media?path=...
  const match = storagePath.match(/\/storage\/v1\/object\/(.+)$/)
  const path = match ? match[1] : storagePath
  return `/api/media?path=${encodeURIComponent(path)}`
}
