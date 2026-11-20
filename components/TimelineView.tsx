'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Clip = {
  id: string
  clip_code: string
  clip_type: string
  video_url: string | null
  image_url: string | null
  prompt: string | null
  duration_seconds: number | null
}

type Scene = {
  id: string
  scene_number: number
  name: string | null
  clips: Clip[]
}

type Project = {
  id: string
  name: string
  scenes: Scene[]
}

export default function TimelineView({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    async function load() {
      const { data: proj } = await supabase
        .from('projects')
        .select('id, name')
        .eq('id', projectId)
        .single()

      const { data: scenes } = await supabase
        .from('scenes')
        .select(`
          id, scene_number, name,
          clips (id, clip_code, clip_type, video_url, image_url, prompt, duration_seconds, order_in_scene)
        `)
        .eq('project_id', projectId)
        .order('scene_number')

      if (proj && scenes) {
        const sorted = scenes.map(s => ({
          ...s,
          clips: (s.clips || []).sort((a: any, b: any) => a.order_in_scene - b.order_in_scene)
        }))
        setProject({ ...proj, scenes: sorted })
      }
    }
    load()
  }, [projectId])

  if (!project) return <div>Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
      <div className="space-y-6">
        {project.scenes.map(scene => (
          <div key={scene.id} className="border rounded p-4">
            <h2 className="font-semibold">Scene {scene.scene_number}: {scene.name || 'Untitled'}</h2>
            <div className="flex gap-3 mt-3 overflow-x-auto">
              {scene.clips.map(clip => (
                <div key={clip.id} className="border rounded p-3 min-w-[200px]">
                  <div className="font-mono text-sm">{clip.clip_code}</div>
                  <div className="text-xs text-gray-500">{clip.clip_type}</div>
                  {clip.video_url && (
                    <video src={clip.video_url} controls className="w-full mt-2" />
                  )}
                  {clip.image_url && !clip.video_url && (
                    <img src={clip.image_url} alt="" className="w-full mt-2" />
                  )}
                  {clip.video_url && (
                    <a href={clip.video_url} download className="text-blue-600 text-sm block mt-1">
                      Download
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
