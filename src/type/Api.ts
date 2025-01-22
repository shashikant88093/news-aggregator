interface ApiResponse {
    status: string;
    message?: string;
    totalResults?: number;
    articles?: Article[];
  }
  
  interface Article {
    id?: string;
    type?: string;
    sectionId?: string;
    sectionName?: string;
    webPublicationDate?: string;
    webTitle?: string;
    webUrl?: string;
    apiUrl?: string;
    title?: string;
    description?: string;
    source?: { id?: string; name?: string };
    creator?: string[];
    image_url?: string;
    category?: string[];
  }

  interface ArticleListData {
    title: string;
    description: string;
    webUrl: string;
    image_url: string;
    webPublicationDate: string; // Added date property
}

interface MenuItemProps {
    value: string;
    label: string;
  }


interface HeaderProps {
  title: string;
}

  export type { ApiResponse, Article, ArticleListData, MenuItemProps ,
    HeaderProps
  };