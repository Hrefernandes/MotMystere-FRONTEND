import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const API_URL = 'https://trouve-mot.fr/api/size'
const OUTPUT_DIRECTORY = __dirname

async function fetchWords(size) {
  const response = await fetch(`${API_URL}/${size}/600`)

  if (!response.ok) {
    throw new Error(
      `Erreur lors de la récupération des mots de ${size} lettres : ${response.status}`,
    )
  }

  const words = await response.json()

  if (!Array.isArray(words)) {
    throw new Error(`La réponse de l'API pour les mots de ${size} lettres est invalide.`)
  }

  return [...new Set(
    words
      .map((word) => word?.name?.trim().toLowerCase())
      .filter((word) => word && word.length === size),
  )].sort()
  .slice(0, 500)
}

async function createWordList(size) {
  const words = await fetchWords(size)
  const outputPath = path.join(
    OUTPUT_DIRECTORY,
    `mots_solutions_${size}.json`,
  )

  await writeFile(
    outputPath,
    `${JSON.stringify(words, null, 2)}\n`,
    'utf8',
  )

  console.log(`${words.length} mots écrits dans ${outputPath}`)
}

async function main() {
  await mkdir(OUTPUT_DIRECTORY, { recursive: true })

  await Promise.all([
    createWordList(6),
    createWordList(7),
  ])
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})