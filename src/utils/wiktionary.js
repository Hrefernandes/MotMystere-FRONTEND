const API_USER_AGENT =
  'MotMystere-FRONTEND/1.0 (https://github.com/Hrefernandes/MotMystere-FRONTEND)'

function normalizeWord(word) {
  return word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
}

export async function findFrenchWiktionaryTitle(word) {
  const normalizedWord = normalizeWord(word)

  const searchParams = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: word,
    srnamespace: '0',
    srlimit: '50',
    format: 'json',
    origin: '*',
  })

  const searchResponse = await fetch(
    `https://fr.wiktionary.org/w/api.php?${searchParams.toString()}`,
    {
      headers: {
        'Api-User-Agent': API_USER_AGENT,
      },
    },
  )

  if (!searchResponse.ok) {
    throw new Error('Impossible de contacter le Wiktionnaire')
  }

  const searchData = await searchResponse.json()
  const searchResults = searchData.query?.search ?? []

  const matchingTitles = searchResults
    .map((result) => result.title)
    .filter((title) => normalizeWord(title) === normalizedWord)

  if (matchingTitles.length === 0) {
    return null
  }

  const categoryParams = new URLSearchParams({
    action: 'query',
    titles: matchingTitles.join('|'),
    prop: 'categories',
    cllimit: 'max',
    format: 'json',
    origin: '*',
  })

  const categoryResponse = await fetch(
    `https://fr.wiktionary.org/w/api.php?${categoryParams.toString()}`,
    {
      headers: {
        'Api-User-Agent': API_USER_AGENT,
      },
    },
  )

  if (!categoryResponse.ok) {
    throw new Error('Impossible de récupérer les catégories Wiktionary')
  }

  const categoryData = await categoryResponse.json()
  const pages = Object.values(categoryData.query?.pages ?? {})

  const frenchPage = pages.find((page) =>
    page.categories?.some((category) =>
      normalizeWord(category.title).includes('en francais'),
    ),
  )

  return frenchPage?.title ?? null
}