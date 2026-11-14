export interface ExerciseSet {
  id: string
  label: string
  extension: string
  indentation: number
  codes: readonly string[]
}

export interface LanguageOption {
  id: LanguageId
  label: string
  extension: string
  indentation: number
}

export interface CodeSnippet {
  id: string
  languageId: LanguageId
  language: string
  filename: string
  code: string
  indentation: number
}

const exerciseSets = [
  {
    id: 'javascript',
    label: 'JavaScript',
    extension: 'js',
    indentation: 2,
    codes: [
      [
        'function sumValues(values) {',
        '  let total = 0;',
        '  for (const value of values) {',
        '    total += value;',
        '  }',
        '  return total;',
        '}',
      ].join('\n'),
      [
        'function clamp(value, lower, upper) {',
        '  if (value < lower) return lower;',
        '  if (value > upper) return upper;',
        '  return value;',
        '}',
      ].join('\n'),
      [
        'function isEven(value) {',
        '  const remainder = value % 2;',
        '  return remainder === 0;',
        '}',
      ].join('\n'),
      [
        'function reverseText(text) {',
        '  const letters = [...text];',
        '  letters.reverse();',
        '  return letters.join("");',
        '}',
      ].join('\n'),
      [
        'function countVowels(text) {',
        '  const vowels = "aeiou";',
        '  const letters = text.toLowerCase();',
        '  return [...letters].filter(letter => vowels.includes(letter)).length;',
        '}',
      ].join('\n'),
      [
        'const maximum = values => {',
        '  let result = values[0];',
        '  for (const value of values) {',
        '    if (value > result) result = value;',
        '  }',
        '  return result;',
        '};',
      ].join('\n'),
      [
        'function squareValues(values) {',
        '  const squares = [];',
        '  for (const value of values) {',
        '    squares.push(value * value);',
        '  }',
        '  return squares;',
        '}',
      ].join('\n'),
      [
        'function uniqueValues(values) {',
        '  const result = [];',
        '  for (const value of values) {',
        '    if (!result.includes(value)) result.push(value);',
        '  }',
        '  return result;',
        '}',
      ].join('\n'),
      [
        'function isPalindrome(text) {',
        '  const letters = text.toLowerCase();',
        '  const reversed = [...letters].reverse().join("");',
        '  return letters === reversed;',
        '}',
      ].join('\n'),
      [
        'const factorial = value => {',
        '  let result = 1;',
        '  for (let index = 2; index <= value; index += 1) {',
        '    result *= index;',
        '  }',
        '  return result;',
        '};',
      ].join('\n'),
      [
        'function fibonacci(count) {',
        '  const values = [0, 1];',
        '  while (values.length < count) {',
        '    values.push(values.at(-1) + values.at(-2));',
        '  }',
        '  return values.slice(0, count);',
        '}',
      ].join('\n'),
      [
        'function average(values) {',
        '  if (values.length === 0) return 0;',
        '  const total = values.reduce((sum, value) => sum + value, 0);',
        '  return total / values.length;',
        '}',
      ].join('\n'),
      [
        'function titleCase(text) {',
        '  return text.replace(/\\b\\w/g, letter => {',
        '    return letter.toUpperCase();',
        '  });',
        '}',
      ].join('\n'),
      [
        'function countWords(text) {',
        '  const trimmed = text.trim();',
        '  if (trimmed.length === 0) return 0;',
        '  return trimmed.split(/\\s+/).length;',
        '}',
      ].join('\n'),
      [
        'function flatten(groups) {',
        '  const values = [];',
        '  for (const group of groups) {',
        '    for (const value of group) values.push(value);',
        '  }',
        '  return values;',
        '}',
      ].join('\n'),
      [
        'function sortNames(names) {',
        '  const result = [...names];',
        '  result.sort((left, right) => left.localeCompare(right));',
        '  return result;',
        '}',
      ].join('\n'),
      [
        'const firstDuplicate = values => {',
        '  const seen = new Set();',
        '  for (const value of values) {',
        '    if (seen.has(value)) return value;',
        '    seen.add(value);',
        '  }',
        '  return undefined;',
        '};',
      ].join('\n'),
      [
        'function frequencies(values) {',
        '  const counts = new Map();',
        '  for (const value of values) {',
        '    counts.set(value, (counts.get(value) ?? 0) + 1);',
        '  }',
        '  return counts;',
        '}',
      ].join('\n'),
      [
        'function wait(milliseconds) {',
        '  return new Promise(resolve => {',
        '    setTimeout(resolve, milliseconds);',
        '  });',
        '}',
      ].join('\n'),
      [
        'class Counter {',
        '  constructor() {',
        '    this.value = 0;',
        '  }',
        '  increment() {',
        '    this.value += 1;',
        '    return this.value;',
        '  }',
        '}',
      ].join('\n'),
    ],
  },
  {
    id: 'python',
    label: 'Python',
    extension: 'py',
    indentation: 4,
    codes: [
      'def sum_values(values):\n    total = 0\n    for value in values:\n        total += value\n    return total',
      'def clamp(value, lower, upper):\n    if value < lower:\n        return lower\n    if value > upper:\n        return upper\n    return value',
      'def is_even(value):\n    remainder = value % 2\n    if remainder == 0:\n        return True\n    return False',
      'def reverse_text(text):\n    letters = list(text)\n    letters.reverse()\n    return "".join(letters)',
      'def count_vowels(text):\n    vowels = "aeiou"\n    total = 0\n    for letter in text.lower():\n        if letter in vowels:\n            total += 1\n    return total',
      'def maximum(values):\n    result = values[0]\n    for value in values:\n        if value > result:\n            result = value\n    return result',
      'def square_values(values):\n    squares = []\n    for value in values:\n        squares.append(value * value)\n    return squares',
      'def unique_values(values):\n    result = []\n    for value in values:\n        if value not in result:\n            result.append(value)\n    return result',
      'def is_palindrome(text):\n    letters = text.lower()\n    reversed_text = letters[::-1]\n    return letters == reversed_text',
      'def factorial(value):\n    result = 1\n    for number in range(2, value + 1):\n        result *= number\n    return result',
      'def fibonacci(count):\n    values = [0, 1]\n    while len(values) < count:\n        values.append(values[-1] + values[-2])\n    return values[:count]',
      'def average(values):\n    if not values:\n        return 0\n    total = sum(values)\n    return total / len(values)',
      'def title_case(text):\n    words = text.split()\n    titled = [word.capitalize() for word in words]\n    return " ".join(titled)',
      'def count_words(text):\n    words = text.split()\n    counts = {}\n    for word in words:\n        counts[word] = counts.get(word, 0) + 1\n    return counts',
      'def flatten(groups):\n    values = []\n    for group in groups:\n        for value in group:\n            values.append(value)\n    return values',
      'def sort_names(names):\n    result = list(names)\n    result.sort(key=str.casefold)\n    return result',
      'def first_duplicate(values):\n    seen = set()\n    for value in values:\n        if value in seen:\n            return value\n        seen.add(value)\n    return None',
      'def frequencies(values):\n    counts = {}\n    for value in values:\n        counts[value] = counts.get(value, 0) + 1\n    return counts',
      'from collections import Counter\n\ndef count_items(values):\n    counts = Counter(values)\n    return dict(counts)',
      'class Counter:\n    def __init__(self):\n        self.value = 0\n\n    def increment(self):\n        self.value += 1\n        return self.value',
    ],
  },
  {
    id: 'scala',
    label: 'Scala',
    extension: 'scala',
    indentation: 2,
    codes: [
      'def sumValues(values: Seq[Int]): Int = {\n  var total = 0\n  values.foreach(value => total += value)\n  total\n}',
      'def clamp(value: Int, lower: Int, upper: Int): Int = {\n  if (value < lower) lower\n  else if (value > upper) upper\n  else value\n}',
      'def isEven(value: Int): Boolean = {\n  val remainder = value % 2\n  remainder == 0\n}',
      'def reverseText(text: String): String = {\n  val letters = text.toList.reverse\n  letters.mkString\n}',
      'def frequencies(values: Seq[String]): Map[String, Int] = {\n  val counts = values.groupMapReduce(identity)(_ => 1)(_ + _)\n  counts\n}',
    ],
  },
  {
    id: 'php',
    label: 'PHP',
    extension: 'php',
    indentation: 4,
    codes: [
      '<?php\nfunction sumValues(array $values): int {\n    $total = 0;\n    foreach ($values as $value) {\n        $total += $value;\n    }\n    return $total;\n}',
      '<?php\nfunction clamp(int $value, int $lower, int $upper): int {\n    if ($value < $lower) {\n        return $lower;\n    }\n    if ($value > $upper) {\n        return $upper;\n    }\n    return $value;\n}',
      '<?php\nfunction reverseText(string $text): string {\n    $letters = str_split($text);\n    $reversed = array_reverse($letters);\n    return implode("", $reversed);\n}',
    ],
  },
  {
    id: 'java',
    label: 'Java',
    extension: 'java',
    indentation: 4,
    codes: [
      'int sumValues(int[] values) {\n    int total = 0;\n    for (int value : values) {\n        total += value;\n    }\n    return total;\n}',
      'int clamp(int value, int lower, int upper) {\n    if (value < lower) {\n        return lower;\n    }\n    return Math.min(value, upper);\n}',
      'boolean isEven(int value) {\n    int remainder = value % 2;\n    if (remainder == 0) {\n        return true;\n    }\n    return false;\n}',
      'String reverseText(String text) {\n    StringBuilder result = new StringBuilder();\n    for (int index = text.length() - 1; index >= 0; index--) {\n        result.append(text.charAt(index));\n    }\n    return result.toString();\n}',
      'int factorial(int value) {\n    int result = 1;\n    for (int number = 2; number <= value; number++) {\n        result *= number;\n    }\n    return result;\n}',
    ],
  },
  {
    id: 'csharp',
    label: 'C#',
    extension: 'cs',
    indentation: 4,
    codes: [
      'int SumValues(int[] values) {\n    var total = 0;\n    foreach (var value in values) {\n        total += value;\n    }\n    return total;\n}',
      'int Clamp(int value, int lower, int upper) {\n    if (value < lower) {\n        return lower;\n    }\n    return Math.Min(value, upper);\n}',
      'bool IsEven(int value) {\n    var remainder = value % 2;\n    if (remainder == 0) {\n        return true;\n    }\n    return false;\n}',
      'string ReverseText(string text) {\n    var letters = text.ToCharArray();\n    Array.Reverse(letters);\n    return new string(letters);\n}',
      'int Factorial(int value) {\n    var result = 1;\n    for (var number = 2; number <= value; number++) {\n        result *= number;\n    }\n    return result;\n}',
    ],
  },
  {
    id: 'go',
    label: 'Go',
    extension: 'go',
    indentation: 4,
    codes: [
      'func sumValues(values []int) int {\n    total := 0\n    for _, value := range values {\n        total += value\n    }\n    return total\n}',
      'func clamp(value, lower, upper int) int {\n    if value < lower {\n        return lower\n    }\n    if value > upper {\n        return upper\n    }\n    return value\n}',
      'func isEven(value int) bool {\n    remainder := value % 2\n    if remainder == 0 {\n        return true\n    }\n    return false\n}',
      'func reverseText(text string) string {\n    runes := []rune(text)\n    for left, right := 0, len(runes)-1; left < right; left, right = left+1, right-1 {\n        runes[left], runes[right] = runes[right], runes[left]\n    }\n    return string(runes)\n}',
      'func squareValues(values []int) []int {\n    squares := make([]int, len(values))\n    for index, value := range values {\n        squares[index] = value * value\n    }\n    return squares\n}',
    ],
  },
  {
    id: 'rust',
    label: 'Rust',
    extension: 'rs',
    indentation: 4,
    codes: [
      'fn sum_values(values: &[i32]) -> i32 {\n    let mut total = 0;\n    for value in values {\n        total += value;\n    }\n    total\n}',
      'fn clamp(value: i32, lower: i32, upper: i32) -> i32 {\n    if value < lower {\n        return lower;\n    }\n    value.min(upper)\n}',
      'fn is_even(value: i32) -> bool {\n    let remainder = value % 2;\n    if remainder == 0 {\n        return true;\n    }\n    false\n}',
      'fn reverse_text(text: &str) -> String {\n    let letters: String = text.chars().rev().collect();\n    letters\n}',
      'fn square_values(values: &[i32]) -> Vec<i32> {\n    let mut squares = Vec::new();\n    for value in values {\n        squares.push(value * value);\n    }\n    squares\n}',
    ],
  },
  {
    id: 'cpp',
    label: 'C++',
    extension: 'cpp',
    indentation: 4,
    codes: [
      'int sumValues(const std::vector<int>& values) {\n    int total = 0;\n    for (int value : values) {\n        total += value;\n    }\n    return total;\n}',
      'int clamp(int value, int lower, int upper) {\n    if (value < lower) {\n        return lower;\n    }\n    return std::min(value, upper);\n}',
      'bool isEven(int value) {\n    int remainder = value % 2;\n    if (remainder == 0) {\n        return true;\n    }\n    return false;\n}',
      'std::string reverseText(const std::string& text) {\n    std::string result(text.rbegin(), text.rend());\n    return result;\n}',
      'std::vector<int> squareValues(const std::vector<int>& values) {\n    std::vector<int> squares;\n    for (int value : values) {\n        squares.push_back(value * value);\n    }\n    return squares;\n}',
    ],
  },
] as const satisfies readonly ExerciseSet[]

export type LanguageId = (typeof exerciseSets)[number]['id']

export const languages: readonly LanguageOption[] = exerciseSets.map(
  ({ id, label, extension, indentation }) => ({
    id,
    label,
    extension,
    indentation,
  }),
)

export const snippets: readonly CodeSnippet[] = exerciseSets.flatMap(
  ({ id, label, extension, indentation, codes }) =>
    codes.map((code, index) => ({
      id: `${id}-${index + 1}`,
      languageId: id,
      language: label,
      filename: `task-${String(index + 1).padStart(2, '0')}.${extension}`,
      code,
      indentation,
    })),
)

export function getExercisesForLanguage(languageId: LanguageId): readonly CodeSnippet[] {
  return snippets.filter((snippet) => snippet.languageId === languageId)
}
