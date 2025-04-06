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
} from "antd";
import axios from "axios";
import { getReviews } from "../features/reviewsThunk";
import dayjs from "dayjs";

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

  const handleDelete = async (id) => {
    await axios.delete(`https://localhost:7041/api/Review/Delete/${id}`);
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
        `https://localhost:7041/api/Review/Update/${editingReview.id}`,
        payload
      );
    } else {
      await axios.post("https://localhost:7041/api/Review/AddReviews", payload);
    }

    setIsModalOpen(false);
    setEditingReview(null);
    form.resetFields();
    dispatch(getReviews());
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "User ID", dataIndex: "userId", key: "userId" },
    { title: "Movie ID", dataIndex: "movieId", key: "movieId" },
    { title: "Comment", dataIndex: "comment", key: "comment" },
    { title: "Rating", dataIndex: "rating", key: "rating" },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 20 }}
      >
        Add Review
      </Button>

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
