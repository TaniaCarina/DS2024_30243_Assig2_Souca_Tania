import React, { useState } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Col, Row } from "react-bootstrap";

import Field from "./Field";

function Table(props) {
    const [data, setData] = useState(props.data);
    const [columns, setColumns] = useState(props.columns);
    const [search, setSearch] = useState(props.search);
    const [filters, setFilters] = useState([]);
    const [pageSize, setPageSize] = useState(props.pageSize || 10);

    function filter(data) {
        let accepted = true;

        filters.forEach((val) => {
            if (String(val.value) === "") {
                accepted = true;
            }

            if (
                !String(data[val.accessor]).includes(String(val.value)) &&
                !String(val.value).includes(String(data[val.accessor]))
            ) {
                accepted = false;
            }
        });

        return accepted;
    }

    function handleChange(value, index, header) {
        let keep = value.target.value;

        setFilters((filters) => {
            let newFilters = JSON.parse(JSON.stringify(filters));

            newFilters[index] = {
                value: keep,
                accessor: header,
            };

            return newFilters;
        });
    }

    function getTRPropsType(state, rowInfo) {
        if (rowInfo) {
            return {
                style: {
                    textAlign: "center",
                    color: "purple",
                },
            };
        } else return {};
    }

    return (
        <div>
            <Row>
                {search.map((header, index) => {
                    return (
                        <Col key={index}>
                            <div>
                                <Field
                                    id={header.accessor}
                                    label={header.accessor}
                                    onChange={(e) => handleChange(e, index, header.accessor)}
                                    style={{
                                        background: "linear-gradient(to right,rgb(250, 173, 205),rgb(231, 183, 252))",
                                        color: "white",
                                        border: "2px solid purple",
                                        borderRadius: "8px",
                                        padding: "5px",
                                    }}
                                />
                            </div>
                        </Col>
                    );
                })}
            </Row>
            <Row>
                <Col>
                    <ReactTable
                        data={data ? data.filter((data) => filter(data)) : []}
                        resolveData={(data) => data.map((row) => row)}
                        columns={columns}
                        defaultPageSize={pageSize}
                        getTrProps={getTRPropsType}
                        showPagination={true}
                        style={{
                            border: "2px solid purple",
                            borderRadius: "10px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            background: "linear-gradient(to right,rgb(246, 152, 191),rgb(225, 179, 247))", 
                            color: "purple",
                        }}
                        getTheadProps={() => ({
                            style: {
                                background: "linear-gradient(to right, #d18df0,rgb(240, 168, 198))",
                                color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                            },
                        })}
                        getPaginationProps={() => ({
                            style: {
                                background: "linear-gradient(to right,rgb(251, 162, 199),rgb(221, 188, 236))", 
                                color: "white",
                                borderTop: "2px solid purple",
                                padding: "10px",
                            },
                        })}
                        getTheadThProps={() => ({
                            style: {
                                borderBottom: "2px solid purple",
                                textAlign: "center",
                            },
                        })}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default Table;
