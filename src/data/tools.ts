import { ToolDefinition } from '../types';
import { CATEGORIES_CONFIG } from '../config/site';

export const CATEGORIES = CATEGORIES_CONFIG;

export const TOOLS: ToolDefinition[] = [
  // 1. JSON FORMATTER
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    category: 'json',
    shortDescription: 'Beautify, indent, format, and minify JSON data with custom indentation.',
    iconName: 'Braces',
    route: '/tools/json-formatter',
    isPopular: true,
    tags: ['json', 'formatter', 'beautifier', 'pretty print', 'minify', 'developer'],
    seoTitle: 'JSON Formatter Online – Free JSON Beautifier & Minifier | K27 Tools',
    seoDescription: 'Format, beautify, validate, and minify JSON data online for free. Fast browser-based JSON formatter with custom indentation, syntax error detection, and instant copy/download.',
    h1: 'JSON Formatter & Beautifier',
    intro: 'Format, beautify, validate, and minify your JSON data instantly in your browser. Clean messy payload strings into properly indented, human-readable format with zero server uploads.',
    whatIsTitle: 'What is a JSON Formatter?',
    whatIsContent: 'A JSON (JavaScript Object Notation) Formatter is an online tool that transforms unformatted, raw, or minified JSON strings into a well-structured, human-readable layout with proper indentations, brackets, and key-value alignments. It also checks for syntax anomalies such as trailing commas or unescaped characters.',
    howToUseSteps: [
      'Paste your raw, minified, or unformatted JSON text into the input area or upload a .json file.',
      'Select your desired indentation preference (2 spaces, 4 spaces, or Tab) or click "Minify" to compress.',
      'Click "Format JSON" to beautify your payload. Any syntax errors will be highlighted with exact line and character positions.',
      'Click "Copy to Clipboard" or "Download .json" to export your clean data.',
    ],
    features: [
      '100% Client-side formatting with complete data privacy',
      'Configurable 2-space, 4-space, or tab indentation',
      'One-click JSON minification to strip whitespace',
      'Accurate syntax diagnostics with precise line/column pointers',
      'Instant copy and one-click .json file download',
    ],
    examples: [
      {
        title: 'Minified to Formatted JSON',
        input: '{"user":{"id":101,"name":"Alex","active":true,"tags":["admin","lead"]}}',
        output: '{\n  "user": {\n    "id": 101,\n    "name": "Alex",\n    "active": true,\n    "tags": [\n      "admin",\n      "lead"\n    ]\n  }\n}',
        description: 'Converts compact single-line JSON into a legible tree structure.',
      },
    ],
    privacyNote: 'Your JSON data is parsed and formatted strictly in your local browser runtime. No input text or objects are sent to any external server.',
    faqs: [
      {
        question: 'Does this JSON Formatter store or upload my JSON data?',
        answer: 'No. All parsing, indentation, and minification operations run purely inside your web browser via standard JavaScript. Your data never touches our servers.',
      },
      {
        question: 'Why does my JSON show a syntax error?',
        answer: 'Common JSON errors include trailing commas after the last array/object item, single quotes instead of double quotes around keys/strings, and missing closing brackets or braces.',
      },
      {
        question: 'What is the maximum JSON payload size supported?',
        answer: 'Because processing occurs in your browser memory, it can comfortably handle large JSON payloads up to several tens of megabytes depending on your device RAM.',
      },
    ],
    relatedToolSlugs: ['json-validator', 'json-to-csv', 'base64', 'jwt-decoder'],
  },

  // 2. JSON VALIDATOR
  {
    slug: 'json-validator',
    name: 'JSON Validator',
    category: 'json',
    shortDescription: 'Validate JSON syntax and pinpoint formatting errors with exact line and column locations.',
    iconName: 'CheckCheck',
    route: '/tools/json-validator',
    isPopular: false,
    tags: ['json', 'validator', 'lint', 'syntax checker', 'json parser'],
    seoTitle: 'JSON Validator Online – Free JSON Syntax Checker | K27 Tools',
    seoDescription: 'Validate your JSON syntax online for free. Pinpoint exact error line numbers, mismatched brackets, invalid tokens, and parse issues instantly in your browser.',
    h1: 'JSON Validator & Syntax Checker',
    intro: 'Validate JSON payloads against strict RFC 8259 specifications. Quickly discover syntax issues, missing quotes, unexpected tokens, and invalid types with helpful error feedback.',
    whatIsTitle: 'What is a JSON Validator?',
    whatIsContent: 'A JSON Validator is a diagnostic utility that parses a string against standard JSON grammar rules. If the JSON is valid, it confirms validity and displays structure statistics. If invalid, it highlights the exact failure point (line number, column index, and invalid token).',
    howToUseSteps: [
      'Paste your JSON payload into the input editor.',
      'Click "Validate JSON".',
      'Review the real-time status badge: Green for valid JSON or Red with diagnostic error messages.',
      'Inspect structure metrics (keys count, depth, payload size) for valid data.',
    ],
    features: [
      'Instant strict JSON syntax validation',
      'Precise error line and column index indicators',
      'Structural breakdown (object depth, root type, key count, byte size)',
      '100% private in-browser analysis',
    ],
    privacyNote: 'Your JSON code is verified locally in your web browser. No diagnostic logs or payloads are transmitted.',
    faqs: [
      {
        question: 'What constitutes valid JSON?',
        answer: 'Valid JSON requires double-quoted strings for all keys and text values, standard numbers, booleans (true/false), null, arrays [ ], and objects { }, without trailing commas or unquoted identifiers.',
      },
      {
        question: 'Can I validate JSON with comments?',
        answer: 'Standard JSON (RFC 8259) does not allow JavaScript comments (// or /* */). If your payload contains comments, the validator will mark them as syntax errors as per official specification.',
      },
    ],
    relatedToolSlugs: ['json-formatter', 'json-to-csv', 'jwt-decoder', 'url-encoder'],
  },

  // 3. JSON TO CSV
  {
    slug: 'json-to-csv',
    name: 'JSON to CSV Converter',
    category: 'json',
    shortDescription: 'Convert JSON arrays and nested object lists into downloadable CSV spreadsheet files.',
    iconName: 'FileSpreadsheet',
    route: '/tools/json-to-csv',
    isPopular: true,
    tags: ['json', 'csv', 'converter', 'excel', 'spreadsheet', 'data transform'],
    seoTitle: 'JSON to CSV Converter Online – Free & Instant Export | K27 Tools',
    seoDescription: 'Convert JSON arrays and objects to clean CSV format online for free. Handles nested properties, escaped quotes, missing fields, and offers instant .csv file download.',
    h1: 'JSON to CSV Converter',
    intro: 'Transform JSON array data or API responses into clean, tabular CSV files ready for Microsoft Excel, Google Sheets, or data analytics pipelines.',
    whatIsTitle: 'What is a JSON to CSV Converter?',
    whatIsContent: 'A JSON to CSV converter extracts the structured records from a JSON array of objects, discovers all unique column headers, flattens nested properties where applicable, and produces a comma-separated values (CSV) format with proper delimiter quoting.',
    howToUseSteps: [
      'Paste a JSON array of objects (e.g. [{"id": 1, "name": "Item"}]) into the editor.',
      'Click "Convert to CSV".',
      'Preview the generated tabular data and raw CSV output.',
      'Click "Download .csv" or copy the CSV output to your clipboard.',
    ],
    features: [
      'Automatic column discovery across heterogenous objects',
      'Handles nested object keys using dot-notation (e.g. user.address.city)',
      'Escapes commas, double quotes, and linebreaks according to RFC 4180',
      'Live tabular table preview with instant CSV download',
    ],
    privacyNote: 'Data conversion is processed 100% locally. Your JSON data and resulting spreadsheets are never uploaded to any remote server.',
    faqs: [
      {
        question: 'What JSON formats can be converted to CSV?',
        answer: 'The converter works best with an array of objects (e.g., `[{"id": 1, "name": "A"}, {"id": 2, "name": "B"}]`). If a single object is provided, it will be treated as a single record row.',
      },
      {
        question: 'How are commas or quotes in values handled?',
        answer: 'Values containing commas, double quotes, or newlines are automatically enclosed in quotes with inner quotes properly escaped per RFC 4180 CSV standard.',
      },
    ],
    relatedToolSlugs: ['json-formatter', 'json-validator', 'text-formatter', 'base64'],
  },

  // 4. IMAGE COMPRESSOR
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    category: 'image',
    shortDescription: 'Compress and reduce JPG, PNG, and WebP file sizes in your browser with quality control.',
    iconName: 'FileImage',
    route: '/tools/image-compressor',
    isPopular: true,
    tags: ['image compressor', 'compress image', 'reduce image size', 'jpg compressor', 'png compressor', 'webp'],
    seoTitle: 'Free Image Compressor Online – Compress JPG, PNG & WebP | K27 Tools',
    seoDescription: 'Compress JPG, PNG, and WebP images online for free directly in your browser. Adjust quality, preview before/after sizes, calculate savings, and download optimized photos.',
    h1: 'Image Compressor (JPG, PNG, WebP)',
    intro: 'Reduce image file sizes without sacrificing visual clarity. Process JPG, PNG, and WebP files entirely on your device with customizable quality sliders and instant before/after comparisons.',
    whatIsTitle: 'What is an Image Compressor?',
    whatIsContent: 'An image compressor uses compression algorithms and canvas raster adjustments to reduce the byte footprint of photographic and graphic images. It minimizes web page load times and storage requirements while preserving optical quality.',
    howToUseSteps: [
      'Drag and drop an image (JPG, PNG, or WebP) or click "Choose Image" to upload.',
      'Adjust the compression quality slider (e.g., 75% for balanced size and crisp visual fidelity).',
      'Compare original size versus compressed size and view saved percentage savings.',
      'Click "Download Compressed Image" to save the optimized file.',
    ],
    features: [
      '100% in-browser HTML5 Canvas compression — zero server uploads',
      'Supports JPG, PNG, and WebP formats',
      'Real-time before/after file size and reduction percentage metrics',
      'Side-by-side visual comparison preview',
      'Zero loss of privacy for personal or confidential photos',
    ],
    privacyNote: 'Images are loaded into your browser HTML5 canvas and compressed locally. Your photos never leave your device.',
    faqs: [
      {
        question: 'Are my images uploaded to any server?',
        answer: 'Never. The compression happens entirely in your web browser utilizing the native HTML5 Canvas API and WebAssembly/Blob pipelines.',
      },
      {
        question: 'What is the recommended quality percentage?',
        answer: 'For standard web graphics and photos, 75% to 85% provides significant size reduction (often 50-80% smaller) with virtually indistinguishable visual difference.',
      },
    ],
    relatedToolSlugs: ['image-resizer', 'jpg-png-to-webp', 'png-to-jpg', 'jpg-to-png'],
  },

  // 5. IMAGE RESIZER
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    category: 'image',
    shortDescription: 'Resize image dimensions by pixels or percentages with aspect ratio lock and presets.',
    iconName: 'Scaling',
    route: '/tools/image-resizer',
    isPopular: true,
    tags: ['image resizer', 'resize photo', 'dimensions', 'aspect ratio', 'crop', 'scale image'],
    seoTitle: 'Free Image Resizer Online – Resize Images by Pixels or % | K27 Tools',
    seoDescription: 'Resize JPG, PNG, and WebP images online for free. Adjust width, height, lock aspect ratios, use popular social media presets, and download high-resolution resized images.',
    h1: 'Image Resizer',
    intro: 'Change the dimensions of any image quickly and accurately. Lock aspect ratio, select standard social media presets (Instagram, YouTube, Twitter/X), and export in JPG, PNG, or WebP.',
    whatIsTitle: 'What is an Image Resizer?',
    whatIsContent: 'An image resizer allows you to scale the pixel width and height of an image up or down. Maintaining proper aspect ratio prevents image distortion (stretching or squishing) while tailoring images for websites, emails, or social media avatars.',
    howToUseSteps: [
      'Upload your image by dragging it into the dropzone or browsing your files.',
      'Enter your desired width or height in pixels, or select a preset resolution.',
      'Keep "Lock Aspect Ratio" checked to preserve natural proportions.',
      'Choose your preferred export format (Original, JPG, PNG, WebP) and click "Download Resized Image".',
    ],
    features: [
      'Smart aspect ratio locking with automatic height/width calculation',
      'Convenient one-click presets (Social media, HD 1080p, 720p, Avatars)',
      'Format selection on export (JPG, PNG, WebP)',
      'Bicubic canvas smoothing for sharp image scaling',
    ],
    privacyNote: 'Resizing is executed entirely within your client browser session. No images are stored or transmitted.',
    faqs: [
      {
        question: 'Will resizing my image reduce its quality?',
        answer: 'Downscaling an image reduces pixel count while maintaining high sharpness. Upscaling an image significantly beyond its original resolution may cause slight softening.',
      },
      {
        question: 'Can I change format while resizing?',
        answer: 'Yes! You can upload a PNG and export it resized as a lightweight WebP or JPG directly.',
      },
    ],
    relatedToolSlugs: ['image-compressor', 'jpg-png-to-webp', 'jpg-to-png', 'png-to-jpg'],
  },

  // 6. JPG TO PNG CONVERTER
  {
    slug: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    category: 'image',
    shortDescription: 'Convert JPG/JPEG images into lossless PNG format with zero quality degradation.',
    iconName: 'ImagePlus',
    route: '/tools/jpg-to-png',
    isPopular: false,
    tags: ['jpg to png', 'jpeg to png', 'convert jpg to png', 'image converter'],
    seoTitle: 'JPG to PNG Converter Online – Free Lossless Conversion | K27 Tools',
    seoDescription: 'Convert JPG and JPEG images to high-quality PNG format online for free. Instant browser-based conversion with zero data upload.',
    h1: 'JPG to PNG Converter',
    intro: 'Convert JPEG/JPG images to PNG format instantly. Perfect for graphic workflows, transparent layer editing, and archiving images without generation loss.',
    whatIsTitle: 'Why Convert JPG to PNG?',
    whatIsContent: 'PNG (Portable Network Graphics) is a lossless raster format that supports transparency and preserves sharp edges without JPEG compression artifacts. Converting JPG to PNG allows you to work with lossless editors or add transparent backgrounds.',
    howToUseSteps: [
      'Upload a JPG or JPEG image.',
      'Preview the image and verify dimensions.',
      'Click "Convert to PNG" to render the lossless PNG canvas.',
      'Download your converted .png file instantly.',
    ],
    features: [
      'Instant client-side conversion via browser Canvas API',
      'Zero compression artifact introduction during conversion',
      'Supports high-resolution camera and mobile JPEG files',
      '100% private and offline capable',
    ],
    privacyNote: 'Conversion runs locally in your browser memory. Your files are never uploaded.',
    faqs: [
      {
        question: 'Does converting JPG to PNG make the file larger?',
        answer: 'Because PNG is a lossless format, the resulting file size may be larger than the original compressed JPG, but it ensures no additional quality loss during future edits.',
      },
    ],
    relatedToolSlugs: ['png-to-jpg', 'jpg-png-to-webp', 'image-compressor', 'image-resizer'],
  },

  // 7. PNG TO JPG CONVERTER
  {
    slug: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    category: 'image',
    shortDescription: 'Convert PNG graphics to smaller, web-friendly JPG images with background color control.',
    iconName: 'ImageMinus',
    route: '/tools/png-to-jpg',
    isPopular: false,
    tags: ['png to jpg', 'png to jpeg', 'convert png to jpg', 'image converter'],
    seoTitle: 'PNG to JPG Converter Online – Free & Fast Conversion | K27 Tools',
    seoDescription: 'Convert PNG images to lightweight JPG/JPEG format online for free. Customize background fill color for transparent PNGs and adjust output quality.',
    h1: 'PNG to JPG Converter',
    intro: 'Convert heavy PNG files into lightweight, universal JPG format. Choose white or custom background fill for transparent areas and customize JPG quality.',
    whatIsTitle: 'Why Convert PNG to JPG?',
    whatIsContent: 'PNG files with high detail or photographs can be very large in file size. Converting PNG to JPG significantly decreases file size for faster web browsing, email attachments, and storage saving.',
    howToUseSteps: [
      'Upload a PNG file from your computer or phone.',
      'Choose a background color (default is clean white) to replace any transparent regions.',
      'Set your desired JPG output quality percentage.',
      'Click "Convert to JPG" and download your lightweight file.',
    ],
    features: [
      'Automatic white/solid background replacement for transparent PNGs',
      'Adjustable JPEG quality slider for custom file size vs quality ratio',
      'Real-time before/after size tracking',
      'Instant download with clean file naming',
    ],
    privacyNote: 'Your images are processed purely in client-side memory without external data transfer.',
    faqs: [
      {
        question: 'What happens to transparency in PNG when converting to JPG?',
        answer: 'Since JPG does not support transparent alpha channels, transparent pixels are replaced with a crisp solid color (white by default, or your chosen background color).',
      },
    ],
    relatedToolSlugs: ['jpg-to-png', 'jpg-png-to-webp', 'image-compressor', 'image-resizer'],
  },

  // 8. JPG/PNG TO WEBP CONVERTER
  {
    slug: 'jpg-png-to-webp',
    name: 'JPG/PNG to WebP Converter',
    category: 'image',
    shortDescription: 'Convert JPG and PNG images into modern, next-gen WebP format for fast web pages.',
    iconName: 'Sparkle',
    route: '/tools/jpg-png-to-webp',
    isPopular: true,
    tags: ['webp converter', 'jpg to webp', 'png to webp', 'next-gen image', 'google webp'],
    seoTitle: 'JPG & PNG to WebP Converter Online – Free Next-Gen WebP | K27 Tools',
    seoDescription: 'Convert JPG, JPEG, and PNG images to Google WebP format online for free. Dramatically reduce website image weight while maintaining crisp clarity.',
    h1: 'JPG & PNG to WebP Converter',
    intro: 'Convert standard images into Google’s modern WebP format. WebP delivers 25-35% smaller file sizes compared to JPEG and PNG at equivalent visual quality.',
    whatIsTitle: 'What is WebP and Why Use It?',
    whatIsContent: 'WebP is a modern image format developed by Google that provides superior lossless and lossy compression for images on the web. Using WebP speeds up website loading times, boosts Google Core Web Vitals scores, and saves server bandwidth.',
    howToUseSteps: [
      'Select or drag-and-drop any JPG or PNG image.',
      'Adjust the WebP compression quality slider (default 85%).',
      'Click "Convert to WebP".',
      'Inspect the size savings and download your .webp file.',
    ],
    features: [
      'Next-generation WebP encoder running natively in your browser',
      'Reduces file sizes by up to 80% compared to heavy PNGs',
      'Supports transparency preservation from source PNGs',
      'Compatible with all modern web browsers and CMS platforms',
    ],
    privacyNote: 'WebP encoding is performed 100% in your local browser.',
    faqs: [
      {
        question: 'Is WebP supported by all modern browsers?',
        answer: 'Yes! WebP is supported across Chrome, Safari, Firefox, Edge, iOS Safari, and Android browsers, covering over 97% of worldwide internet users.',
      },
    ],
    relatedToolSlugs: ['image-compressor', 'image-resizer', 'jpg-to-png', 'png-to-jpg'],
  },

  // 9. WORD COUNTER
  {
    slug: 'word-counter',
    name: 'Word Counter',
    category: 'text',
    shortDescription: 'Count words, characters, sentences, paragraphs, and estimate reading time in real-time.',
    iconName: 'FileText',
    route: '/tools/word-counter',
    isPopular: true,
    tags: ['word counter', 'count words', 'reading time', 'character count', 'essay counter', 'text stats'],
    seoTitle: 'Word Counter Online – Free Real-Time Word & Character Count | K27 Tools',
    seoDescription: 'Count words, characters, sentences, paragraphs, and reading time online for free. Real-time text analysis tool for writers, students, bloggers, and SEO professionals.',
    h1: 'Word Counter & Text Analyzer',
    intro: 'Real-time text statistics counter. Calculate exact word counts, character counts (with and without spaces), sentence counts, paragraphs, estimated reading duration, and speaking time.',
    whatIsTitle: 'What is a Word Counter?',
    whatIsContent: 'A Word Counter is an online text analysis tool that breaks down any written passage into quantitative metrics. It is used by students meeting essay length requirements, copywriters crafting SEO content, and authors tracking daily writing milestones.',
    howToUseSteps: [
      'Type or paste your text into the editor.',
      'Review live metric cards displaying words, characters, sentences, paragraphs, and reading time.',
      'Check detailed statistics such as average word length and reading level.',
      'Copy your text or clear the editor with one click.',
    ],
    features: [
      'Live dynamic counting as you type',
      'Detailed metric breakdown: Words, Characters (with/without spaces), Sentences, Paragraphs',
      'Estimated Reading Time (225 wpm) and Speaking Time (130 wpm)',
      'Top keyword density frequency breakdown',
    ],
    privacyNote: 'Your text is never sent across the internet. Everything is calculated in real-time in your browser memory.',
    faqs: [
      {
        question: 'How is reading time calculated?',
        answer: 'Reading time is calculated based on the standard average adult silent reading speed of 225 words per minute (WPM).',
      },
      {
        question: 'Does this word counter support non-English languages?',
        answer: 'Yes! It handles Unicode text, accents, and diverse language scripts properly.',
      },
    ],
    relatedToolSlugs: ['character-counter', 'case-converter', 'text-formatter'],
  },

  // 10. CHARACTER COUNTER
  {
    slug: 'character-counter',
    name: 'Character Counter',
    category: 'text',
    shortDescription: 'Count characters, spaces, letters, numbers, symbols, and byte size for social media limits.',
    iconName: 'WholeWord',
    route: '/tools/character-counter',
    isPopular: false,
    tags: ['character counter', 'letter counter', 'twitter character count', 'meta description length', 'byte counter'],
    seoTitle: 'Character Counter Online – Free Letter & Space Counter | K27 Tools',
    seoDescription: 'Accurately count characters, letters, digits, symbols, whitespace, and bytes online for free. Perfect for Twitter/X character limits, SEO title tags, and SMS length.',
    h1: 'Character Counter',
    intro: 'Count exact characters, letters, digits, spaces, and UTF-8 byte weights. Check your text against platform limits like Twitter (280 chars), SEO Title tags (60 chars), and Meta descriptions (160 chars).',
    whatIsTitle: 'What is a Character Counter?',
    whatIsContent: 'A Character Counter tallies every individual typographic symbol (letters, punctuation, numbers, spaces, emojis, and line breaks) within a block of text. It helps maintain content within strict character limits on social media, ad copy, and search snippets.',
    howToUseSteps: [
      'Paste or type text into the input box.',
      'Check the real-time breakdown of total characters, letters, numbers, spaces, and symbols.',
      'Inspect social media limit progress bars (Twitter/X, LinkedIn, Meta Description).',
    ],
    features: [
      'Detailed character classification (Alphabetic, Numeric, Whitespace, Punctuation, Emojis)',
      'UTF-8 byte size calculator',
      'Built-in limit trackers for Twitter (280), SEO Titles (60), Meta Descriptions (160), SMS (160)',
      'Zero server transmission — 100% confidential text drafting',
    ],
    privacyNote: 'Text remains strictly inside your browser environment.',
    faqs: [
      {
        question: 'How many characters are allowed on Twitter/X?',
        answer: 'Standard Twitter/X posts allow up to 280 characters per tweet. This tool provides a live progress bar to ensure your tweet fits.',
      },
    ],
    relatedToolSlugs: ['word-counter', 'case-converter', 'text-formatter'],
  },

  // 11. CASE CONVERTER
  {
    slug: 'case-converter',
    name: 'Case Converter',
    category: 'text',
    shortDescription: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.',
    iconName: 'Type',
    route: '/tools/case-converter',
    isPopular: true,
    tags: ['case converter', 'uppercase', 'lowercase', 'title case', 'camelcase', 'snake_case', 'kebab-case'],
    seoTitle: 'Case Converter Online – Free Text Case Changer | K27 Tools',
    seoDescription: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, and PascalCase online for free.',
    h1: 'Case Converter',
    intro: 'Transform text casing with a single click. Seamlessly convert between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, and PascalCase.',
    whatIsTitle: 'What is a Case Converter?',
    whatIsContent: 'A Case Converter is a utility that systematically changes the capitalization and spacing conventions of text strings. Developers use it to convert variables between programming conventions (camelCase, snake_case, kebab-case), while writers use it to format headlines into Title Case or Sentence case.',
    howToUseSteps: [
      'Paste your text into the editor.',
      'Click the button corresponding to your target case (e.g. "Title Case", "camelCase", "UPPERCASE").',
      'Copy the converted text immediately with the one-click copy button.',
    ],
    features: [
      'Supports 8 casing styles: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, PascalCase',
      'Intelligent word boundary detection',
      'Real-time live conversion previews for all casing formats',
      'One-click copy for any case result',
    ],
    privacyNote: 'All string manipulation is computed client-side in JavaScript.',
    faqs: [
      {
        question: 'What is the difference between camelCase and PascalCase?',
        answer: 'In camelCase, the first word starts lowercase and subsequent words start uppercase (`myVariableName`). In PascalCase, all words including the first start uppercase (`MyVariableName`).',
      },
    ],
    relatedToolSlugs: ['text-formatter', 'word-counter', 'character-counter', 'base64'],
  },

  // 12. TEXT FORMATTER
  {
    slug: 'text-formatter',
    name: 'Text Formatter & Cleaner',
    category: 'text',
    shortDescription: 'Remove extra spaces, blank lines, duplicate lines, sort alphabetically, and trim text.',
    iconName: 'AlignLeft',
    route: '/tools/text-formatter',
    isPopular: false,
    tags: ['text formatter', 'remove duplicate lines', 'remove blank lines', 'sort text', 'trim lines', 'clean text'],
    seoTitle: 'Text Formatter & Cleaner Online – Free Text Cleaner | K27 Tools',
    seoDescription: 'Format and clean messy text online for free. Remove extra spaces, delete empty blank lines, sort lines alphabetically, eliminate duplicates, and reverse text.',
    h1: 'Text Formatter & Cleaner',
    intro: 'Clean up unstructured and messy text files. Eliminate duplicate lines, strip trailing whitespace, remove blank lines, sort lines alphabetically, and reverse text order with one click.',
    whatIsTitle: 'What is a Text Formatter?',
    whatIsContent: 'A Text Formatter cleans, organizes, and normalizes unstructured text data. It helps programmers, editors, and analysts sanitize lists, remove unwanted whitespace characters, deduplicate rows, and format text for downstream processing.',
    howToUseSteps: [
      'Paste your text or list into the input box.',
      'Select any cleaning action: "Remove Extra Spaces", "Remove Blank Lines", "Deduplicate Lines", "Sort A-Z", etc.',
      'Review the updated output instantly in the preview panel and copy or download.',
    ],
    features: [
      'Remove multiple consecutive spaces and tabs',
      'Strip empty blank lines and whitespace-only rows',
      'Remove duplicate rows/items with exact or case-insensitive matching',
      'Sort lines alphabetically (A to Z or Z to A) or by line length',
      'Reverse text or line ordering',
      'Add prefix/suffix to every line',
    ],
    privacyNote: 'Your text is formatted locally in browser memory without network requests.',
    faqs: [
      {
        question: 'Can I deduplicate a list of email addresses or keywords?',
        answer: 'Yes! Simply paste your list, click "Remove Duplicate Lines", and you will receive a clean deduplicated list instantly.',
      },
    ],
    relatedToolSlugs: ['case-converter', 'word-counter', 'json-to-csv', 'base64'],
  },

  // 13. BASE64 ENCODER / DECODER
  {
    slug: 'base64',
    name: 'Base64 Encoder / Decoder',
    category: 'developer',
    shortDescription: 'Encode text or files into Base64 format and decode Base64 strings back to plain text.',
    iconName: 'Binary',
    route: '/tools/base64',
    isPopular: true,
    tags: ['base64', 'base64 encoder', 'base64 decoder', 'base64 converter', 'binary to text'],
    seoTitle: 'Base64 Encoder & Decoder Online – Free & Instant | K27 Tools',
    seoDescription: 'Encode text to Base64 and decode Base64 strings back to text online for free. Supports UTF-8 unicode encoding, live decoding, and instant copy.',
    h1: 'Base64 Encoder / Decoder',
    intro: 'Encode plain text strings into Base64 format and decode Base64 strings back to human-readable text. Full support for UTF-8 special characters, emojis, and binary payloads.',
    whatIsTitle: 'What is Base64 Encoding?',
    whatIsContent: 'Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format by translating it into a radix-64 representation. It is widely used for transmitting data across media designed for text, such as embedding images in HTML/CSS, basic HTTP auth, and email MIME.',
    howToUseSteps: [
      'Select "Encode" to convert plain text to Base64, or "Decode" to decode Base64 back to text.',
      'Paste your content into the input field.',
      'View the real-time converted result.',
      'Click "Copy" to copy the encoded or decoded output.',
    ],
    features: [
      'Two-way live Encoding and Decoding',
      'Full UTF-8 Unicode support (special characters, accents, emojis)',
      'Instant validation with friendly error notices for corrupted Base64 strings',
      '100% client-side Web API execution',
    ],
    privacyNote: 'All encoding and decoding runs in your browser runtime. No strings or keys are sent to any server.',
    faqs: [
      {
        question: 'Is Base64 an encryption method?',
        answer: 'No! Base64 is an encoding format, not encryption. Anyone can decode a Base64 string back into its original form without a key or password.',
      },
      {
        question: 'Does this tool support non-ASCII and Unicode characters?',
        answer: 'Yes! Unlike basic btoa/atob implementations which fail on multi-byte characters, our tool uses proper UTF-8 byte stream encoding.',
      },
    ],
    relatedToolSlugs: ['url-encoder', 'jwt-decoder', 'hash-generator', 'json-formatter'],
  },

  // 14. URL ENCODER / DECODER
  {
    slug: 'url-encoder',
    name: 'URL Encoder / Decoder',
    category: 'developer',
    shortDescription: 'Encode and decode URLs, query parameters, and URI components (percent-encoding).',
    iconName: 'Link',
    route: '/tools/url-encoder',
    isPopular: false,
    tags: ['url encoder', 'url decoder', 'percent encoding', 'uri component', 'query string encoder'],
    seoTitle: 'URL Encoder & Decoder Online – Free Percent-Encoding Tool | K27 Tools',
    seoDescription: 'Encode and decode URLs and query parameters online for free. Convert special characters into valid percent-encoded URI strings and decode complex URL parameters.',
    h1: 'URL Encoder & Decoder',
    intro: 'Encode special characters into percent-encoded URI format (%20, %3F, %26) for safe transmission in web addresses and decode encoded URLs back to clean text.',
    whatIsTitle: 'What is URL Percent-Encoding?',
    whatIsContent: 'URL encoding (percent-encoding) converts reserved and unsafe characters (such as spaces, question marks, ampersands, and slashes) into a percent sign followed by their two-digit hexadecimal ASCII representation, ensuring web browsers and servers interpret query strings safely.',
    howToUseSteps: [
      'Choose "Encode" to convert plain text/URLs into percent-encoded format, or "Decode" to decode %XX codes.',
      'Paste your URL or parameter string.',
      'Select between "Component mode" (encodes all separators) or "Full URI mode".',
      'Copy the resulting URL string with one click.',
    ],
    features: [
      'Two encoding modes: encodeURIComponent (query values) and encodeURI (full addresses)',
      'Live two-way encoding and decoding',
      'Clear handling of malformed URI sequences with helpful error notes',
      '100% private in-browser tool',
    ],
    privacyNote: 'URL strings are parsed locally in your browser.',
    faqs: [
      {
        question: 'When should I use encodeURIComponent vs encodeURI?',
        answer: 'Use `encodeURIComponent` when encoding specific parameter values (e.g. query strings where & and = must be encoded). Use `encodeURI` when encoding a full URL where protocol and path slashes must remain intact.',
      },
    ],
    relatedToolSlugs: ['base64', 'jwt-decoder', 'hash-generator', 'uuid-generator'],
  },

  // 15. UUID GENERATOR
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    category: 'developer',
    shortDescription: 'Generate cryptographically secure v4 UUIDs (Universally Unique Identifiers) in bulk.',
    iconName: 'Fingerprint',
    route: '/tools/uuid-generator',
    isPopular: true,
    tags: ['uuid generator', 'guid generator', 'uuid v4', 'unique id generator', 'random uuid'],
    seoTitle: 'UUID Generator Online – Free Cryptographic UUID v4 Generator | K27 Tools',
    seoDescription: 'Generate cryptographically random UUID v4 and GUID strings online for free. Batch generate 1, 5, 10, 50, or 100 UUIDs with custom formatting and instant copy/download.',
    h1: 'UUID v4 Generator',
    intro: 'Generate cryptographically secure, random version 4 UUIDs (Universally Unique Identifiers) and GUIDs. Generate single or bulk batches (up to 100) using native Web Crypto API random values.',
    whatIsTitle: 'What is a UUID / GUID?',
    whatIsContent: 'A UUID (Universally Unique Identifier), also known as a GUID (Globally Unique Identifier), is a 128-bit label used for information in computer systems. Version 4 UUIDs use pseudo-random numbers with 122 bits of randomness, giving a practically zero chance of duplicate collisions.',
    howToUseSteps: [
      'Select how many UUIDs you need to generate (1, 5, 10, 50, or 100).',
      'Choose your formatting options: Hyphens (standard vs without hyphens), Uppercase vs Lowercase, or Braces {}.',
      'Click "Generate UUIDs" to create fresh cryptographic identifiers.',
      'Copy the list or download as a .txt file.',
    ],
    features: [
      'Uses Web Crypto API (crypto.randomUUID / getRandomValues) for true cryptographic security',
      'Batch generation presets: 1, 5, 10, 50, 100 UUIDs',
      'Custom options: uppercase, lowercase, with/without hyphens, curly braces wrap',
      'Instant copy all and .txt export',
    ],
    privacyNote: 'UUIDs are generated using your device browser crypto module with zero network communication.',
    faqs: [
      {
        question: 'What is the probability of a UUID v4 collision?',
        answer: 'The chance of generating two identical UUID v4s is approximately 1 in 2^122 (about 5.3 x 10^36), which is practically impossible in any computing system.',
      },
    ],
    relatedToolSlugs: ['hash-generator', 'base64', 'jwt-decoder', 'url-encoder'],
  },

  // 16. JWT DECODER
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    category: 'developer',
    shortDescription: 'Decode and inspect JSON Web Token (JWT) headers, claims payloads, and expiration dates.',
    iconName: 'ShieldAlert',
    route: '/tools/jwt-decoder',
    isPopular: true,
    tags: ['jwt decoder', 'decode jwt', 'json web token', 'jwt inspector', 'jwt claims', 'jwt expiry'],
    seoTitle: 'JWT Decoder Online – Free & Secure JSON Web Token Inspector | K27 Tools',
    seoDescription: 'Decode and inspect JSON Web Tokens (JWT) online for free. View decoded headers, claims, payload JSON, and token expiration status. 100% private, never sent to a server.',
    h1: 'JWT Decoder (JSON Web Token)',
    intro: 'Inspect and debug JSON Web Tokens without risking security leaks. Decode token Header and Payload JSON, check timestamp validity (iat, exp, nbf), and view human-readable expiration dates.',
    whatIsTitle: 'What is a JWT (JSON Web Token)?',
    whatIsContent: 'A JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact, URL-safe means for securely representing claims between two parties. It consists of three parts separated by dots: Header, Payload, and Signature.',
    howToUseSteps: [
      'Paste your encoded JWT string (e.g. eyJhbGciOi...) into the token input field.',
      'Inspect the decoded Header (algorithm and token type).',
      'Inspect the decoded Payload claims (sub, name, roles, permissions).',
      'Review the token expiration status and timestamp diagnostics.',
    ],
    features: [
      '100% Client-side decoding — token is NEVER sent over any network',
      'Clear security notice: "Decoding a JWT does not verify its cryptographic signature"',
      'Automated time check: Highlights active, expired, or future-dated tokens with exact timestamps',
      'Formatted, syntax-highlighted JSON viewer for Header and Payload',
    ],
    privacyNote: 'Security first: JWT tokens are decoded purely in your local browser JavaScript. We do NOT store, log, or transmit any tokens.',
    faqs: [
      {
        question: 'Does decoding a JWT mean the token is valid and authenticated?',
        answer: 'NO. Decoding simply unpacks the Base64Url-encoded payload so you can view the claims. To verify that a token is authentic and untampered, your backend application must verify the cryptographic signature using the secret or public key.',
      },
      {
        question: 'Is it safe to paste production JWTs here?',
        answer: 'Yes, because our tool processes the string exclusively on your machine without making any HTTP network requests. However, as standard security practice, never share private tokens on untrusted devices.',
      },
    ],
    relatedToolSlugs: ['base64', 'json-formatter', 'hash-generator', 'uuid-generator'],
  },

  // 17. HASH GENERATOR
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    category: 'developer',
    shortDescription: 'Generate cryptographic SHA-256, SHA-384, SHA-512, and SHA-1 hashes using Web Crypto.',
    iconName: 'Key',
    route: '/tools/hash-generator',
    isPopular: false,
    tags: ['hash generator', 'sha256', 'sha512', 'sha384', 'sha1', 'checksum', 'crypto hash'],
    seoTitle: 'Hash Generator Online – Free SHA-256, SHA-384, SHA-512 Generator | K27 Tools',
    seoDescription: 'Generate cryptographic hashes online for free. Calculate SHA-256, SHA-384, SHA-512, and SHA-1 hashes directly in your browser using the native Web Crypto API.',
    h1: 'Cryptographic Hash Generator',
    intro: 'Generate secure cryptographic hash checksums in real-time. Computes standard cryptographic algorithms including SHA-256, SHA-384, SHA-512, and SHA-1 using native browser Web Crypto.',
    whatIsTitle: 'What is a Cryptographic Hash?',
    whatIsContent: 'A cryptographic hash function is a mathematical algorithm that maps data of arbitrary size to a fixed-length string of bytes. Hashes are deterministic (the same input always yields the same hash), irreversible (one-way), and highly sensitive to any change in input.',
    howToUseSteps: [
      'Enter or paste text into the input field.',
      'View all calculated hash digests (SHA-256, SHA-384, SHA-512, SHA-1) generated in real-time.',
      'Click the copy icon next to any hash digest.',
    ],
    features: [
      'Native Web Crypto API hardware-accelerated computation',
      'Calculates SHA-256 (256-bit), SHA-384, SHA-512, and SHA-1 simultaneously',
      'Uppercase and lowercase hex output toggle',
      'Instant copy for individual hashes or all digests at once',
    ],
    privacyNote: 'Hashes are calculated locally by your browser Web Crypto engine. No inputs are sent to any remote server.',
    faqs: [
      {
        question: 'Which hash algorithm should I use for security?',
        answer: 'SHA-256 and SHA-512 are recommended modern standards for checksums and digital signatures. SHA-1 is deprecated for security purposes due to known collision vulnerabilities, but is included for legacy checksum verification.',
      },
    ],
    relatedToolSlugs: ['uuid-generator', 'base64', 'jwt-decoder', 'url-encoder'],
  },

  // 18. PDF MERGE
  {
    slug: 'pdf-merge',
    name: 'PDF Merge',
    category: 'pdf',
    shortDescription: 'Combine and merge multiple PDF documents into a single organized PDF file.',
    iconName: 'Files',
    route: '/tools/pdf-merge',
    isPopular: true,
    tags: ['pdf merge', 'merge pdf', 'combine pdf', 'join pdf files', 'pdf binder'],
    seoTitle: 'Merge PDF Online Free – Combine Multiple PDF Files | K27 Tools',
    seoDescription: 'Merge and combine multiple PDF files into one single document online for free. Reorder pages, preserve document quality, and process 100% locally in your browser.',
    h1: 'Merge PDF Files Online',
    intro: 'Combine multiple PDF documents into a single, cohesive PDF file. Easily reorder uploaded files, preview page counts, and merge documents securely in your browser with zero server uploads.',
    whatIsTitle: 'What is PDF Merge?',
    whatIsContent: 'PDF Merge is a document utility that concatenates multiple distinct PDF files into one unified document while preserving vector text quality, images, page orientations, and layouts.',
    howToUseSteps: [
      'Click "Select PDF Files" or drag multiple PDF documents into the dropzone.',
      'Reorder the documents using the Up/Down arrow buttons to set the desired sequence.',
      'Click "Merge PDFs" to combine all files.',
      'Download your merged PDF file instantly.',
    ],
    features: [
      '100% Client-side PDF engine powered by pdf-lib — zero server uploads',
      'Upload and combine unlimited PDF documents',
      'Easy drag & drop or one-click file reordering',
      'Preserves original vector sharpness, links, and formatting',
    ],
    privacyNote: 'Your confidential PDF documents are merged locally in your browser memory. They are never uploaded or stored.',
    faqs: [
      {
        question: 'Is there a limit on how many PDF files I can merge?',
        answer: 'Because merging happens directly on your device, you can merge as many files as your device RAM comfortably supports.',
      },
      {
        question: 'Are my private documents safe from data leaks?',
        answer: 'Yes! Unlike other online PDF tools that upload your files to remote cloud servers, K27 Tools processes PDF files 100% inside your browser using client-side JavaScript.',
      },
    ],
    relatedToolSlugs: ['pdf-split', 'pdf-compressor', 'image-compressor'],
  },

  // 19. PDF SPLIT
  {
    slug: 'pdf-split',
    name: 'PDF Split',
    category: 'pdf',
    shortDescription: 'Split a PDF into separate files or extract specific page ranges with custom selection.',
    iconName: 'Split',
    route: '/tools/pdf-split',
    isPopular: true,
    tags: ['pdf split', 'split pdf', 'extract pdf pages', 'separate pdf', 'cut pdf'],
    seoTitle: 'Split PDF Online Free – Extract Pages & Split PDF Files | K27 Tools',
    seoDescription: 'Split PDF documents and extract specific pages or custom ranges online for free. Fast, privacy-safe in-browser PDF page splitter with instant download.',
    h1: 'Split PDF Files & Extract Pages',
    intro: 'Extract individual pages, page ranges (e.g. 1-3, 5, 8-10), or split an entire PDF into individual single-page documents directly in your browser without uploading.',
    whatIsTitle: 'What is PDF Split?',
    whatIsContent: 'PDF Split is a document utility that allows you to divide a multi-page PDF into smaller documents or extract only the specific pages you need for printing, emailing, or sharing.',
    howToUseSteps: [
      'Upload a PDF document to inspect its total page count.',
      'Choose your split mode: "Extract Range" (e.g., 1-3, 5) or "Extract All Individual Pages".',
      'Click "Split & Extract PDF".',
      'Download the extracted PDF or a ZIP archive containing all split pages.',
    ],
    features: [
      'Custom page range selection (supports comma lists and ranges like "1-4, 7, 9-12")',
      'Extract every page into individual single-page PDF files',
      '100% local client-side processing with complete document privacy',
      'One-click ZIP download for multi-file splits',
    ],
    privacyNote: 'Your PDF files are split strictly on your local device.',
    faqs: [
      {
        question: 'How do I specify custom page ranges?',
        answer: 'You can write individual page numbers and ranges separated by commas, for example: `1-3, 5, 7-10`.',
      },
    ],
    relatedToolSlugs: ['pdf-merge', 'pdf-compressor', 'image-resizer'],
  },

  // 20. PDF COMPRESSOR
  {
    slug: 'pdf-compressor',
    name: 'PDF Compressor',
    category: 'pdf',
    shortDescription: 'Optimize and reduce PDF document file sizes client-side with stream restructuring.',
    iconName: 'FileArchive',
    route: '/tools/pdf-compressor',
    isPopular: false,
    tags: ['pdf compressor', 'compress pdf', 'reduce pdf size', 'shrink pdf', 'optimize pdf'],
    seoTitle: 'Compress PDF Online Free – Reduce PDF File Size | K27 Tools',
    seoDescription: 'Compress and optimize PDF file sizes online for free. Strip redundant metadata, optimize document object streams, and reduce PDF weight directly in your browser.',
    h1: 'PDF Compressor & Optimizer',
    intro: 'Reduce PDF file sizes for easier email attachments and web upload limits. Optimizes object streams, cleans unused xref structures, and strips metadata entirely inside your browser.',
    whatIsTitle: 'What is a Client-Side PDF Compressor?',
    whatIsContent: 'A client-side PDF compressor restructures internal PDF object streams, removes duplicate data, strips unneeded metadata (such as edit history and thumbnails), and rewrites the document structure using efficient binary stream encoding without transmitting sensitive documents across the web.',
    howToUseSteps: [
      'Select and upload a PDF document.',
      'Select your optimization preference (Standard Stream Optimization or Maximum Metadata Cleaning).',
      'Click "Compress PDF".',
      'View original vs optimized file size and download your compressed PDF.',
    ],
    features: [
      '100% browser-based PDF restructuring using pdf-lib stream rebuilding',
      'Cleans redundant metadata, orphaned objects, and annotations',
      'Displays before/after size comparisons with percentage reduction',
      'Guarantees your confidential contracts and documents are never exposed to remote servers',
    ],
    privacyNote: 'All PDF processing executes locally in your browser memory.',
    faqs: [
      {
        question: 'How much can a PDF be compressed client-side?',
        answer: 'PDFs with heavy uncompressed object streams, redundant font subsets, or excessive metadata can often be reduced by 15% to 50%. Documents that already contain pre-compressed images may see smaller percentage reductions.',
      },
    ],
    relatedToolSlugs: ['pdf-merge', 'pdf-split', 'image-compressor'],
  },

  // 21. QR CODE GENERATOR
  {
    slug: 'qr-generator',
    name: 'QR Code Generator',
    category: 'qr',
    shortDescription: 'Create custom, high-resolution QR codes for websites, text, emails, and Wi-Fi networks.',
    iconName: 'QrCode',
    route: '/tools/qr-generator',
    isPopular: true,
    tags: ['qr code generator', 'create qr code', 'free qr code', 'custom qr code', 'qr maker'],
    seoTitle: 'QR Code Generator Online – Free Custom QR Code Maker | K27 Tools',
    seoDescription: 'Generate custom QR codes online for free. Create high-resolution QR codes for URLs, text, Wi-Fi, and contacts with custom colors, sizes, and instant PNG/SVG download.',
    h1: 'Free Custom QR Code Generator',
    intro: 'Create high-resolution, scannable QR codes for websites, plain text, email links, phone numbers, and Wi-Fi connections. Customize colors, error correction level, and download in PNG or vector SVG format.',
    whatIsTitle: 'What is a QR Code Generator?',
    whatIsContent: 'A QR Code (Quick Response Code) Generator is a tool that encodes alphanumeric text, URLs, or contact data into a two-dimensional matrix barcode. Any smartphone camera can instantly scan the code to open links or read data.',
    howToUseSteps: [
      'Enter your website URL, text message, or contact information.',
      'Select QR code dimension (from 200px up to 1000px high-res for print).',
      'Pick your foreground and background colors.',
      'Choose Error Correction Level (L, M, Q, or H for high durability).',
      'Download your QR code in high-resolution PNG or crisp vector SVG format.',
    ],
    features: [
      'Supports URLs, Plain Text, Email links, Phone numbers, and Wi-Fi configurations',
      'Custom foreground and background color pickers',
      'Adjustable Error Correction (Low, Medium, Quartile, High)',
      'Export in PNG (raster) or SVG (infinite resolution vector for printing)',
      '100% free with no scan limits, expiration dates, or sign-ups',
    ],
    privacyNote: 'QR codes are generated dynamically in your browser. No URLs or content strings are logged.',
    faqs: [
      {
        question: 'Do these QR codes ever expire?',
        answer: 'No! The QR codes generated by K27 Tools are standard static QR codes that encode your data directly. They never expire and have no scan limits.',
      },
      {
        question: 'Can I use these QR codes for commercial printing?',
        answer: 'Yes! Download the SVG format or high-resolution 1000px PNG for crisp, high-quality printing on flyers, business cards, menus, and billboards.',
      },
    ],
    relatedToolSlugs: ['url-encoder', 'base64', 'uuid-generator', 'image-resizer'],
  },
];

export const POPULAR_TOOLS = TOOLS.filter((t) => t.isPopular);

export function getPopularTools(): ToolDefinition[] {
  return POPULAR_TOOLS;
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): ToolDefinition[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getRelatedTools(tool: ToolDefinition): ToolDefinition[] {
  return tool.relatedToolSlugs
    .map((slug) => TOOLS.find((t) => t.slug === slug))
    .filter((t): t is ToolDefinition => t !== undefined);
}

export function searchTools(query: string): ToolDefinition[] {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return [];

  return TOOLS.filter((t) => {
    const matchName = t.name.toLowerCase().includes(cleanQuery);
    const matchShort = t.shortDescription.toLowerCase().includes(cleanQuery);
    const matchCategory = t.category.toLowerCase().includes(cleanQuery);
    const matchTag = t.tags.some((tag) => tag.toLowerCase().includes(cleanQuery));
    return matchName || matchShort || matchCategory || matchTag;
  });
}
