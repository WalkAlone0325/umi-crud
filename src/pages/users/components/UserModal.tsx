import React, { FC, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Switch } from 'antd';
import { UserItem, FormValues } from '../data.d';
import moment from 'moment';

interface UserModalProps {
  visible: boolean;
  closeHandler: () => void;
  record: UserItem | undefined;
  onFinish: (values: FormValues) => void;
  confirmLoading: boolean;
}

const UserModal: FC<UserModalProps> = props => {
  const { visible, closeHandler, record, onFinish, confirmLoading } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    // 此处当add 时。调用了 setRecord(undefined)
    if (record === undefined) {
      // 重置表单内容
      form.resetFields();
    } else {
      // 编辑时
      form.setFieldsValue({
        ...record,
        // c处理日期格式
        create_time: moment(record.create_time),
        // 处理 status
        // status: record.status === 1 ? true : false,
        status: Boolean(record.status),
      });
    }
  }, [visible]);

  const onOk = () => {
    form.submit();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <Modal
        title="Basic Mado"
        visible={visible}
        onOk={onOk}
        onCancel={closeHandler}
        forceRender
        confirmLoading={confirmLoading}
      >
        <Form
          name="basic"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ status: true }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Create Time" name="create_time">
            <DatePicker showTime />
          </Form.Item>
          <Form.Item label="Status" name="status" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserModal;
