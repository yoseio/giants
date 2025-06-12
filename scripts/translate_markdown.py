#!/usr/bin/env python3
import sys
import os
import asyncio

import openai
from markdown_it import MarkdownIt
from tqdm.asyncio import tqdm

MAX_CONCURRENT_REQUESTS = 5


SYSTEM_PROMPT = (
    "Translate the following Markdown paragraph to Japanese. "
    "Only translate the prose and leave any headings, images, formulas, or code unchanged."
)

async def translate_paragraph(client: openai.AsyncOpenAI, text: str) -> str:
    response = await client.chat.completions.create(
        model="gpt-4.1",
        messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": text}],
    )
    return response.choices[0].message.content.strip()


async def translate_file(path: str) -> None:
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    text = "".join(lines)
    md = MarkdownIt()
    tokens = md.parse(text)

    api_key = os.environ["OPENAI_API_KEY"]
    client = openai.AsyncOpenAI(api_key=api_key)

    paragraphs: list[str] = []
    positions: list[tuple[int, int]] = []
    for token in tokens:
        if token.type == "paragraph_open" and token.map:
            start, end = token.map
            paragraphs.append("".join(lines[start:end]).rstrip("\n"))
            positions.append((start, end))

    semaphore = asyncio.Semaphore(MAX_CONCURRENT_REQUESTS)

    async def sem_translate(idx: int, para: str) -> tuple[int, str]:
        async with semaphore:
            result = await translate_paragraph(client, para)
            return idx, result

    tasks = [asyncio.create_task(sem_translate(i, p)) for i, p in enumerate(paragraphs)]

    results: list[str | None] = [None] * len(paragraphs)
    for coro in tqdm(asyncio.as_completed(tasks), total=len(tasks)):
        idx, res = await coro
        results[idx] = res

    output_lines = []
    current = 0
    for idx, (start, end) in enumerate(positions):
        output_lines.extend(lines[current:start])
        output_lines.append(results[idx] + "\n")
        current = end

    output_lines.extend(lines[current:])

    out_path = path[:-3] + ".ja.md"
    with open(out_path, "w", encoding="utf-8") as f:
        f.writelines(output_lines)

if __name__ == "__main__":
    async def main() -> None:
        for arg in sys.argv[1:]:
            await translate_file(arg)

    asyncio.run(main())
