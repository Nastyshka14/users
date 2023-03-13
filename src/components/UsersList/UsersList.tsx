import { MouseEvent, SetStateAction, useCallback, useEffect, useState } from "react";
import { Button, Input, Table } from "antd";
import { DataItem, DefaultState, ModalItem } from "../../interfaces";
import { useDispatch, useSelector } from "react-redux";
import { ACTIONS } from "../../redux/constants";
import { ColumnsType } from "antd/es/table";
import Highlighter from "react-highlight-words";
import { ModalWindow } from "../ModalWindow/ModalWindow";
import getData from "../../api/getData";
import "./UsersList.css";

const { Search } = Input;

export const UsersList = (): JSX.Element => {
  const dispatch = useDispatch();

  const data = useSelector(
    (state: { table: DefaultState }) => state.table.data
  );
  const tableData = useSelector(
    (state: { table: DefaultState }) => state.table.tableData
  );
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
    const newUsers = updatedUsers !== null && JSON.parse(updatedUsers);
    dispatch({ type: ACTIONS.GET_USERS, data: newUsers });
    dispatch({ type: ACTIONS.GET_TABLE_USERS, data: newUsers });
    setInput("");
    setSearchWords("");
  }, [getDataFromServer, dispatch]);

  useEffect((): void => {
    getDataFromServer();
  }, [resetUsers, getDataFromServer]);

  useEffect((): void => {
    const users: string | null = localStorage.getItem("users");
    if (users !== null) {
      const newData = JSON.parse(users);
      dispatch({ type: ACTIONS.GET_USERS, data: newData });
    } else {
      getDataFromServer();
      const updatedUsers = localStorage.getItem("users");
      const newUsers = updatedUsers !== null && JSON.parse(updatedUsers);
      dispatch({ type: ACTIONS.GET_USERS, data: newUsers });
    }
  }, [dispatch]);

  useEffect((): void => {
    dispatch({ type: ACTIONS.GET_TABLE_USERS, data: data });
  }, [data, dispatch]);

  const deleteItem = (event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent> | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, id: number): void => {
    event.stopPropagation();
    const filteredData = data.filter((element: DataItem) => element.id !== +id);
    dispatch({ type: ACTIONS.GET_USERS, data: filteredData });
    dispatch({ type: ACTIONS.GET_TABLE_USERS, data: data });
    localStorage.setItem("users", JSON.stringify(filteredData));
  };

  const searchUsers = (inputValue: string): void => {
    if (inputValue) {
      const filteredData = data.filter((item: DataItem) =>
        Object.values(item).join("").includes(inputValue)
      );
      dispatch({ type: ACTIONS.GET_TABLE_USERS, data: filteredData });
      setSearchWords(inputValue);
    } else {
      dispatch({ type: ACTIONS.GET_TABLE_USERS, data: data });
      setSearchWords("");
    }
  };

  const onChangeInput = (e: {
    target: { value: SetStateAction<string> };
  }): void => {
    setInput(e.target.value);
  };

  const columns: ColumnsType<DataItem> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: DataItem) => (
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
      render: (_: any, record: DataItem) => (
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
      render: (_: any, record: DataItem) => (
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
      <ModalWindow
        modal={modal}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleOk={handleOk}
      />
    </div>
  );
};
