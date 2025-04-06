"use client";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { Button, Layout, Card, Typography, Tag, Row, Col } from "antd";
import { useSelector } from "react-redux";
import { ArrowLeftOutlined, StarFilled } from "@ant-design/icons";
import "../Components/movie-styles.css";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = useSelector((state) =>
    state.movies.list.find((m) => m.id === Number.parseInt(id, 10))
  );
  const reviews = useSelector((state) =>
    state.reviews.list.filter((r) => r.movieId === Number.parseInt(id, 10))
  );
  const rating = (Math.random() * 5).toFixed(1);

  if (!movie)
    return (
      <div className="compact-error">
        <Button type="primary" onClick={() => navigate(-1)}>
          Назад
        </Button>
        <span>Фильм не найден</span>
      </div>
    );

  return (
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
  );
};

export default MovieDetail;
