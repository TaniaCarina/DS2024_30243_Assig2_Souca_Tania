import { HOST } from "../../commons/hosts";
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
  device: "/device",
};

function getToken() {
  const userData = JSON.parse(localStorage.getItem("authenticatedUser"));
  return userData && userData.token ? userData.token : null;
}

function buildRequest(url, method, body = null) {
  const token = getToken();

  if (!token) {
    console.error("No valid token found");
    return null;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  return new Request(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
}

function logRequest(url) {
  console.log("Request URL:", url);
}

function getDevices(callback) {
  const url = `${HOST.backend_device_api}${endpoint.device}`;
  const request = buildRequest(url, "GET");

  if (request) {
    logRequest(url);
    RestApiClient.performRequest(request, callback);
  }
}

function updateDevice(id, device, callback) {
  const url = `${HOST.backend_device_api}${endpoint.device}/${id}`;
  const request = buildRequest(url, "PUT", device);

  if (request) {
    logRequest(url);
    RestApiClient.performRequest(request, callback);
  }
}

function getUserDevices(userId, callback) {
  const url = `${HOST.backend_device_api}${endpoint.device}/userDevices/${userId}`;
  const request = buildRequest(url, "GET");

  if (request) {
    logRequest(url);
    RestApiClient.performRequest(request, callback);
  }
}

function getDeviceById(params, callback) {
  const url = `${HOST.backend_device_api}${endpoint.device}/${params.id}`;
  const request = buildRequest(url, "GET");

  if (request) {
    logRequest(url);
    RestApiClient.performRequest(request, callback);
  }
}

function postDevice(user, callback) {
  const url = `${HOST.backend_device_api}${endpoint.device}`;
  const request = buildRequest(url, "POST", user);

  if (request) {
    logRequest(url);
    RestApiClient.performRequest(request, callback);
  }
}

function deleteDevice(id, callback) {
  const url = `${HOST.backend_device_api}${endpoint.device}/${id}`;
  const request = buildRequest(url, "DELETE");

  if (request) {
    logRequest(url);
    RestApiClient.performRequest(request, callback);
  }
}

export {
  getDevices,
  getDeviceById,
  postDevice,
  deleteDevice,
  getUserDevices,
  updateDevice,
};
