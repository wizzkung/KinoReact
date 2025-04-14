"use client";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { Button, Card, Typography, Tag, Row, Col, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeftOutlined,
  StarFilled,
  UserOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { selectCurrentRole, selectCurrentLogin } from "../features/authSlice";
import { getMovies } from "../features/moviesThunk";
import { useEffect } from "react";
import "../Components/movie-styles.css";

const { Title, Paragraph, Text } = Typography;

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Получение данных из Redux
  const movie = useSelector((state) =>
    state.movies.data.find((m) => m.id === Number.parseInt(id, 10))
  );
  const reviews = useSelector((state) =>
    state.reviews.data.filter((r) => r.movieId === Number.parseInt(id, 10))
  );
  const login = useSelector(selectCurrentLogin);
  const userRole = useSelector(selectCurrentRole);
  const moviesStatus = useSelector((state) => state.movies.status);
  const moviesError = useSelector((state) => state.movies.error);

  // Загрузка фильмов, если данные отсутствуют
  useEffect(() => {
    if (moviesStatus === "idle" || moviesStatus === "failed") {
      dispatch(getMovies());
    }
  }, [dispatch, moviesStatus]);

  // Обработка состояния загрузки
  if (moviesStatus === "loading") {
    return (
      <div className="layout">
        <div className="loading-container">
          <Text>Loading...</Text>
        </div>
      </div>
    );
  }

  // Обработка ошибки загрузки
  if (moviesError) {
    return (
      <div className="layout">
        <div className="compact-error">
          <Button type="primary" onClick={() => navigate(-1)}>
            Назад
          </Button>
          <Text>Error: {moviesError}</Text>
        </div>
      </div>
    );
  }

  // Обработка случая, когда фильм не найден
  if (!movie) {
    return (
      <div
        className="layout"
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          margin: 0,
          padding: 0,
        }}
      >
        {/* Navigation Bar */}
        <div className="navbar">
          <div className="navbar-container">
            <div className="logo">
              <img
                src="src/assets/—Pngtree—movie time lettering neon sign_6531275.png"
                alt=" "
              />
              <span className="logo-text">ONLINE MOVIES</span>
            </div>
            <Space>
              {login ? (
                <Text style={{ color: "#fff", marginRight: 12 }}>
                  Привет, {login}
                </Text>
              ) : (
                <Button
                  type="primary"
                  icon={<UserOutlined />}
                  onClick={() => navigate("/login")}
                >
                  Авторизация
                </Button>
              )}
              {userRole === "Admin" && (
                <Button type="primary" onClick={() => navigate("/admin")}>
                  Админ панель
                </Button>
              )}
            </Space>
          </div>
        </div>

        <div className="movie-page">
          <div className="compact-error">
            <Button type="primary" onClick={() => navigate(-1)}>
              Назад
            </Button>
            <Text>Фильм не найден</Text>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: "#ffb300",
            color: "rgba(255, 255, 255, 0.65)",
            padding: "25px 50px",
            width: "100%",
            boxSizing: "border-box",
            marginTop: "auto",
          }}
        >
          <div className="footer-content">
            <div className="copyright">
              © 2025 Created by Wizzkung. Все права защищены.
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
      </div>
    );
  }

  // Основной рендеринг
  const rating = (Math.random() * 5).toFixed(1);

  return (
    <div
      className="layout"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Navigation Bar */}
      <div className="navbar">
        <div className="navbar-container">
          <div className="logo">
            <img
              src="src/assets/—Pngtree—movie time lettering neon sign_6531275.png"
              alt=" "
            />
            <span className="logo-text">ONLINE MOVIES</span>
          </div>
          <Space>
            {login ? (
              <Text style={{ color: "#fff", marginRight: 12 }}>
                Привет, {login}
              </Text>
            ) : (
              <Button
                type="primary"
                icon={<UserOutlined />}
                onClick={() => navigate("/login")}
              >
                Авторизация
              </Button>
            )}
            {userRole === "Admin" && (
              <Button type="primary" onClick={() => navigate("/admin")}>
                Админ панель
              </Button>
            )}
          </Space>
        </div>
      </div>

      <div className="movie-page">
        <div className="compact-container">
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="compact-back-btn"
          >
            Назад
          </Button>

          <Card className="compact-card" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <div className="compact-poster-container">
                  <img
                    src={movie.posterUrl || "/placeholder.svg"}
                    alt={movie.name}
                    className="compact-poster"
                  />
                  <div className="compact-rating">
                    <StarFilled /> {rating}
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={16}>
                <Title level={3} className="compact-title">
                  {movie.name}
                </Title>

                <div className="compact-tags">
                  {movie.genres.split(", ").map((genre, idx) => (
                    <Tag key={idx} color="processing">
                      {genre}
                    </Tag>
                  ))}
                </div>

                <Paragraph className="compact-desc">
                  {movie.description ||
                    "Описание фильма отсутствует. Но вы можете насладиться просмотром этого замечательного произведения киноискусства прямо сейчас!"}
                </Paragraph>

                <Title level={4} className="compact-section-title">
                  Смотреть фильм
                </Title>
                <div className="compact-player-wrapper">
                  <ReactPlayer
                    url={movie.link}
                    controls
                    width="100%"
                    height="100%"
                    className="react-player"
                  />
                </div>
              </Col>
            </Row>

            {reviews && reviews.length > 0 && (
              <div className="compact-reviews">
                <Title level={4} className="compact-section-title">
                  Отзывы
                </Title>
                {reviews.map((review, index) => (
                  <div key={index} className="compact-review">
                    <Paragraph>{review.comment}</Paragraph>
                    <div className="compact-author">Пользователь</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#ffb300",
          color: "rgba(255, 255, 255, 0.65)",
          padding: "25px 50px",
          width: "100%",
          boxSizing: "border-box",
          marginTop: "auto",
        }}
      >
        <div className="footer-content">
          <div className="copyright">
            © 2025 Created by Wizzkung. Все права защищены.
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
    </div>
  );
};

export default MovieDetail;
