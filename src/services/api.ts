
export interface Quote {
  quote: string;
  author: string;
}

interface QuoteApiResponse {
  q: string;
  a: string;
}

export async function getRandomQuote(): Promise<Quote> {
  try {
    const response = await fetch("https://zenquotes.io/api/random");

    if (!response.ok) {
      throw new Error(
        `Erro HTTP ${response.status}: ${response.statusText}`,
      );
    }

    const data: QuoteApiResponse[] = await response.json();

    if (!Array.isArray(data) || !data[0]?.q || !data[0]?.a) {
      throw new Error("A API retornou uma resposta inválida.");
    }

    return {
      quote: data[0].q,
      author: data[0].a,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro em getRandomQuote:", error.message);
    } else {
      console.error("Erro desconhecido ao buscar frase:", error);
    }

    throw new Error(
      "Não foi possível carregar a frase motivacional. Verifique a conexão ou tente novamente.",
    );
  }
}
