import { SetStateAction, useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import Highlighter from "react-highlight-words";
import getData from "../../api/getData";

import "./UsersList.css";

interface DataItem {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
  phone: string;
  website: string;
  company: { name: string; catchPhrase: string; bs: string };
}

interface ModalItem {
  name: string;
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
  companyName: string;
  catchPhrase: string;
  bs: string;
}

const { Search } = Input;

export const UsersList = (): JSX.Element => {
  const [data, setData] = useState<DataItem[] | []>([]);
  const [tableData, setTableData] = useState<DataItem[] | []>(data);
  const [searchWords, setSearchWords] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [modal, setModal] = useState<ModalItem>({
    name: "",
    street: "",
    suite: "",
    city: "",
    zipcode: "",
    geo: {
      lat: "",
      lng: "",
    },
    companyName: "",
    catchPhrase: "",
    bs: "",
  });

  const showModal = (record: DataItem): void => {
    setIsModalOpen(true);
    setModal({
      ...modal,
      name: record.name,
      street: record.address.street,
      suite: record.address.suite,
      city: record.address.city,
      zipcode: record.address.zipcode,
      geo: {
        lat: record.address.geo.lat,
        lng: record.address.geo.lng,
      },
      companyName: record.company.name,
      catchPhrase: record.company.catchPhrase,
      bs: record.company.bs,
    });
  };

  const handleOk = (): void => {
    setIsModalOpen(false);
  };

  const handleCancel = (): void => {
    setIsModalOpen(false);
  };
  const getDataFromServer = (): void => {
    getData().then((item: DataItem) =>
      localStorage.setItem("users", JSON.stringify(item))
    );
  };

  const resetUsers = useCallback((): void => {
    getDataFromServer();
    const updatedUsers = localStorage.getItem("users");
    updatedUsers !== null && setData(JSON.parse(updatedUsers));
    updatedUsers !== null && setTableData(JSON.parse(updatedUsers));
    setInput("");
    setSearchWords("");
  }, [getDataFromServer]);

  useEffect((): void => {
    getDataFromServer();
  }, [resetUsers, getDataFromServer]);

  useEffect((): void => {
    const users: string | null = localStorage.getItem("users");
    if (users !== null) {
      setData(JSON.parse(users));
    } else {
      getDataFromServer();
      const updatedUsers = localStorage.getItem("users");
      updatedUsers !== null && setData(JSON.parse(updatedUsers));
    }
  }, []);

  useEffect((): void => {
    setTableData(data);
  }, [data]);

  const deleteItem = (event: any, id: number): void => {
    event.stopPropagation();
    const filteredData = data.filter((element) => element.id !== +id);
    setData(filteredData);
    setTableData(data);
    localStorage.setItem("users", JSON.stringify(filteredData));
  };

  const columns: ColumnsType<DataItem> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: any) => (
        <Highlighter
          highlightClassName="YourHighlightClass"
          searchWords={[searchWords]}
          autoEscape={true}
          textToHighlight={record.name}
        />
      ),
      fixed: "left",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (_: any, record: any) => (
        <Highlighter
          highlightClassName="YourHighlightClass"
          searchWords={[searchWords]}
          autoEscape={true}
          textToHighlight={record.username}
        />
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (_: any, record: any) => (
        <Highlighter
          highlightClassName="YourHighlightClass"
          searchWords={[searchWords]}
          autoEscape={true}
          textToHighlight={record.email}
        />
      ),
    },
    {
      title: "",
      key: "operation",
      fixed: "right",
      width: 100,
      render: (_: any, record: { id: number }) => (
        <Button
          onClick={(event) => {
            deleteItem(event, record.id);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const searchUsers = (inputValue: string): void => {
    if (inputValue) {
      const filteredData = data.filter((emoji) =>
        Object.values(emoji).join("").includes(inputValue)
      );
      setTableData(filteredData);
      setSearchWords(inputValue);
    } else {
      setTableData(data);
      setSearchWords("");
    }
  };

  const onChangeInput = (e: {
    target: { value: SetStateAction<string> };
  }): void => {
    setInput(e.target.value);
  };

  return (
    <div className="container">
      <div className="header">
        <Search
          value={input}
          name={"input"}
          placeholder="Enter text"
          onChange={onChangeInput}
          onSearch={(value) => searchUsers(value)}
          enterButton="Search"
          className="header__search--input"
        />
        <Button
          className="header__reset--btn"
          type="primary"
          size="middle"
          onClick={resetUsers}
        >
          Reset
        </Button>
      </div>
      <Table
        dataSource={tableData}
        columns={columns}
        onRow={(record) => {
          return {
            onClick: () => {
              showModal(record);
            },
          };
        }}
        scroll={{ x: 1300 }}
        className="table"
      />
      <Modal
        title={modal?.name}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="modal"
      >
        <div className="modal__container">
          <h3 className="modal__header">Address:</h3>
          <p className="modal__info">
            {modal?.city}, {modal?.street}, {modal?.suite}, {modal?.zipcode}, (
            {modal?.geo.lat}, {modal?.geo.lng})
          </p>
          <h3 className="modal__header">Company:</h3>
          <p className="modal__info">
            {modal?.name}, {modal?.bs}, {modal?.catchPhrase}
          </p>
        </div>
      </Modal>
    </div>
  );
};
