"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Row,
  Col,
  List,
  Typography,
  Tag,
  Divider,
  Avatar,
  Space,
  Layout,
  Button,
} from "antd";
import { PlayCircleOutlined, StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getMovies } from "../features/moviesThunk";
import { getReviews } from "../features/reviewsThunk";
import "../Components/movie-styles.css";

const { Meta } = Card;
const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const MainPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Получаем фильмы из состояния movies
  const {
    list: movies,
    status: moviesStatus,
    error: moviesError,
  } = useSelector((state) => state.movies);

  // Получаем отзывы из состояния reviews
  const {
    data: reviews,
    status: reviewsStatus,
    error: reviewsError,
  } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(getMovies());
    dispatch(getReviews());
  }, [dispatch]);

  if (moviesError)
    return <div className="error-message">Ошибка: {moviesError}</div>;
  if (reviewsError)
    return <div className="error-message">Ошибка: {reviewsError}</div>;

  // Функция для получения случайного рейтинга (для демонстрации)
  const getRandomRating = () => (Math.random() * 5).toFixed(1);

  return (
    <nav className="navbar">
      <Layout className="layout">
        <Content className="movie-page">
          <div className="movie-container">
            <Title level={2} className="page-title">
              Online Movies
            </Title>

            {/* Кнопка для перехода в админ панель */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Button type="primary" onClick={() => navigate("/admin")}>
                Админ панель
              </Button>
            </div>

            <Row gutter={[24, 24]} justify="center">
              {movies.map((movie) => {
                // Фильтруем отзывы по movie.id
                const movieReviews = reviews.filter(
                  (review) => review.movieId === movie.id
                );

                // Случайный рейтинг для демонстрации
                const rating = getRandomRating();

                return (
                  <Col key={movie.id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      className="movie-card"
                      style={{ width: 240 }}
                      // При клике переходим на страницу деталей
                      onClick={() => navigate(`/movie/${movie.id}`)}
                      cover={
                        <div className="poster-container">
                          <img
                            alt={movie.name}
                            src={movie.posterUrl || "/placeholder.svg"}
                            className="movie-poster"
                          />
                          <div className="poster-overlay">
                            <PlayCircleOutlined className="play-icon" />
                          </div>
                          <div className="rating-badge">
                            <StarFilled /> {rating}
                          </div>
                        </div>
                      }
                    >
                      <Meta
                        title={
                          <Title level={4} style={{ marginBottom: 8 }}>
                            {movie.name}
                          </Title>
                        }
                        description={
                          <Space size={[0, 8]} wrap>
                            {movie.genres.split(", ").map((genre, idx) => (
                              <Tag
                                key={idx}
                                color="processing"
                                style={{ marginBottom: 8 }}
                              >
                                {genre}
                              </Tag>
                            ))}
                          </Space>
                        }
                      />

                      {movieReviews.length > 0 && (
                        <>
                          <Divider style={{ margin: "12px 0" }} />
                          <div className="reviews-container">
                            <List
                              itemLayout="horizontal"
                              dataSource={movieReviews.slice(0, 10)}
                              renderItem={(review, index) => (
                                <List.Item style={{ padding: "8px 0" }}>
                                  <List.Item.Meta
                                    avatar={
                                      <Avatar
                                        src={`https://i.pravatar.cc/150?img=${
                                          index + 10
                                        }`}
                                      />
                                    }
                                    title={<Text strong>Пользователь</Text>}
                                    description={
                                      <Paragraph
                                        ellipsis={{ rows: 2 }}
                                        style={{
                                          fontSize: "12px",
                                          color: "rgba(0, 0, 0, 0.65)",
                                        }}
                                      >
                                        {review.comment}
                                      </Paragraph>
                                    }
                                  />
                                </List.Item>
                              )}
                            />
                          </div>
                        </>
                      )}
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        </Content>
      </Layout>
    </nav>
  );
};

export default MainPage;
