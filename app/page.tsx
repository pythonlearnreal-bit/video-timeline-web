'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Project = {
  id: string
  name: string
  created_at: string
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    supabase
      .from('projects')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setProjects(data)
      })
  }, [])

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Video Timeline</h1>
      {projects.length === 0 ? (
        <p className="text-gray-500">ยังไม่มี project — agent จะสร้างให้เมื่ออัปโหลดคลิปแรก</p>
      ) : (
        <ul className="space-y-3">
          {projects.map(p => (
            <li key={p.id}>
              <Link href={`/project/${p.id}`} className="text-blue-600 hover:underline">
                {p.name}
              </Link>
              <span className="text-xs text-gray-400 ml-2">
                {new Date(p.created_at).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
