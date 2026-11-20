'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { mediaUrl } from '@/lib/mediaUrl'

type Clip = {
  clip_code: string
  video_url: string | null
  order_in_scene: number
}

export default function PreviewPage({ params }: { params: { id: string; scene: string } }) {
  const [clips, setClips] = useState<Clip[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    supabase
      .from('clips')
      .select('clip_code, video_url, order_in_scene, scenes!inner(scene_number)')
      .eq('scenes.scene_number', params.scene)
      .order('order_in_scene')
      .then(({ data }) => {
        if (data) setClips(data as Clip[])
      })
  }, [params.scene])

  if (clips.length === 0) return <div style={{ padding: 40, color: '#eee', background: '#0f0f0f', minHeight: '100vh' }}>Loading...</div>

  const playNext = () => {
    if (current < clips.length - 1) setCurrent(current + 1)
  }

  return (
    <div style={{ padding: 24, background: '#0f0f0f', color: '#eee', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <h1>Scene {params.scene} — Continuous Preview</h1>
      <p style={{ color: '#888' }}>เล่นต่อเนื่องอัตโนมัติเมื่อคลิปจบ</p>
      <video
        key={current}
        src={mediaUrl(clips[current].video_url)}
        controls
        autoPlay
        onEnded={playNext}
        style={{ width: '100%', maxWidth: 480, borderRadius: 8, marginTop: 16 }}
      />
      <div style={{ marginTop: 12, fontSize: 14 }}>
        กำลังเล่น: <strong>{clips[current].clip_code}</strong> ({current + 1}/{clips.length})
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        {clips.map((c, i) => (
          <button
            key={c.clip_code}
            onClick={() => setCurrent(i)}
            style={{
              padding: '6px 12px',
              background: i === current ? '#3b82f6' : '#333',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            {c.clip_code}
          </button>
        ))}
      </div>
    </div>
  )
}
