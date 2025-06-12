#!/usr/bin/env python3
import sys
import openai
import os

def translate_file(path: str) -> None:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    client = openai.OpenAI()
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Translate the following Markdown to Japanese."},
            {"role": "user", "content": content},
        ],
    )
    ja_content = response.choices[0].message.content
    out_path = path[:-3] + ".ja.md"
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(ja_content)

if __name__ == "__main__":
    for arg in sys.argv[1:]:
        translate_file(arg)
