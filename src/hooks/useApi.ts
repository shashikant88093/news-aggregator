import axios, { AxiosInstance } from "axios";
import { useState, useEffect, useRef } from "react";
import { ApiResponse } from "../type/Api";



const apiKeys = {
  newsApiKey: import.meta.env.VITE_NEWS_API_KEY,
  guardianApiKey: import.meta.env.VITE_GUARDIANAPI_KEY,
  newsdataApiKey: import.meta.env.VITE_NEWS_API_DATA_KEY,
};

// Handles API URL construction based on the endpoint
const constructUrl = (
  baseUrl: string,
  { date, keyWord }: { date?: string | null; keyWord?: string | null } = {}
): string => {
  if (baseUrl === "https://content.guardianapis.com") {
    // https://content.guardianapis.com/search?tq=news&from-date=2014-01-01&api-key=d9081210-def2-420a-a331-57b67c014c07
    return `${baseUrl}/tags?&q=${keyWord}&from-date=${date}&api-key=${apiKeys.guardianApiKey}`;
  } else if (baseUrl === "https://newsdata.io/api/1") {
    // https://newsdata.io/api/1/archive?apikey=pub_66111e9b448f4d5e3d2080dded7e8293d6cd3&q=example&language=en&from_date=2023-01-19&to_date=2023-01-25
    // https://newsdata.io/api/1/latest?apikey=pub_66111e9b448f4d5e3d2080dded7e8293d6cd3&q=sports&language=en
    // use the latest endpoint for the latest news because archive endpoint is paid it only supports days filter
    // for paid users
    // return `${baseUrl}/archive?apikey=${apiKeys.newsdataApiKey}&q=${keyWord}&language=en&from_date=${date}&to_date=${date}`;
    return `${baseUrl}/latest?apikey=${apiKeys.newsdataApiKey}&q=${keyWord}&language=en`;
  } else if (baseUrl === "https://newsapi.org/v2") {
    // https://newsapi.org/v2/everything?q=bitcoin&from=2023
    return `https://newsapi.org/v2/everything?q=${keyWord}&from=${date}&apiKey=${apiKeys.newsApiKey}`;
  }
  return "";
};

// Custom React hook to fetch data
const useApi = <T extends ApiResponse>(
  baseUrl: string,
  { date, keyWord }: { date?: string | null; keyWord?: string | null } = {}
): { data: T | null; isLoading: boolean; error: string | null } => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const axiosInstance = useRef<AxiosInstance>(axios.create());

  useEffect(() => {
    const fetchData = async () => {
      if (!baseUrl) return;

      setIsLoading(true);
      const customUrl = constructUrl(baseUrl, { date, keyWord });

      try {
        const response = await axiosInstance.current.get(customUrl);
        const formattedData = formatApiResponse(baseUrl, response.data);
        setData(formattedData as T);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [baseUrl, date, keyWord]);

  return { data, isLoading, error };
};

// Utility to format responses from various APIs
const formatApiResponse = (baseUrl: string, rawData: any): ApiResponse => {
  if (baseUrl.startsWith("https://content.guardianapis.com")) {
    return {
      status: rawData.response.status,
      totalResults: rawData.response.total,
      articles: rawData.response.results.map((article: any) => ({
        id: article.id,
        type: article.type,
        sectionId: article.sectionId,
        sectionName: article.sectionName,
        webPublicationDate: article.webPublicationDate,
        title: article.webTitle,
        webUrl: article.webUrl,
        apiUrl: article.apiUrl,
        category: article.pillarName,
      })),
    };
  }

  if (baseUrl.startsWith("https://newsdata.io")) {
    return {
      status: rawData.status,
      totalResults: rawData.totalResults,
      articles: rawData.results.map((article: any) => ({
        title: article.title,
        description: article.description,
        image_url: article.image_url,
        category: article.category,
        webUrl: article.source_url,
        webPublicationDate: article.pubDate,
        sectionName: article.source_name,
      })),
    };
  }

  if (baseUrl.startsWith("https://newsapi.org")) {
    return {
      status: rawData.status,
      totalResults: rawData.totalResults,
      articles: rawData.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        webPublicationDate: article.publishedAt,
        webUrl: article.url,
        sectionName: article.source.name,
        image_url: article.urlToImage,
      })),
    };
  }

  throw new Error("Unsupported API endpoint");
};

// Standalone utility function for API calls
// const apiCall = async (
//   url: string,
//   { date, keyWord }: { date?: string | null; keyWord?: string | null } = {}
// ): Promise<ApiResponse> => {
//   const customUrl = constructUrl(url, { date, keyWord });
//   const response = await axios.get(customUrl);
//   return formatApiResponse(url, response.data);
// };

export default useApi;
