import React, { useState, useEffect } from "react";
import { Col, Row, FormGroup, Input, Label } from "reactstrap";
import Button from "react-bootstrap/Button";

import Validate from "./device-validators";
import * as API_DEVICES from "../api/device-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";

const initializeFormControls = () => ({
  description: {
    value: "",
    placeholder: "Enter device description...",
    valid: false,
    touched: false,
    validationRules: { minLength: 3, isRequired: true },
  },
  userId: {
    value: "",
    placeholder: "Enter user ID...",
    valid: false,
    touched: false,
    validationRules: { isRequired: true },
  },
  hourlyMaxConsumption: {
    value: "",
    placeholder: "Max hourly consumption...",
    valid: false,
    touched: false,
  },
  address: {
    value: "",
    placeholder: "Enter address...",
    valid: false,
    touched: false,
  },
});

const DeviceForm = ({ isUpdating, updatedData, reloadHandler }) => {
  const [error, setError] = useState({ status: 0, errorMessage: null });
  const [formIsValid, setFormIsValid] = useState(false);
  const [formControls, setFormControls] = useState(initializeFormControls);

  useEffect(() => {
    if (isUpdating && updatedData) {
      setFormControls((controls) =>
        Object.keys(controls).reduce((acc, key) => {
          acc[key] = { ...controls[key], value: updatedData[key] || "" };
          return acc;
        }, {})
      );
    } else {
      setFormControls(initializeFormControls());
    }
  }, [isUpdating, updatedData]);

  const validateForm = (controls) => {
    return Object.values(controls).every(
      (control) => !control.touched || control.valid
    );
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormControls((prevControls) => {
      const updatedControl = {
        ...prevControls[name],
        value,
        touched: true,
        valid: Validate(value, prevControls[name].validationRules),
      };

      const updatedControls = { ...prevControls, [name]: updatedControl };
      setFormIsValid(validateForm(updatedControls));
      return updatedControls;
    });
  };

  const handleSubmit = () => {
    const newDevice = Object.keys(formControls).reduce((device, key) => {
      device[key] = formControls[key].value;
      return device;
    }, {});

    if (isUpdating) {
      API_DEVICES.updateDevice(
        updatedData.id,
        newDevice,
        (result, status, err) => {
          if (status === 200 || status === 201) {
            console.log("Updated device:", result);
            reloadHandler();
          } else {
            setError({ status, errorMessage: err });
          }
        }
      );
    } else {
      API_DEVICES.postDevice(newDevice, (result, status, err) => {
        if (status === 201) {
          console.log("Created device:", result);
          reloadHandler();
        } else if (status === 400) {
          alert("Invalid user ID!");
        } else {
          setError({ status, errorMessage: err });
        }
      });
    }
  };

  const renderInputField = (name, label) => {
    const control = formControls[name];
    return (
      <FormGroup id={`${name}Field`}>
        <Label for={`${name}Field`}>{label}:</Label>
        <Input
          name={name}
          id={`${name}Field`}
          placeholder={control.placeholder}
          value={control.value}
          onChange={handleInputChange}
          touched={control.touched ? 1 : 0}
          valid={control.valid}
          required
        />
        {control.touched && !control.valid && (
          <div className="error-message">Invalid {label.toLowerCase()}!</div>
        )}
      </FormGroup>
    );
  };

  return (
    <div>
      {renderInputField("description", "Description")}
      {renderInputField("userId", "User ID")}
      {renderInputField("address", "Address")}
      {renderInputField("hourlyMaxConsumption", "Max Consumption / Hour")}

      <Row>
        <Col sm={{ size: "4", offset: 8 }}>
          <Button
            type="submit"
            disabled={!formIsValid}
            onClick={handleSubmit}
          >
            {isUpdating ? "Update" : "Submit"}
          </Button>
        </Col>
      </Row>

      {error.status > 0 && (
        <APIResponseErrorMessage
          errorStatus={error.status}
          error={error.errorMessage}
        />
      )}
    </div>
  );
};

export default DeviceForm;
