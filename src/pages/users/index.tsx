import React, { FC, useRef, useState } from 'react';
import { Table, Space, Button, Popconfirm, Pagination, message } from 'antd';
import 'antd/dist/antd.css';
import { connect, Dispatch, Loading, UserState } from 'umi';
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from '@ant-design/pro-table';
import UserModal from './components/UserModal';
import { FormValues, UserItem } from './data.d';
import { addRecord, editRecord } from './service';

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
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [record, setRecord] = useState<UserItem | undefined>(undefined);
  const ref = useRef<ActionType>();

  const columns: ProColumns<UserItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'digit',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      valueType: 'text',
      render: (text: any) => <a>{text}</a>,
    },
    {
      title: 'Create Time',
      dataIndex: 'create_time',
      key: 'create_time',
      valueType: 'dateTime',
    },
    {
      title: 'Action',
      key: 'action',
      valueType: 'option',
      render: (text: any, record: UserItem) => [
        <Button type="primary" onClick={() => editHandler(record)} key="key">
          Edit
        </Button>,
        <Popconfirm
          title="Are you sure delete this user?"
          onConfirm={() => deleteHandler(record.id)}
          okText="Yes"
          cancelText="No"
          key="key"
        >
          <Button type="dashed">Delete</Button>
        </Popconfirm>,
      ],
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
  const onFinish = async (values: FormValues) => {
    setConfirmLoading(true);
    let id = 0;
    if (record) {
      // 传id
      id = record.id;
    }

    let serviceFun;
    if (id) {
      serviceFun = editRecord;
    } else {
      serviceFun = addRecord;
    }

    const result = await serviceFun({ id, values });
    if (result) {
      setMadalVisible(false);
      resetHandler();
      setConfirmLoading(false);
    } else {
      setConfirmLoading(false);
      message.error(`${id === 0 ? 'Add' : 'Edit'} Failed.`);
    }
  };

  const addHanlder = () => {
    setMadalVisible(true);
    // 设置添加时内容为空
    setRecord(undefined);
  };

  // const requestHandler = async ({ pageSize, current }) => {
  //   console.log(pageSize, current);
  //   const users = await getRemoteList({
  //     page: current,
  //     per_page: pageSize,
  //   });
  //   // 翻页获取不到时
  //   if (users) {
  //     return {
  //       data: users.data,
  //       success: true,
  //       total: users.meta.total,
  //     };
  //   } else {
  //     return {
  //       data: [],
  //     };
  //   }
  // };

  const resetHandler = () => {
    dispatch({
      type: 'users/getRemote',
      payload: {
        page: users.meta.page,
        per_page: users.meta.per_page,
      },
    });
  };

  const paginationHandler = (page: number, pageSize: number | undefined) => {
    console.log(page, pageSize);
    dispatch({
      type: 'users/getRemote',
      payload: { page, per_page: pageSize },
    });
  };

  const pageSizeHandler = (current: number, size: number) => {
    dispatch({
      type: 'users/getRemote',
      payload: { page: current, per_page: size },
    });
  };

  return (
    <div className="list-table">
      <ProTable
        columns={columns}
        dataSource={users.data}
        rowKey="id"
        loading={usersListLoading}
        // request={requestHandler}
        search={false}
        pagination={false}
        options={{
          density: true,
          fullScreen: true,
          reload: () => {
            resetHandler();
          },
          setting: true,
        }}
        headerTitle="User List"
        toolBarRender={() => [
          <Button type="primary" onClick={addHanlder} key="1">
            Add
          </Button>,
          <Button onClick={resetHandler} key="2">
            Reload
          </Button>,
        ]}
      />
      <Pagination
        className="list-page"
        total={users.meta.total}
        current={users.meta.page}
        pageSize={users.meta.per_page}
        onChange={paginationHandler}
        onShowSizeChange={pageSizeHandler}
        showSizeChanger
        showQuickJumper
        showTotal={total => `Total ${total} items`}
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
        confirmLoading={confirmLoading}
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
