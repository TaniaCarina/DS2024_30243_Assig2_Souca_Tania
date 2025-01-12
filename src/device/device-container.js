import React, { useState, useEffect } from "react";
import { Button, Card, CardHeader, Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap";

import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import DeviceForm from "./components/device-form";
import * as DeviceAPI from "./api/device-api";
import DeviceTable from "./components/device-table";

function DeviceContainer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [devices, setDevices] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [hasDeleteOccurred, setHasDeleteOccurred] = useState(false);

  const [fetchError, setFetchError] = useState({ status: 0, errorMessage: null });

  useEffect(() => {
    loadDevices();
  }, [localStorage.getItem("authenticatedUser")]);

  function loadDevices() {
    DeviceAPI.getDevices((result, status, error) => {
      if (result && status === 200) {
        setDevices(result);
        setIsDataLoaded(true);
      } else {
        setFetchError({ status, errorMessage: error });
      }
    });
  }

  function toggleModal() {
    setIsModalOpen((prev) => !prev);
  }

  function refreshData() {
    setIsDataLoaded(false);
    toggleModal();
    loadDevices();
  }

  function handleDelete() {
    setHasDeleteOccurred(true);
  }

  return (
    <div>
      <CardHeader>
        <strong>Device Management</strong>
      </CardHeader>
      <Card>
        <Row className="mt-3 mb-3">
          <Col sm={{ size: "8", offset: 1 }} className="text-center">
            <Button color="primary" onClick={toggleModal}>
              Add New Device
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={{ size: "8", offset: 1 }}>
            {isDataLoaded ? (
              <DeviceTable tableData={devices} onDelete={handleDelete} />
            ) : (
              <p>Loading devices...</p>
            )}
            {fetchError.status > 0 && (
              <APIResponseErrorMessage
                errorStatus={fetchError.status}
                error={fetchError.errorMessage}
              />
            )}
          </Col>
        </Row>
      </Card>

      <Modal isOpen={isModalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>Add Device</ModalHeader>
        <ModalBody>
          <DeviceForm reloadHandler={refreshData} />
        </ModalBody>
      </Modal>
    </div>
  );
}

export default DeviceContainer;
