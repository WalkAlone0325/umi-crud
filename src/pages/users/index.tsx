import React, { FC, useState } from 'react';
import { Table, Space, Button, Popconfirm } from 'antd';
import 'antd/dist/antd.css';
import { connect, Dispatch, Loading, UserState } from 'umi';
import UserModal from './components/UserModal';
import { FormValues, UserItem } from './data.d';

interface UserPageProps {
  users: UserState;
  dispatch: Dispatch;
  usersListLoading: boolean;
}

const UserListPage: FC<UserPageProps> = ({
  users,
  dispatch,
  usersListLoading,
}) => {
  const [madalVisible, setMadalVisible] = useState(false);
  const [record, setRecord] = useState<UserItem | undefined>(undefined);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Create Time',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: UserItem) => (
        <Space size="middle">
          <Button type="primary" onClick={() => edithandler(record)}>
            Edit
          </Button>
          <Popconfirm title="是否要删除？" onConfirm={() => confirm(record)}>
            <Button type="dashed">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const confirm = (record: UserItem) => {
    const id = record.id;
    dispatch({ type: 'users/delete', payload: id });
  };

  const edithandler = (record: UserItem) => {
    setMadalVisible(true);
    // 点击航数据
    // console.log(record);
    setRecord(record);
  };

  const closeHandler = () => {
    setMadalVisible(false);
  };

  // 同时做 edit 编辑页提交 和 add 添加 （id 有没有的区别）
  const onFinish = (values: FormValues) => {
    let id = 0;
    if (record) {
      // 传id
      id = record.id;
    }

    if (id) {
      dispatch({ type: 'users/edit', payload: { id, values } });
      // console.log('Success:', values);
    } else {
      dispatch({ type: 'users/add', payload: { values } });
    }
    setMadalVisible(false);
  };

  const addHanlder = () => {
    setMadalVisible(true);
    // 设置添加时内容为空
    setRecord(undefined);
  };

  return (
    <div className="list-table">
      <Button type="primary" onClick={addHanlder}>
        Add
      </Button>
      <Table
        columns={columns}
        dataSource={users.data}
        rowKey="id"
        loading={usersListLoading}
      />
      <UserModal
        visible={madalVisible}
        closeHandler={closeHandler}
        record={record}
        onFinish={onFinish}
      />
    </div>
  );
};

const mapStateToProps = ({
  users,
  loading,
}: {
  users: UserState;
  loading: Loading;
}) => {
  return {
    users,
    usersListLoading: loading.models.users,
  };
};

export default connect(mapStateToProps)(UserListPage);
