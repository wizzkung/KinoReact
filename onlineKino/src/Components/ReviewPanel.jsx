import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Space,
  Popconfirm,
  Typography,
} from "antd";
import axios from "axios";
import { getReviews } from "../features/reviewsThunk";
import dayjs from "dayjs";

const { Title } = Typography;
const ReviewsPanel = () => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getReviews());
  }, [dispatch]);

  useEffect(() => {
    console.log("🔍 reviews from store:", reviews);
  }, [reviews]);

  const handleEdit = (record) => {
    setEditingReview(record);
    form.setFieldsValue({
      ...record,
      createdAt: dayjs(record.createdAt),
    });
    setIsModalOpen(true);
  };

  const handleDownload = async (type) => {
    try {
      const response = await axios.get(
        `https://localhost:7041/api/Reviews/${type}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://localhost:7041/api/Reviews/Delete/${id}`);
    dispatch(getReviews());
  };

  const handleModalOk = async () => {
    const values = await form.validateFields();
    const payload = {
      ...editingReview,
      ...values,
      createdAt: values.createdAt.toISOString(),
    };

    if (editingReview) {
      await axios.post(
        `https://localhost:7041/api/Reviews/Update/${editingReview}`,
        payload
      );
    } else {
      await axios.post(
        "https://localhost:7041/api/Reviews/AddReviews",
        payload
      );
    }

    setIsModalOpen(false);
    setEditingReview(null);
    form.resetFields();
    dispatch(getReviews());
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Пользователь", dataIndex: "userId", key: "userId" },
    { title: "Фильм", dataIndex: "movieId", key: "movieId" },
    { title: "Отзыв", dataIndex: "comment", key: "comment" },
    { title: "Рейтинг", dataIndex: "rating", key: "rating" },
    { title: "Дата", dataIndex: "createdAt", key: "createdAt" },
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

  return (
    <>
      <div style={{ padding: 20 }}>
        <Title level={2}>Панель отзывов</Title>{" "}
        <Button
          type="primary"
          onClick={() => setIsModalOpen(true)}
          style={{ marginBottom: 20 }}
        >
          Добавить
        </Button>
        <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
          <Select
            placeholder="Выгрузка Excel"
            onChange={(value) => handleDownload(value)}
            style={{ width: 200 }}
          >
            <Select.Option value="ExcelLastDay">
              За последний день
            </Select.Option>
            <Select.Option value="ExcelLastMonth">
              За последний месяц
            </Select.Option>
          </Select>
        </div>
      </div>

      <Table dataSource={reviews} columns={columns} rowKey="id" />

      <Modal
        title={editingReview ? "Edit Review" : "Add Review"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingReview(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="userId" label="User ID" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="movieId"
            label="Movie ID"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Comment"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="rating" label="Rating" rules={[{ required: true }]}>
            <InputNumber min={1} max={10} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="createdAt"
            label="Created At"
            rules={[{ required: true }]}
          >
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ReviewsPanel;
