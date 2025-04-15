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
  Spin,
  message,
} from "antd";
import axios from "axios";

const { Title } = Typography;

const UserPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Модалка и форма
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // Загрузить всех пользователей
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://localhost:7041/api/Users/GetAll"
      );
      console.log("Fetched users sample:", data[0]);
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Удалить пользователя
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7041/api/Users/Delete/${id}`);
      message.success("Пользователь удалён");
      fetchUsers();
    } catch (err) {
      message.error("Ошибка удаления: " + err.message);
    }
  };

  // Открыть модалку для добавления
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Открыть модалку для редактирования
  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      email: user.Email,
      login: user.Login,
    });
    setModalVisible(true);
  };

  // Сохранить (add или update)
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingUser) {
        // UPDATE
        await axios.post(
          `https://localhost:7041/api/Users/Update/${editingUser.id}`,
          {
            id: editingUser.id,
            email: values.email,
            login: values.login,
          }
        );
        message.success("Пользователь обновлён");
      } else {
        // ADD
        await axios.post("https://localhost:7041/api/Users/AddUser", {
          email: values.email,
          login: values.login,
          password: values.password,
        });
        message.success("Пользователь добавлен");
      }

      setModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (err) {
      console.error("Ошибка сохранения:", err);
      if (axios.isAxiosError(err) && err.response) {
        console.error(">> response.data:", err.response.data);
        message.error("Ошибка: " + JSON.stringify(err.response.data));
      } else {
        message.error("Ошибка при сохранении");
      }
    }
  };

  // Колонки для AntD Table
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Login", dataIndex: "login", key: "login" },
    {
      title: "Создан",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString(),
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
            title="Удалить пользователя?"
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

  // UI
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin tip="Загрузка пользователей..." />
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", padding: 50 }}>
        Ошибка: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Панель пользователей</Title>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 20 }}>
        Добавить пользователя
      </Button>
      <Table dataSource={users} columns={columns} rowKey="id" />

      <Modal
        title={
          editingUser ? "Редактировать пользователя" : "Добавить пользователя"
        }
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText="Сохранить"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Введите email" },
              { type: "email", message: "Неверный формат email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="login"
            label="Login"
            rules={[{ required: true, message: "Введите логин" }]}
          >
            <Input />
          </Form.Item>
          {/* Пароль нужен только при создании */}
          {!editingUser && (
            <Form.Item
              name="password"
              label="Пароль"
              rules={[{ required: true, message: "Введите пароль" }]}
            >
              <Input.Password />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UserPanel;
