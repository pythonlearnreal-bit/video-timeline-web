'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Clip = {
  id: string
  clip_code: string
  clip_type: string
  video_url: string | null
  order_in_scene: number
  duration_seconds: number | null
}

type Scene = {
  id: string
  scene_number: number
  name: string | null
  clips: Clip[]
}

export default function TimelineView({ projectId }: { projectId: string }) {
  const [projectName, setProjectName] = useState('')
  const [scenes, setScenes] = useState<Scene[]>([])

  useEffect(() => {
    async function load() {
      const { data: proj } = await supabase.from('projects').select('name').eq('id', projectId).single()
      if (proj) setProjectName(proj.name)

      const { data } = await supabase
        .from('scenes')
        .select(`id, scene_number, name, clips (id, clip_code, clip_type, video_url, order_in_scene, duration_seconds)`)
        .eq('project_id', projectId)
        .order('scene_number')

      if (data) {
        setScenes(data.map(s => ({
          ...s,
          clips: (s.clips || []).sort((a: any, b: any) => a.order_in_scene - b.order_in_scene)
        })))
      }
    }
    load()
  }, [projectId])

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', background: '#0f0f0f', color: '#eee', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: 8 }}>{projectName}</h1>
      <p style={{ color: '#888', marginBottom: 24 }}>Timeline — แต่ละฉากมีท่อนที่ต่อกันตามลำดับ</p>

      {scenes.map(scene => (
        <div key={scene.id} style={{ marginBottom: 32, border: '1px solid #333', borderRadius: 8, padding: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>
            Scene {scene.scene_number} {scene.name ? `— ${scene.name}` : ''}
          </div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', alignItems: 'flex-start' }}>
            {scene.clips.map((clip, idx) => (
              <div key={clip.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 180, background: '#1a1a1a', borderRadius: 6, padding: 8, flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#aaa' }}>{clip.clip_code}</div>
                  <div style={{ fontSize: 11, color: clip.clip_type === 'original' ? '#4ade80' : '#60a5fa', marginBottom: 6 }}>
                    {clip.clip_type}
                  </div>
                  {clip.video_url ? (
                    <video src={clip.video_url} controls style={{ width: '100%', borderRadius: 4 }} />
                  ) : (
                    <div style={{ height: 100, background: '#222', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#666' }}>
                      No video
                    </div>
                  )}
                  {clip.video_url && (
                    <a href={clip.video_url} download style={{ fontSize: 11, color: '#60a5fa', display: 'block', marginTop: 4 }}>
                      Download
                    </a>
                  )}
                </div>
                {idx < scene.clips.length - 1 && (
                  <div style={{ color: '#555', fontSize: 20 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
