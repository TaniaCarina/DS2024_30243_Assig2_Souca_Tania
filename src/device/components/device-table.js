import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import DeviceForm from "./device-form";
import Table from "../../commons/tables/table";
import * as API_DEVICES from "../api/device-api";
import { useNavigate } from "react-router-dom";

function DeviceTable({ tableData }) {
  const navigate = useNavigate();

  const [error, setError] = useState({ status: 0, errorMessage: null });
  const [data, setData] = useState(tableData);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState({});

  const navigateToChart = (deviceId) => {
    navigate(`/device-chart/${deviceId}`);
  };

  const deleteDevice = (id) => {
    API_DEVICES.deleteDevice(id, (result, status, err) => {
      if (status === 204) {
        console.log(`Device with ID ${id} deleted successfully.`);
        window.location.reload();
      } else {
        setError({ status, errorMessage: err });
      }
    });
  };

  const updateDevice = (row) => {
    setSelectedDevice(row);
    setIsUpdating(true);
    toggleModal();
  };

  const toggleModal = () => {
    setModalVisible((prevVisible) => !prevVisible);
  };

  const reloadTable = () => {
    setIsLoaded(false);
    toggleModal();
  };

  const columns = [
    {
      Header: "User ID",
      accessor: "userId",
    },
    {
      Header: "Description",
      accessor: "description",
    },
    {
      Header: "Address",
      accessor: "address",
    },
    {
      Header: "Max Consumption (Hourly)",
      accessor: "hourlyMaxConsumption",
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ original }) => (
        <div>
          <Button
            style={{
              marginRight: "8px",
              backgroundColor: "#6c63ff",
              borderColor: "#6c63ff",
            }}
            onClick={() => updateDevice(original)}
          >
            Update
          </Button>
          <Button
            style={{
              marginRight: "8px",
              backgroundColor: "#ff6584",
              borderColor: "#ff6584",
            }}
            onClick={() => navigateToChart(original.id)}
          >
            View Chart
          </Button>
          <Button
            style={{
              backgroundColor: "#d32f2f",
              borderColor: "#d32f2f",
            }}
            onClick={() => deleteDevice(original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const filters = [
    {
      accessor: "description",
    },
  ];

  return (
    <div>
      <Table
        style={{
          width: "95%",
          margin: "20px auto",
          border: "1px solid #e0e0e0",
          borderRadius: "10px",
          padding: "10px",
        }}
        data={data}
        columns={columns}
        search={filters}
        pageSize={5}
      />

      <Modal isOpen={modalVisible} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>Add or Update Device</ModalHeader>
        <ModalBody>
          <DeviceForm
            reloadHandler={reloadTable}
            updatedData={selectedDevice}
            isUpdating={isUpdating}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}

export default DeviceTable;
