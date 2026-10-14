export interface Quote {
  quote: string;
  author: string;
}

interface QuoteApiResponse {
  q: string;
  a: string;
}

export async function getRandomQuote(): Promise<Quote> {
  const response = await fetch("https://zenquotes.io/api/random");

  if (!response.ok) {
    throw new Error("Não foi possível carregar a frase motivacional.");
  }

  const data: QuoteApiResponse[] = await response.json();

  if (!data.length || !data[0].q || !data[0].a) {
    throw new Error("A API retornou uma resposta inválida.");
  }

  return {
    quote: data[0].q,
    author: data[0].a,
  };
}