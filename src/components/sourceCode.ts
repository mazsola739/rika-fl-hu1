/**
 * Cuts one function out of a module's source (imported with `?raw`), so a page can show the code
 * behind an example. The modules are formatted by Biome: top-level declarations start at the
 * beginning of a line, after an empty line, with their doc comment right above them.
 */

type Declaration = { name: string; code: string }

const NAME = /^(?:export\s+)?(?:async\s+)?(?:function\*?|const|let)\s+([\w$]+)/m

function declarations(source: string): Declaration[] {
  const chunks: string[][] = []
  let afterEmptyLine = true
  for (const line of source.split('\n')) {
    if (line.trim() === '') {
      afterEmptyLine = true
      chunks.at(-1)?.push(line)
      continue
    }
    if (afterEmptyLine && !/^\s/.test(line)) {
      chunks.push([])
    }
    afterEmptyLine = false
    chunks.at(-1)?.push(line)
  }

  const result: Declaration[] = []
  for (const chunk of chunks) {
    const code = chunk.join('\n').trimEnd()
    const name = NAME.exec(code)?.[1]
    if (name) {
      result.push({ name, code })
    }
  }
  return result
}

/**
 * The source of the named function, with the other declarations of the module it uses
 * (helpers and constants) above it. Undefined when the module has no such declaration.
 */
export function functionSource(source: string, name: string): string | undefined {
  const all = declarations(source)
  const byName = new Map(all.map((declaration) => [declaration.name, declaration]))
  if (!byName.has(name)) {
    return undefined
  }

  const used = new Set<string>()
  const visit = (current: string) => {
    if (used.has(current)) return
    used.add(current)
    const code = byName.get(current)?.code ?? ''
    for (const other of all) {
      if (other.name !== current && new RegExp(`\\b${other.name}\\b`).test(code)) {
        visit(other.name)
      }
    }
  }
  visit(name)

  // In the order of the module, so helpers come before the function that uses them.
  return all
    .filter((declaration) => used.has(declaration.name))
    .map((declaration) => declaration.code)
    .join('\n\n')
}

/** The name of the called function in an example call like `flipOver('Rika')`. */
export function calledFunction(call: string): string | undefined {
  return /^([\w$]+)\s*\(/.exec(call.trim())?.[1]
}
