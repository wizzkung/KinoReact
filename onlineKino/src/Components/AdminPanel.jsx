import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Typography,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const AdminPanel = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const [modalVisible, setModalVisible] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form] = Form.useForm();


  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://localhost:7041/api/Movie/GetAll"
      );
      setMovies(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, []);


  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7041/api/Movie/Delete/${id}`);
      fetchMovies();
    } catch (err) {
      console.error("Ошибка удаления:", err);
    }
  };


  const handleEdit = (movie) => {
    setEditingMovie(movie);
    form.setFieldsValue(movie);
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditingMovie(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingMovie) {
        await axios.post(
          `https://localhost:7041/api/Movie/Update/${editingMovie.id}`,
          {
            ...editingMovie,
            ...values,
          }
        );
      } else {
        await axios.post("https://localhost:7041/api/Movie/AddMovie", values);
      }
      setModalVisible(false);
      fetchMovies();
    } catch (err) {
      console.error("Ошибка сохранения:", err);
    }
  };

  const columns = [
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Жанры",
      dataIndex: "genres",
      key: "genres",
    },
    {
      title: "Длительность",
      dataIndex: "duration",
      key: "duration",
      render: (text) => `${text} мин.`,
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            Редактировать
          </Button>
          <Popconfirm
            title="Вы уверены, что хотите удалить фильм?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button type="link" danger>
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error)
    return (
      <div style={{ color: "red", textAlign: "center", padding: 50 }}>
        Ошибка: {error}
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Административная панель</Title>
      <div style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={handleAdd}>
          Добавить фильм
        </Button>
        <Button
          type="primary"
          onClick={() => navigate("/Diagram")}
          style={{ marginLeft: 20 }}
        >
          Диаграммы
        </Button>
        <Button
          type="primary"
          onClick={() => navigate("/ReviewPanel")}
          style={{ marginLeft: 20 }}
        >
          Отзывы
        </Button>
        <Button
          type="primary"
          onClick={() => navigate("/UserPanel")}
          style={{ marginLeft: 20 }}
        >
          Пользователи
        </Button>
      </div>
      <Table dataSource={movies} columns={columns} rowKey="id" />

      <Modal
        title={editingMovie ? "Редактировать фильм" : "Добавить фильм"}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText="Сохранить"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Название"
            name="name"
            rules={[{ required: true, message: "Введите название фильма" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Жанры"
            name="genres"
            rules={[{ required: true, message: "Введите жанры" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Длительность"
            name="duration"
            rules={[{ required: true, message: "Введите длительность" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Ссылка на фильм"
            name="Link"
            rules={[{ required: true, message: "Введите ссылку на фильм" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ссылка на постер"
            name="posterUrl"
            rules={[{ required: true, message: "Введите ссылку на постер" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPanel;
