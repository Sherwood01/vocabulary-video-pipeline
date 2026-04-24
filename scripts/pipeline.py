#!/usr/bin/env python3
"""
Word Video Full Pipeline CLI
Usage: python scripts/pipeline.py --word hello
"""
import argparse
import subprocess
import sys
import platform
import json
import re
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.resolve()

# On Windows, npx is npx.cmd
NPX_CMD = "npx.cmd" if platform.system() == "Windows" else "npx"


def calculate_total_frames(scenes: list[dict], default: int = 300) -> int:
    """Calculate total frames from scenes beats data."""
    total = 0
    for scene in scenes:
        beats = scene.get("beats", [])
        if beats:
            first_start = beats[0].get("startFrame", 0)
            last_end = beats[-1].get("endFrame", 0)
            scene_duration = last_end - first_start + 60
            total += max(scene_duration, 300)
    return max(default, total)


def register_word_in_root(word: str, project_root: Path, total_frames: int) -> bool:
    """Create entry component and register Composition in Root.tsx. Returns True on success."""
    word_cap = word.capitalize()
    composition_id = f"{word_cap}WordVideo"
    entry_path = project_root / "src" / f"{word_cap}WordVideo.tsx"
    root_path = project_root / "src" / "Root.tsx"

    # 1. Create entry component if not exists
    if not entry_path.exists():
        template = f'''import React from "react";
import {{ WordVideoPlayer }} from "./pipeline/player";
import {word}Config from "../data/{word}-draft-with-beats.json";
import type {{ WordConfig }} from "./pipeline/types";

export const {word_cap}WordVideo: React.FC = () => {{
  return <WordVideoPlayer config={{{word}Config as WordConfig}} />;
}};
'''
        entry_path.write_text(template, encoding="utf-8")
        print(f"  Created entry component: {entry_path.name}")

    # 2. Register in Root.tsx
    content = root_path.read_text(encoding="utf-8")
    changed = False

    # Add import if not present
    import_line = f'import {{ {word_cap}WordVideo }} from "./{word_cap}WordVideo";'
    if import_line not in content:
        import_lines = [
            line for line in content.split('\n')
            if (line.strip().startswith('import ') or line.strip().startswith('import type '))
            and 'from "./' in line
        ]
        if import_lines:
            last_import = import_lines[-1]
            content = content.replace(last_import, last_import + "\n" + import_line)
            changed = True
            print(f"  Added import: {import_line.strip()}")

    # Check specifically for <Composition id="CometWordVideo" pattern, not just the string
    comp_pattern = rf'<Composition\s+id="{re.escape(composition_id)}"'
    has_composition = bool(re.search(comp_pattern, content))

    if has_composition:
        # Update durationInFrames
        dur_pattern = rf'(<Composition\s+id="{re.escape(composition_id)}"[^>]*durationInFrames={{)(\d+)(}}[^>]*>)'
        match = re.search(dur_pattern, content)
        if match and int(match.group(2)) != total_frames:
            content = re.sub(dur_pattern, rf'\g<1>{total_frames}\g<3>', content)
            changed = True
            print(f"  Updated durationInFrames: {match.group(2)} -> {total_frames}")
    else:
        new_comp = f'''      <Composition
        id="{composition_id}"
        component={{{composition_id}}}
        durationInFrames={{{total_frames}}}
        fps={{30}}
        width={{1920}}
        height={{1080}}
      />
'''
        if "    </>" in content:
            content = content.replace("    </>", f"{new_comp}    </>")
            changed = True
            print(f"  Registered Composition: {composition_id} ({total_frames} frames)")

    if changed:
        root_path.write_text(content, encoding="utf-8")
        # Verify
        verify = root_path.read_text(encoding="utf-8")
        if composition_id in verify:
            print(f"  SUCCESS: {composition_id} is registered in Root.tsx")
            return True
        else:
            print(f"  FAILURE: {composition_id} NOT found after write!", file=sys.stderr)
            return False
    else:
        print(f"  Already registered: {composition_id}")
        return True


def run_step(name: str, cmd: list[str], cwd: Path = PROJECT_ROOT):
    """Run a command and return success status."""
    print(f"\n{'='*50}")
    print(f"Step: {name}")
    print(f"Command: {' '.join(cmd)}")
    print('='*50)
    # On Windows, convert to string and use shell=True for proper command resolution
    if platform.system() == "Windows":
        cmd_str = subprocess.list2cmdline(cmd)
        result = subprocess.run(cmd_str, cwd=cwd, shell=True)
    else:
        result = subprocess.run(cmd, cwd=cwd)
    if result.returncode != 0:
        print(f"ERROR: {name} failed with code {result.returncode}", file=sys.stderr)
        return False
    print(f"SUCCESS: {name} completed")
    return True


def main():
    parser = argparse.ArgumentParser(description="Word Video Full Pipeline")
    parser.add_argument("--word", required=True, help="Target word, e.g. hello")
    parser.add_argument("--skip-render", action="store_true", help="Skip the final render step")
    args = parser.parse_args()

    word = args.word.strip().lower()
    if not word:
        print("ERROR: --word cannot be empty", file=sys.stderr)
        sys.exit(1)

    print(f"\n{'#'*60}")
    print(f"# Word Video Pipeline for: {word}")
    print(f"{'#'*60}")

    # Step 1: Generate draft with diagnose_word.py
    success = run_step(
        "Step 1: Diagnose word & generate draft",
        ["py", "scripts/diagnose_word.py", "--word", word]
    )
    if not success:
        sys.exit(1)

    draft_path = PROJECT_ROOT / "data" / f"{word}-draft.json"
    if not draft_path.exists():
        print(f"ERROR: Draft not generated: {draft_path}", file=sys.stderr)
        sys.exit(1)

    # Step 2: Generate audio and beats
    success = run_step(
        "Step 2: Generate TTS audio & beats",
        ["py", "scripts/generate_audio_beats.py", "--input", str(draft_path)]
    )
    if not success:
        sys.exit(1)

    # Step 3: Director signoff validation
    draft_with_beats_path = PROJECT_ROOT / "data" / f"{word}-draft-with-beats.json"
    if draft_with_beats_path.exists():
        print(f"\n{'='*50}")
        print("Step 3: Director signoff validation")
        print('='*50)
        result = subprocess.run(
            ["py", "scripts/director_validate.py", "--input", str(draft_with_beats_path)],
            cwd=PROJECT_ROOT,
        )
        if result.returncode != 0:
            print("❌ Director signoff FAILED. Pipeline aborted.", file=sys.stderr)
            sys.exit(1)
        print("✅ Director signoff PASSED.")
    else:
        print(f"\n⚠️  {draft_with_beats_path} not found, skipping Director validation")

    # Step 4: Register composition in Root.tsx (before render)
    print(f"\n{'='*50}")
    print("Step 4: Register WordVideo in Root.tsx")
    print('='*50)

    draft_with_beats_path = PROJECT_ROOT / "data" / f"{word}-draft-with-beats.json"
    if draft_with_beats_path.exists():
        draft_config = json.loads(draft_with_beats_path.read_text(encoding="utf-8"))
    else:
        draft_config = json.loads(draft_path.read_text(encoding="utf-8"))

    total_frames = calculate_total_frames(draft_config.get("scenes", []))
    registered = register_word_in_root(word, PROJECT_ROOT, total_frames)
    if not registered:
        print("ERROR: Failed to register composition in Root.tsx", file=sys.stderr)
        sys.exit(1)

    # Validate audio files before render
    print(f"\n{'='*50}")
    print("Step 4b: Validate audio assets")
    print('='*50)
    audio_prefix = draft_config.get("audioPrefix", f"{word}-audio-v1")
    audio_dir = PROJECT_ROOT / "public" / audio_prefix
    scenes = draft_config.get("scenes", [])
    missing_files = []
    for i in range(1, len(scenes) + 1):
        mp3 = audio_dir / f"scene{i}.mp3"
        beats = audio_dir / f"scene{i}-beats.json"
        if not mp3.exists():
            missing_files.append(str(mp3.relative_to(PROJECT_ROOT)))
        if not beats.exists():
            missing_files.append(str(beats.relative_to(PROJECT_ROOT)))
    if missing_files:
        print(f"ERROR: Missing {len(missing_files)} required asset file(s):", file=sys.stderr)
        for f in missing_files:
            print(f"  - {f}", file=sys.stderr)
        print("Run 'py scripts/generate_audio_beats.py --input data/" + word + "-draft.json' to regenerate.", file=sys.stderr)
        sys.exit(1)
    print(f"Validated {len(scenes)} scenes, all audio files present.")

    # Step 5: Render video
    if args.skip_render:
        print(f"\n{'='*50}")
        print("Step 5: Render skipped (--skip-render)")
        print('='*50)
    else:
        word_cap = word.capitalize()
        video_output = PROJECT_ROOT / "renders" / f"{word}-word-video.mp4"
        success = run_step(
            "Step 5: Render video",
            [NPX_CMD, "remotion", "render", f"{word_cap}WordVideo", str(video_output), "--cache=never"]
        )
        if not success:
            sys.exit(1)

    print(f"\n{'#'*60}")
    print(f"# Pipeline completed for: {word}")
    print(f"{'#'*60}")
    print(f"\nVideo saved to: renders/{word}-word-video.mp4")


if __name__ == "__main__":
    main()
