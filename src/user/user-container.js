import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import UserForm from "./components/user-form";
import * as API_USERS from "./api/user-api";
import UserTable from "./components/user-table";

function UserContainer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [hasDeletionOccurred, setHasDeletionOccurred] = useState(false);
  const [apiError, setApiError] = useState({ status: 0, message: null });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    API_USERS.getUsers((result, status, error) => {
      if (result && status === 200) {
        setUserData(result);
        setIsDataLoaded(true);
      } else {
        setApiError({ status, message: error });
      }
    });
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const refreshData = () => {
    setIsDataLoaded(false);
    setHasDeletionOccurred(false);
    toggleModal();
    loadUserData();
  };

  return (
    <div>
      <CardHeader>
        <strong>User Management</strong>
      </CardHeader>
      <Card>
        <Row className="my-3">
          <Col sm={{ size: "8", offset: 1 }}>
            <Button color="primary" onClick={toggleModal}>
              Add User
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={{ size: "8", offset: 1 }}>
            {isDataLoaded ? (
              <UserTable tableData={userData} onDelete={() => setHasDeletionOccurred(true)} />
            ) : (
              <p>Loading data...</p>
            )}
            {apiError.status > 0 && (
              <APIResponseErrorMessage errorStatus={apiError.status} error={apiError.message} />
            )}
          </Col>
        </Row>
      </Card>

      <Modal isOpen={isModalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>Add User</ModalHeader>
        <ModalBody>
          <UserForm reloadHandler={refreshData} />
        </ModalBody>
      </Modal>
    </div>
  );
}

export default UserContainer;
