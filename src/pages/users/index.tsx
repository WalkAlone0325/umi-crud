import React, { FC, useRef, useState } from 'react';
import { Table, Space, Button, Popconfirm } from 'antd';
import 'antd/dist/antd.css';
import { connect, Dispatch, Loading, UserState } from 'umi';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import UserModal from './components/UserModal';
import { FormValues, UserItem } from './data.d';
import { getRemoteList } from './service';

interface UserPageProps {
  users: UserState;
  dispatch: Dispatch;
  usersListLoading: boolean;
}

interface ActionType {
  reload: () => void;
  fetchMore: () => void;
  reset: () => void;
}

const UserListPage: FC<UserPageProps> = ({
  users,
  dispatch,
  usersListLoading,
}) => {
  const [madalVisible, setMadalVisible] = useState(false);
  const [record, setRecord] = useState<UserItem | undefined>(undefined);
  const ref = useRef<ActionType>();

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
          <Button type="primary" onClick={() => editHandler(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure delete this user?"
            onConfirm={() => deleteHandler(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="dashed">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const deleteHandler = (id: number) => {
    dispatch({ type: 'users/delete', payload: id });
  };

  const editHandler = (record: UserItem) => {
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

  const requestHandler = async ({ pageSize, current }) => {
    const users = await getRemoteList({
      page: current,
      per_page: pageSize,
    });
    return {
      data: users.data,
      success: true,
      total: users.meta.total,
    };
  };

  const reloadHanlder = () => {
    ref.current?.reload();
  };

  return (
    <div className="list-table">
      <Button type="primary" onClick={addHanlder}>
        Add
      </Button>
      <Button onClick={reloadHanlder}>Reload</Button>
      <ProTable
        columns={columns}
        dataSource={users.data}
        rowKey="id"
        loading={usersListLoading}
        request={requestHandler}
        search={false}
        actionRef={ref}
      />
      {/* <Table
        columns={columns}
        dataSource={users.data}
        rowKey="id"
        loading={usersListLoading}
      /> */}
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
