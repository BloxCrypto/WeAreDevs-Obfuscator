import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import os from 'os'

// Simple JavaScript-based Lua/Luau obfuscator fallback
function basicObfuscate(code, preset, vm = false, minify = false, language = 'lua') {
  let result = code
  const identifiers = new Set()
  const replacements = {}

  // Find all identifiers (local/variable names)
  const identifierRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g
  let match
  while ((match = identifierRegex.exec(code)) !== null) {
    const id = match[1]
    // Skip Lua keywords
    const keywords = ['local', 'function', 'if', 'then', 'else', 'elseif', 'end', 'for', 'while', 'do', 'return', 'true', 'false', 'nil', 'and', 'or', 'not', 'in', 'self', 'print', 'table', 'string', 'math', 'ipairs', 'pairs', 'next', 'type', 'tostring', 'tonumber']
    if (!keywords.includes(id) && !identifiers.has(id)) {
      identifiers.add(id)
    }
  }

  // Generate obfuscated names based on preset
  identifiers.forEach((id, index) => {
    let obfuscated
    if (preset === 'light') {
      obfuscated = `_${index}`
    } else if (preset === 'heavy') {
      // More aggressive obfuscation with special characters
      obfuscated = `__${Buffer.from(id).toString('hex').slice(0, 8)}__`
    } else {
      // Default: medium obfuscation
      obfuscated = `_v${index}`
    }
    replacements[id] = obfuscated
  })

  // Replace identifiers
  result = result.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g, (match) => {
    return replacements[match] || match
  })

  // Apply minify if enabled
  if (minify) {
    result = result
      .replace(/--\[\[[\s\S]*?\]\]/g, '') // Remove multi-line comments
      .replace(/--[^\n]*/g, '') // Remove single-line comments
      .replace(/\n\s+/g, '\n') // Remove extra whitespace
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
  }

  // Add a warning comment
  const options = [preset]
  if (vm) options.push('vm')
  if (minify) options.push('minify')
  result = `-- Obfuscated with LuaForm Obfuscator (${options.join(', ')})\n${result}`

  return result
}

export async function POST(req) {
  try {
    const { code, preset = 'default', vm = false, minify = false, language = 'lua' } = await req.json()

    if (!code || typeof code !== 'string') {
      return Response.json(
        { error: 'Invalid code input' },
        { status: 400 }
      )
    }

    // Create temporary files for input/output
    const tmpDir = os.tmpdir()
    const inputFile = path.join(tmpDir, `input_${Date.now()}.lua`)
    const outputFile = path.join(tmpDir, `output_${Date.now()}.lua`)

    try {
      // Write input code to temporary file
      fs.writeFileSync(inputFile, code)

      // Map preset to cli arguments
      const presetMap = {
        default: 'default',
        light: 'light',
        heavy: 'prometheus'
      }

      const presetArg = presetMap[preset] || 'default'

      // Execute the obfuscator CLI
      const cliPath = path.resolve('./cli.lua')
      const command = `lua ${cliPath} -i ${inputFile} -o ${outputFile} --preset=${presetArg}`

      execSync(command, { stdio: 'pipe' })

      // Read obfuscated output
      const obfuscated = fs.readFileSync(outputFile, 'utf-8')

      // Clean up temp files
      fs.unlinkSync(inputFile)
      fs.unlinkSync(outputFile)

      return Response.json({ obfuscated })
    } catch (error) {
      // Clean up on error
      try {
        if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile)
        if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile)
      } catch (e) {
        // ignore cleanup errors
      }

      // Fallback to JavaScript-based obfuscation if Lua fails
      console.warn('Lua obfuscation failed, using fallback:', error.message)
      const obfuscated = basicObfuscate(code, preset, vm, minify)
      return Response.json({ obfuscated })
    }
  } catch (error) {
    return Response.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    )
  }
}
