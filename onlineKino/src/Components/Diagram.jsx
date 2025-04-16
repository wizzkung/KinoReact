import React, { useEffect, useState } from "react";
import axios from "axios";
import CanvasJSReact from "@canvasjs/react-charts";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Diagram = () => {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const reviewsUrl = "https://localhost:7041/api/Reviews/GetAll";
    const moviesUrl = "https://localhost:7041/api/Movie/GetAll";

    Promise.all([axios.get(reviewsUrl), axios.get(moviesUrl)])
      .then(([reviewsRes, moviesRes]) => {
        const reviews = reviewsRes.data;
        const movies = moviesRes.data;

        const movieMap = {};
        movies.forEach((movie) => {
          movieMap[movie.id] = movie.name;
        });

        const ratingsByMovie = {};
        reviews.forEach((review) => {
          const movieId = review.movieId;
          const rating = parseFloat(review.rating);
          if (!isNaN(rating)) {
            if (!ratingsByMovie[movieId]) {
              ratingsByMovie[movieId] = { sum: 0, count: 0 };
            }
            ratingsByMovie[movieId].sum += rating;
            ratingsByMovie[movieId].count += 1;
          }
        });

        const points = Object.entries(ratingsByMovie).map(
          ([movieId, { sum, count }]) => {
            const avgRating = sum / count;
            return {
              label: movieMap[movieId] || `Movie ${movieId}`,
              y: parseFloat(avgRating.toFixed(2)),
            };
          }
        );

        setDataPoints(points);
      })
      .catch((error) => {
        console.error("Ошибка получения данных:", error);
      });
  }, []);

  const options = {
    width: 1200,
    height: 600,
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Средний рейтинг по фильмам",
    },
    axisY: {
      title: "Средний рейтинг",
      includeZero: true,
      maximum: 10,
    },
    axisX: {
      labelAngle: 0, // подписи прямо, не под углом
      labelFontSize: 14, // можно уменьшить шрифт
      labelWrap: true, // разрешить перенос
      interval: 1, // показывать каждую метку
    },
    data: [
      {
        type: "column",
        yValueFormatString: "#,##0.00",
        dataPoints: dataPoints,
      },
    ],
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "65%",
        height: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "inline-block" }}>
          <CanvasJSChart
            options={options}
            containerProps={{ width: "700px", height: "500px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Diagram;
