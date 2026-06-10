# Bilingual Publishing Workflow

This site keeps the public official version in English, while allowing Chinese-first drafting.

## Structure

```text
drafts/zh/
  Chinese source drafts. These are not rendered by Hexo.

source/_posts/
  Official English blog posts rendered on the public site.

source/zh/
  Optional Chinese mirror pages. These are not linked from the top navigation by default.
```

## Recommended Workflow

1. Write freely in Chinese under `drafts/zh/`.
2. Ask the agent to convert the draft into an English official post.
3. The agent should:
   - preserve the technical meaning;
   - reorganize the structure for English readers when needed;
   - keep the tone personal but professional;
   - add or update tags and categories;
   - link figures and references correctly;
   - run `npm run build`;
   - deploy with `npm run deploy` only after the build passes.

## Draft Metadata

Each Chinese draft should start with:

```yaml
---
title_zh:
target_slug:
target_category:
target_tags:
status: draft
visibility: chinese-draft
---
```

`target_slug` should be the future English post slug, for example:

```text
similarity-matching-and-olfactory-preprocessing
```

## Agent Instruction For Future Updates

When converting a Chinese draft into the English official site:

1. Read the Chinese draft first.
2. Check whether an English post with the same `target_slug` already exists.
3. If it exists, update it rather than creating a duplicate.
4. If it does not exist, create a new post under `source/_posts/`.
5. Keep the Chinese draft as the source record.
6. Do not publish Chinese drafts unless explicitly requested.

## Privacy Note

Files under `drafts/zh/` are not rendered into the website, but they are still part of the git repository if committed and pushed. Do not put private or sensitive material there unless the repository privacy level is appropriate.

