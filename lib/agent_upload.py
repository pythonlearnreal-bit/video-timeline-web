# Agent Upload Helper

ใช้ service role key อัปโหลดไฟล์ที่เจนเสร็จเข้า Supabase แล้วบันทึก timeline

```python
import os
from supabase import create_client

supabase = create_client(
    os.environ["NEXT_PUBLIC_SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_ROLE_KEY"]
)

def upload_clip(project_id, scene_number, clip_code, clip_type, file_path, prompt=""):
    # Upload to storage
    with open(file_path, "rb") as f:
        res = supabase.storage.from_("video-assets").upload(
            f"{project_id}/{clip_code}.mp4", f, {"upsert": True}
        )
    public_url = supabase.storage.from_("video-assets").get_public_url(
        f"{project_id}/{clip_code}.mp4"
    )

    # Find or create scene
    scene = supabase.table("scenes").select("id").eq("project_id", project_id).eq("scene_number", scene_number).single().execute()
    if not scene.data:
        scene = supabase.table("scenes").insert({
            "project_id": project_id,
            "scene_number": scene_number,
            "name": f"Scene {scene_number}"
        }).execute()
    scene_id = scene.data["id"] if isinstance(scene.data, dict) else scene.data[0]["id"]

    # Insert clip
    supabase.table("clips").insert({
        "scene_id": scene_id,
        "clip_code": clip_code,
        "clip_type": clip_type,
        "order_in_scene": 1 if clip_type == "original" else 2,
        "video_url": public_url,
        "prompt": prompt
    }).execute()

    return public_url
```
