# MTech Semester I - Learning Portal

A syllabus-faithful educational website covering five MTech Semester I courses. Every course directory contains a dedicated webpage, detailed README, concept diagram, worked examples, equations, revision checkpoints, and printable PDF.

## Deep-learning features

Each course webpage includes eight mastery sections: learning objectives, an expandable glossary, syllabus-relevant type classifications, a formula and relationship sheet, comparison tables, common mistakes, practice questions with progressive hints, and applied exercises.

## Courses

- [MCSC-105 - Discrete Mathematics and Graph Theory](./discrete-mathematics-and-graph-theory/) - 4 credits
- [MCSC-103 - Advanced Computer Networks and Communication](./advanced-computer-networks-and-communication/) - 4 credits
- [MCSC-202 - Probability and Statistics](./probability-and-statistics/) - credit not stated
- [MCSC-106 - Pattern Recognition](./pattern-recognition/) - 3 credits
- [MCSC-201 - Research Methodology](./research-methodology/) - 3 credits

## Run locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. A web server is required because the pages load the shared course data with `fetch`.

## Repository structure

```text
.
├── index.html
├── assets/
├── discrete-mathematics-and-graph-theory/
├── advanced-computer-networks-and-communication/
├── probability-and-statistics/
├── pattern-recognition/
└── research-methodology/
```

## Validation

Run `python3 scripts/validate.py`. It checks course counts, required files, internal links, PDF page counts, and README topic coverage.

## Academic scope

The content is derived from the supplied syllabus. It deliberately avoids invented unit numbering, assessment schemes, learning outcomes, or institutional rules. Examples are instructional illustrations, not additional syllabus requirements.

## License

Educational content and source code are available under the MIT License unless a referenced asset states otherwise.

## Four-semester programme directory

The home page now lists the 2021–22 CAS CSE scheme across four semesters, including specialisation choices. Subject links open a source page, with links to the five existing guides where available. Edit `assets/catalog.json` to maintain the directory; `page` points to a PDF page and `guide` to an existing guide directory.

The five older guides use some labels that conflict with the 2021–22 scheme, including course codes and credits. Their content, PDFs and URLs are preserved; consult the university syllabus and current departmental guidance for official details. The syllabus itself contains inconsistent details (for example Media Security's code differs between its scheme table and detailed page). The directory follows its semester tables. No previous-year questions are represented as verified unless independently sourced.

The full set of detailed guides, sourced previous-year questions and worked answers remains to be completed. The 2021–22 scheme may not match every batch.
