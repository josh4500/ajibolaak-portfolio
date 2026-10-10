---
title: How to write a note
description: A template showing everything a note can do. Copy this file to start a new one.
date: 2026-10-10
tags: [meta]
draft: true # drafts only show when running locally — delete this line (or set false) to publish
---

The file name becomes the URL. This file, `how-to-write-a-note.md`, would live at
`ajibolaak.dev/notes/how-to-write-a-note`. Use lowercase words joined by hyphens.

## Headings

Use `##` for sections and `###` for sub-sections. Headings get anchor links automatically.

## Text

Regular paragraphs, **bold**, _italic_, `inline code` and [links](https://ajibolaak.dev).

> Blockquotes are good for a key takeaway.

- Bullet lists
- work like this

1. Numbered lists
2. too

## Code

Code blocks are syntax-highlighted. Add the language after the opening backticks:

```dart
class Counter extends Cubit<int> {
  Counter() : super(0);

  void increment() => emit(state + 1);
}
```

```csharp
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
```

## Tables

| Layer        | Responsibility           |
| ------------ | ------------------------ |
| Presentation | Widgets and BLoCs        |
| Domain       | Entities and use cases   |
| Data         | Repositories and sources |

## Images

Put images in `public/notes/` and reference them like this:

`![Alt text describing the image](/notes/my-image.png)`
