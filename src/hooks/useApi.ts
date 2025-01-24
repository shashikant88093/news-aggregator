import axios, { AxiosInstance } from "axios";
import { useState, useEffect, useRef } from "react";
import { ApiResponse } from "../type/Api";

// API keys from environment variables
const apiKeys = {
  newsApiKey: import.meta.env.VITE_NEWS_API_KEY,
  guardianApiKey: import.meta.env.VITE_GUARDIANAPI_KEY,
  newsdataApiKey: import.meta.env.VITE_NEWS_API_DATA_KEY,
};

// Function to construct the API URL based on the endpoint
const constructUrl = (
  baseUrl: string,
  { date, keyWord }: { date?: string | null; keyWord?: string | null } = {}
): string => {
  if (baseUrl === "https://content.guardianapis.com") {
    return `${baseUrl}/tags?q=${keyWord}&from-date=${date}&api-key=${apiKeys.guardianApiKey}`;
  } else if (baseUrl === "https://newsdata.io/api/1") {
    return `${baseUrl}/latest?apikey=${apiKeys.newsdataApiKey}&q=${keyWord}&language=en`;
  } else if (baseUrl === "https://newsapi.org/v2") {
    return `${baseUrl}/everything?q=${keyWord}&from=${date}&apiKey=${apiKeys.newsApiKey}`;
  }
  return "";
};

// Custom React hook to fetch data from APIs
const useApi = <T extends ApiResponse>(
  baseUrl: string,
  { date, keyWord }: { date?: string | null; keyWord?: string | null } = {}
): { data: T | null; isLoading: boolean; error: string | null } => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a reusable Axios instance with configurations
  const axiosInstance = useRef<AxiosInstance>(
    axios.create({
      headers: {
        Upgrade: "HTTP/2.0", // Use appropriate protocol upgrade if required by the server
      },
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!baseUrl) return;

      setIsLoading(true);
      setError(null); // Clear any previous error at the start of the API call
      const customUrl = constructUrl(baseUrl, { date, keyWord });

      try {
        const response = await axiosInstance.current.get(customUrl);
        const formattedData = formatApiResponse(baseUrl, response.data);
        setData(formattedData as T);
      } catch (err: any) {
        console.error("Error fetching data:", err.response || err.message);
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [baseUrl, date, keyWord]); // Dependencies trigger new fetch when they change

  return { data, isLoading, error };
};

// Utility function to format API responses
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

export default useApi;
