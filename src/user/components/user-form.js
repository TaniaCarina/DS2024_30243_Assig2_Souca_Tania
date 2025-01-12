import React, { useState, useEffect } from "react";
import { Col, Row } from "reactstrap";
import { FormGroup, Input, Label } from "reactstrap";
import Button from "react-bootstrap/Button";
import Validate from "./user-validators";
import * as API_USERS from "../api/user-api";
import APIResponseErrorMessage from "../../commons/errorhandling/api-response-error-message";

const allowedRoles = ["client", "admin"];

const initialFormState = {
  name: {
    value: "",
    placeholder: "Enter your name...",
    valid: false,
    touched: false,
    validationRules: {
      minLength: 3,
      isRequired: true,
    },
  },
  password: {
    value: "",
    placeholder: "Enter your password",
    valid: false,
    touched: false,
    validationRules: {
      minLength: 3,
      isRequired: true,
    },
  },
  role: {
    value: "",
    placeholder: "Role (client or admin)",
    valid: false,
    touched: false,
    customValidation: (value) =>
      allowedRoles.includes(value)
        ? null
        : "Role must be either 'client' or 'admin'.",
  },
};

function UserForm({ isUpdating, updatedData, reloadHandler }) {
  const [formState, setFormState] = useState(initialFormState);
  const [formValid, setFormValid] = useState(false);
  const [apiError, setApiError] = useState({ status: 0, errorMessage: null });

  useEffect(() => {
    if (isUpdating && updatedData) {
      setFormState({
        name: {
          ...formState.name,
          value: updatedData.name,
        },
        password: {
          ...formState.password,
          value: updatedData.password || "",
        },
        role: {
          ...formState.role,
          value: updatedData.role,
        },
      });
    } else {
      setFormState(initialFormState);
    }
  }, [isUpdating, updatedData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    const updatedFormState = { ...formState };
    const updatedField = updatedFormState[name];

    updatedField.value = value;
    updatedField.touched = true;
    updatedField.valid = Validate(value, updatedField.validationRules);

    updatedFormState[name] = updatedField;

    let isFormValid = true;
    for (const field in updatedFormState) {
      isFormValid = updatedFormState[field].valid && isFormValid;
    }

    setFormState(updatedFormState);
    setFormValid(isFormValid);
  };

  const registerUser = (user) => {
    API_USERS.postUser(user, (result, status, error) => {
      if (result && (status === 200 || status === 201)) {
        console.log("User created with ID:", result);
        reloadHandler();
      } else {
        setApiError({ status, errorMessage: error });
      }
    });
  };

  const updateUser = (user) => {
    API_USERS.updateUser(updatedData.id, user, (result, status, error) => {
      if (result && (status === 200 || status === 201)) {
        console.log("User updated with ID:", result);
        reloadHandler();
      } else {
        setApiError({ status, errorMessage: error });
      }
    });
  };

  const handleSubmit = () => {
    const user = {
      name: formState.name.value,
      password: formState.password.value,
      role: formState.role.value,
    };
    isUpdating ? updateUser(user) : registerUser(user);
  };

  return (
    <div>
      <FormGroup>
        <Label for="nameField">Name:</Label>
        <Input
          id="nameField"
          name="name"
          placeholder={formState.name.placeholder}
          value={formState.name.value}
          onChange={handleInputChange}
          valid={formState.name.valid}
          invalid={!formState.name.valid && formState.name.touched}
        />
        {formState.name.touched && !formState.name.valid && (
          <div className="error-message">Name must have at least 3 characters.</div>
        )}
      </FormGroup>

      <FormGroup>
        <Label for="roleField">Role:</Label>
        <Input
          id="roleField"
          name="role"
          placeholder={formState.role.placeholder}
          value={formState.role.value}
          onChange={handleInputChange}
          valid={formState.role.valid}
          invalid={!formState.role.valid && formState.role.touched}
        />
        {formState.role.touched && !formState.role.valid && (
          <div className="error-message">{formState.role.customValidation(formState.role.value)}</div>
        )}
      </FormGroup>

      <FormGroup>
        <Label for="passwordField">Password:</Label>
        <Input
          id="passwordField"
          name="password"
          placeholder={formState.password.placeholder}
          value={formState.password.value}
          onChange={handleInputChange}
          valid={formState.password.valid}
          invalid={!formState.password.valid && formState.password.touched}
        />
      </FormGroup>

      <Row>
        <Col sm={{ size: "4", offset: 8 }}>
          <Button color="primary" disabled={!formValid} onClick={handleSubmit}>
            {isUpdating ? "Update" : "Submit"}
          </Button>
        </Col>
      </Row>

      {apiError.status > 0 && (
        <APIResponseErrorMessage
          errorStatus={apiError.status}
          error={apiError.errorMessage}
        />
      )}
    </div>
  );
}

export default UserForm;
