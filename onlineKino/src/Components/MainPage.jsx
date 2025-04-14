import React, { useEffect, useState } from "react";
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
  Form,
  Modal,
  Input,
  message,
  Spin,
} from "antd";
import {
  PlayCircleOutlined,
  StarFilled,
  UserOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { getMovies } from "../features/moviesThunk";
import { getReviews } from "../features/reviewsThunk";
import {
  setCredentials,
  selectCurrentRole,
  selectCurrentLogin,
} from "../features/authSlice";

import "../Components/movie-styles.css";

const { Meta } = Card;
const { Title, Paragraph, Text } = Typography;
const { Header, Content, Footer } = Layout;

const MainPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // локальное состояние модалки и формы
  const [authVisible, setAuthVisible] = useState(false);
  const [form] = Form.useForm();

  // авторизационные данные из Redux
  const userRole = useSelector(selectCurrentRole);
  const login = useSelector(selectCurrentLogin);

  // фильмы и отзывы из Redux
  const {
    data: movies,
    status: moviesStatus,
    error: moviesError,
  } = useSelector((state) => state.movies);
  const {
    data: reviews,
    status: reviewsStatus,
    error: reviewsError,
  } = useSelector((state) => state.reviews);

  // загрузка данных
  useEffect(() => {
    dispatch(getMovies());
    dispatch(getReviews());
  }, [dispatch, login]);

  // обработчик логина (GET /api/Users/Auth?login=...&password=...)
  const handleLogin = async () => {
    try {
      const values = await form.validateFields();
      const response = await axios.get(
        "https://localhost:7041/api/Users/Auth",
        { params: { login: values.login, password: values.password } }
      );
      const data = response.data;

      if (data.status === 1) {
        // сохраняем в Redux: token, роль и логин
        dispatch(
          setCredentials({
            token: data.token,
            role: data.role,
            login: data.login,
          })
        );
        message.success("Успешный вход");
        setAuthVisible(false);
        form.resetFields();
      } else {
        message.error("Неверный логин или пароль");
      }
    } catch (err) {
      console.error(err);
      message.error("Ошибка при авторизации");
    }
  };

  // пока грузятся — спиннер
  if (moviesStatus === "loading" || reviewsStatus === "loading") {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Загрузка..." />
      </div>
    );
  }
  // ошибки загрузки
  if (moviesError || reviewsError) {
    return (
      <div className="error-message">Ошибка: {moviesError || reviewsError}</div>
    );
  }

  // вспомогательная функция для демонстрационного рейтинга
  const getRandomRating = () => (Math.random() * 5).toFixed(1);

  return (
    <div className="layout">
      {/* Header */}
      <div className="navbar">
        <div className="navbar-container">
          <div className="logo">
            <img
              src="src\assets\—Pngtree—movie time lettering neon sign_6531275.png"
              alt=""
            />
            <span className="logo-text">ONLINE MOVIES</span>
          </div>
          <Space>
            {/* Если пользователь авторизован — приветствие */}
            {login ? (
              <Text style={{ color: "#fff", marginRight: 12 }}>
                Привет, {login}
              </Text>
            ) : (
              <Button
                type="primary"
                icon={<UserOutlined />}
                onClick={() => setAuthVisible(true)}
              >
                Авторизация
              </Button>
            )}
            {/* Кнопка админ-панели только для роли Admin */}
            {userRole === "Admin" && (
              <Button type="primary" onClick={() => navigate("/admin")}>
                Админ панель
              </Button>
            )}
          </Space>
        </div>
      </div>

      {/* Content */}
      <div className="movie-page">
        <div className="movie-container">
          <Row gutter={[24, 24]} justify="center">
            {Array.isArray(movies) &&
              movies.map((movie) => {
                const movieReviews = Array.isArray(reviews)
                  ? reviews.filter((r) => r.movieId === movie.id)
                  : [];
                const rating = getRandomRating();

                return (
                  <Col key={movie.id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      className="movie-card"
                      style={{ width: 240 }}
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
                        title={<Title level={4}>{movie.name}</Title>}
                        description={
                          <Space wrap>
                            {movie.genres.split(", ").map((g, i) => (
                              <Tag key={i}>{g}</Tag>
                            ))}
                          </Space>
                        }
                      />
                      {movieReviews.length > 0 && (
                        <>
                          <Divider />
                          <div className="reviews-container">
                            <List
                              dataSource={movieReviews.slice(0, 5)}
                              renderItem={(review, idx) => (
                                <List.Item key={idx}>
                                  <List.Item.Meta
                                    avatar={
                                      <Avatar
                                        src={`https://i.pravatar.cc/150?img=${
                                          idx + 1
                                        }`}
                                      />
                                    }
                                    title={<Text strong>Пользователь</Text>}
                                    description={
                                      <Paragraph ellipsis={{ rows: 2 }}>
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
      </div>

      <div
        style={{
          backgroundColor: "#ffb300",
          color: "rgb(255, 255, 255)",
          padding: "25px 50px",
          width: "100%",
          boxSizing: "border-box",
          marginTop: "auto",
        }}
      >
        <div className="footer-content">
          <div className="copyright">
            © Created by Wizzkung. Все права защищены.
          </div>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookOutlined />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterOutlined />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramOutlined />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <YoutubeOutlined />
            </a>
          </div>
        </div>
      </div>

      {/* Modal авторизации */}
      <Modal
        title="Авторизация"
        visible={authVisible}
        onOk={handleLogin}
        onCancel={() => setAuthVisible(false)}
        okText="Войти"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="login"
            label="Логин"
            rules={[{ required: true, message: "Введите логин" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true, message: "Введите пароль" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MainPage;
