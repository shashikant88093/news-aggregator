import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = "Search...",
    onSearch,
}) => {
    const [query, setQuery] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleSearch = () => {
        onSearch(query);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="search-bar">
            <TextField
                variant="outlined"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                size="small"
            />
            <Button variant="contained" color="primary" onClick={handleSearch}
            sx={{
                paddingBottom: 1,
            }}
            >
                Search
            </Button>
        </div>
    );
};


export default SearchBar;