// src/components/ArticleList.tsx
import React from "react";
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Link,
} from "@mui/material";

import { ArticleListData } from "../../type/Api";


interface ArticleListProps {
    articles: ArticleListData[];
}

const truncateText = (text: string, maxLength: number) => {
    return text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
    return (
        <div>
            <Grid container spacing={2}>
                {articles.map((article) => (
                    <Grid item xs={12} sm={6} md={4} key={article.title}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={article?.image_url || "https://via.placeholder.com/140"}
                                alt={article?.title}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {article?.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {truncateText(article?.description, 100)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(article?.webPublicationDate).toLocaleDateString()}
                                </Typography>
                                <Link href={article?.webUrl} target="_blank" rel="noopener">
                                    Read More
                                </Link>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default ArticleList;
