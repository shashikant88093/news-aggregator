import React, { useState, useEffect, memo, useCallback } from "react";
import { Container, Paper, Typography, Select, MenuItem, CircularProgress, Alert, Grid } from "@mui/material";
import ArticleList from "../articlelist/ArticleList";
import FilterBar from "../filterbar/FilterBar";
import { SelectChangeEvent } from "@mui/material/Select";
import dayjs from "dayjs";
import useApi from "../../hooks/useApi";
import SearchBar from "../searchbar/SearchBar";
import { ApiResponse } from "../../type/Api";

const apiEndpoints = {
  newsApi:import.meta.env.VITE_NEWS_API,
  guardianApi: import.meta.env.VITE_GUARDIANAPI,
  newsdataApi: import.meta.env.VITE_NEWS_API_DATA,
};



// console.log("API Endpoints:", apiEndpoints);
const ApiSelector: React.FC = memo(() => {
  const [selectedApi, setSelectedApi] = useState<string>(apiEndpoints.guardianApi);
  const [apiData, setApiData] = useState<any[]>([]);
  const [date, setDate] = useState<string>(dayjs().subtract(1, "day").format("YYYY-MM-DD"));
  const [category, setCategory] = useState<string>("all");
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const { data, isLoading, error } = useApi<ApiResponse>(selectedApi, {
    date,
    keyWord: category,
  });

  

  useEffect(() => {
    if (data?.articles?.length) {
      setApiData(data.articles);
      setFilteredData(data.articles);
    }
  }, [data]);

  const handleSearch = (keyword: string) => {

    // Filter articles based on the title
    const filteredArticles = apiData.filter((article) => {
      return article.title.toLowerCase().includes(keyword.toLowerCase());
    });

    // console.log("Filtered Articles:", filteredArticles);

    // Set filtered data or reset if no articles match the keyword
    if (filteredArticles.length) {
      setFilteredData(filteredArticles);
    } else {
      setFilteredData([]); // No results found, set an empty array
    }
  };

  const handleApiChange = useCallback((event: SelectChangeEvent<string>) => {
    setSelectedApi(event.target.value as string);
  }, []);

  const handleFilter = useCallback(
    (filters: { date?: string; category?: string }) => {
      setDate(filters.date ? dayjs(filters.date).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"));
      setCategory(filters.category || "");
    },
    []
  );

  return (
    <Container    maxWidth="xl">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          News Source Selector
        </Typography>

        <Select value={selectedApi} onChange={handleApiChange} fullWidth size="small">
          {Object.entries(apiEndpoints).map(([apiName, apiUrl]) => (
            <MenuItem key={apiName} value={apiUrl}>
              {apiName}
            </MenuItem>
          ))}
        </Select>
      </Paper>

      <Paper elevation={3} sx={{ padding: 3, marginTop: 1 }}>
        <FilterBar onFilter={handleFilter} />
      </Paper>

      <Paper elevation={3} sx={{ padding: 3, marginTop: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SearchBar placeholder="Search with title" onSearch={handleSearch} />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ padding: 3, marginTop: 1 }}>
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <CircularProgress />
          </div>
        ) : error ? (
          <Alert severity="error" sx={{ marginBottom: 3 }}>
            {error}
          </Alert>
        ) : filteredData?.length > 0 ? (
          <>
            <Typography variant="h6" gutterBottom>
              Top Headlines
            </Typography>
            <ArticleList articles={filteredData} />
          </>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No data available.
          </Typography>
        )}
      </Paper>
    </Container>
  );
});

export default ApiSelector;
