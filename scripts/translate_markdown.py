#!/usr/bin/env python3
import sys
import openai
import os

def translate_file(path: str) -> None:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    api_key = os.environ["OPENAI_API_KEY"]
    client = openai.OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-4.1",
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
