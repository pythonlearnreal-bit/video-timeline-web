# Video Timeline Manager

Web app สำหรับจัดการ project วิดีโอ NSFW ที่เจนจาก HotAPI

## Features
- Timeline แสดงฉากและท่อนชัดเจน (S1-C1, S1-C2, ...)
- ดาวน์โหลดคลิปได้จากเว็บ
- Agent อัปโหลดไฟล์ + อัปเดต timeline ด้วย Supabase key

## Setup
1. สร้าง Supabase project
2. รัน `supabase/schema.sql`
3. สร้าง Storage bucket `video-assets`
4. ใส่ env:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (สำหรับ agent)

## Agent Integration
Agent ใช้ service role key อัปโหลดไฟล์ไป Storage แล้ว insert ลงตาราง `clips` พร้อม `clip_code` อ้างอิง
