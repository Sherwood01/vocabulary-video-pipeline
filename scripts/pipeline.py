#!/usr/bin/env python3
"""
Word Video Full Pipeline CLI
Usage: python scripts/pipeline.py --word hello
"""
import argparse
import subprocess
import sys
import platform
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent.resolve()

# On Windows, npx is npx.cmd
NPX_CMD = "npx.cmd" if platform.system() == "Windows" else "npx"


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

    # Step 3: Render video
    if args.skip_render:
        print(f"\n{'='*50}")
        print("Step 3: Render skipped (--skip-render)")
        print('='*50)
    else:
        word_cap = word.capitalize()
        video_output = PROJECT_ROOT / "renders" / f"{word}-word-video.mp4"
        success = run_step(
            "Step 3: Render video",
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
