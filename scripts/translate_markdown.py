#!/usr/bin/env python3
import sys
import os

import openai
from markdown_it import MarkdownIt


SYSTEM_PROMPT = (
    "Translate the following Markdown paragraph to Japanese. "
    "Only translate the prose and leave any headings, images, formulas, or code unchanged."
)

def translate_paragraph(client: openai.OpenAI, text: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": text}],
    )
    return response.choices[0].message.content.strip()


def translate_file(path: str) -> None:
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    text = "".join(lines)
    md = MarkdownIt()
    tokens = md.parse(text)

    api_key = os.environ["OPENAI_API_KEY"]
    client = openai.OpenAI(api_key=api_key)

    output_lines = []
    current = 0
    for token in tokens:
        if token.type == "paragraph_open" and token.map:
            start, end = token.map
            # copy lines before this paragraph
            output_lines.extend(lines[current:start])

            paragraph = "".join(lines[start:end]).rstrip("\n")
            translated = translate_paragraph(client, paragraph)
            output_lines.append(translated + "\n")
            current = end

    output_lines.extend(lines[current:])

    out_path = path[:-3] + ".ja.md"
    with open(out_path, "w", encoding="utf-8") as f:
        f.writelines(output_lines)

if __name__ == "__main__":
    for arg in sys.argv[1:]:
        translate_file(arg)
