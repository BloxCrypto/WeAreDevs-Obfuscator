import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import os from 'os'

export async function POST(req) {
  try {
    const { code, preset = 'default' } = await req.json()

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

      // Return error message
      const errorMsg = error.stderr?.toString() || error.message || 'Obfuscation failed'
      return Response.json(
        { error: errorMsg },
        { status: 500 }
      )
    }
  } catch (error) {
    return Response.json(
      { error: 'Server error: ' + error.message },
      { status: 500 }
    )
  }
}
