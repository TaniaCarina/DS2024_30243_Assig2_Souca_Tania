import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import UserForm from "./user-form";
import Table from "../../commons/tables/table";
import * as API_USERS from "../api/user-api";

function UserTable(props) {
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [tableData, setTableData] = useState(props.tableData);
  const [isSelected, setIsSelected] = useState(false);
  const [error, setError] = useState({ status: 0, errorMessage: null });

  const handleDelete = (id) => {
    return API_USERS.deleteUser(id, (result, status, err) => {
      if (status === 204) {
        console.log("Successfully deleted user with id: " + id);

        window.location.reload();
      } else {
        setError({ status: status, errorMessage: err });
      }
    });
  };

  function reload() {
    setIsLoaded(false);
    setIsDeleted(false);
    toggleForm();
  }

  const handleUpdate = (row) => {
    setUpdatedData(row);
    setIsUpdating(true);
  };

  function toggleForm() {
    setIsSelected((isSelected) => !isSelected);
  }

  const columns = [
    {
      Header: "Id",
      accessor: "id",
    },
    {
      Header: "Name",
      accessor: "name",
    },

    {
      Header: "Password",
      accessor: "password",
    },
    {
      Header: "Role",
      accessor: "role",
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: (row) => (
        <div>
          <Button
            style={{
              marginRight: "5px",
              background: "linear-gradient(to right, #ff79b0, #d18df0)",
              border: "2px solid purple",
              color: "white",
              fontWeight: "bold",
            }}
            onClick={() => {
              toggleForm();
              handleUpdate(row.original);
            }}> Update </Button>
          <Button
            style={{
              background: "linear-gradient(to right, #ff79b0, #d18df0)",
              border: "2px solid purple",
              color: "white",
              fontWeight: "bold",
            }}
            onClick={() => handleDelete(row.original.id)}
          > Delete </Button>
        </div>
      ),
    },
  ];

  const filters = [
    {
      accessor: "name",
    },
  ];

  return (
    <div>
      <Table
        data={props.tableData}
        columns={columns}
        search={filters}
        pageSize={5}
      />

      <Modal isOpen={isSelected} toggle={toggleForm} size="lg">
        <ModalHeader
          toggle={toggleForm}
          style={{
            background: "linear-gradient(to right, #d18df0, #ff79b0)",
            color: "white",
            fontWeight: "bold",
            borderBottom: "2px solid purple",
          }} > Add User: </ModalHeader>
        <ModalBody
          style={{
            background: "linear-gradient(to left, #ff79b0, #d18df0)",
            color: "white",
          }}
        >
          <UserForm
            reloadHandler={reload}
            updatedData={updatedData}
            isUpdating={isUpdating}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}

export default UserTable;
