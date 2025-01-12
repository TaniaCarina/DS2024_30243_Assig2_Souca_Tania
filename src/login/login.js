import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Container, Row, Col } from "reactstrap";
import * as API_USERS from "../user/api/user-api.js";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      password: "",
      showModal: false,
      modalMessage: "",
      isErrorMessage: false,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const user = {
      username: this.state.name,
      password: this.state.password,
    };

    const callback = (json, status, err) => {
      if (err) {
        console.error("An error occurred:", err);
        this.setState({
          showModal: true,
          isErrorMessage: true,
          modalMessage: "Username or password are incorrect!",
        });
      } else {
        if (status === 200) {
          localStorage.setItem("authenticatedUser", JSON.stringify(json));
          this.setState({
            showModal: true,
            isErrorMessage: false,
            modalMessage: "Login successful! ^_^",
          });
          setTimeout(() => {
            this.props.navigate("/device");
          }, 2000);
        } else {
          this.setState({
            showModal: true,
            isErrorMessage: true,
            modalMessage: "Authentication failed. Please try again.",
          });
        }
      }
    };

    try {
      await API_USERS.authenticateUser(user, callback);
    } catch (error) {
      console.error("An error occurred while authenticating:", error);
    };
  }

  renderModal() {
    if (!this.state.showModal) return null;

    const modalStyle = {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: this.state.isErrorMessage ? "#F74F4F" : "#D7F9D7",
      padding: "20px",
      borderRadius: "10px",
      zIndex: 1000,
      textAlign: "center",
      color: "#fff",
      border: "4px solid purple",
    };

    return (
      <div style={modalStyle}>
        <p>{this.state.modalMessage}</p>
      </div>
    );
  }

  render() {
    const loginFormStyle = {
      marginTop: "50px",
      padding: "40px",
      borderRadius: "12px",
      background: "linear-gradient(to right, #ff79b0, #d18df0)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      color: "#fff",
      border: "4px solid purple",
    };

    const inputStyle = {
      borderRadius: "8px",
      marginBottom: "20px",
      border: "4px solid purple",
    };

    const buttonStyle = {
      marginTop: "10px",
      background: "linear-gradient(to right, #ff79b0, #d18df0)",
      borderColor: "purple",
      color: "#fff",
      fontSize: "18px",
      padding: "10px 20px",
      borderRadius: "6px",
      border: "4px solid purple",
    };

    const containerStyle = {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(to bottom, #ffe6f7, #e5d6f5)",
    };

    return (
      <div style={containerStyle}>
        {this.renderModal()}
        <Container style={loginFormStyle}>
          <Row>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
              <h1 style={{ textAlign: "center", marginBottom: "20px", fontSize: "3rem", fontWeight: "bold", color: "purple" }}>
                LOGIN
              </h1>
              <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your name"
                    style={inputStyle}
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    style={inputStyle}
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
                <Button type="submit" style={buttonStyle}>
                  Login
                </Button>
                <Button type="button" style={{ ...buttonStyle, marginLeft: "10px", backgroundColor: "#ff85c0" }}>
                  Register
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
