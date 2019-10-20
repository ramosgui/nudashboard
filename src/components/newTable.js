import React from "react";
import axios from 'axios'
import Modal from './modal'

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

export default class newTable extends React.Component {
    constructor() {
        super();
        this.renderEditable = this.renderEditable.bind(this);
        this.state = {
            show: false,
            modalData: {},
            inputValue: {},
            data: []
        };
    }

    showModal = (lineInfo) => {
        this.setState({ show: true });
        this.setState({ modalData: lineInfo });
    };

    hideModal = () => {
        this.setState({ show: false });
    };

    getData() {
        axios.post('http://localhost:5000/', { start_date: this.props.startDate }).then(response => {
            this.setState({ data: response.data })
        });
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.startDate !== prevProps.startDate) {
            this.getData()
        }

    }

    renderEditable(cellInfo) {
        return (
            <>
                <div
                    className="editable"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => {
                        
                            console.log(this.state.data[cellInfo.index][cellInfo.column.id])
                            // e.target.innerHTML = this.state.data[cellInfo.index][cellInfo.column.id]

                            const input_value = this.state.inputValue;

                            if (input_value[cellInfo.index] === undefined) {
                                input_value[cellInfo.index] = this.state.data[cellInfo.index]
                                input_value[cellInfo.index][cellInfo.column.id] = e.target.innerHTML
                            } else {
                                input_value[cellInfo.index][cellInfo.column.id] = e.target.innerHTML
                            }

                            var old_field = 'old_'.concat(cellInfo.column.id)

                            input_value[cellInfo.index][old_field] = this.state.data[cellInfo.index][cellInfo.column.id]

                            // console.log(input_value[cellInfo.index][cellInfo.column.id] = '1')

                            // this.setState({ inputValue: e.target.innerHTML })



                            // const data = [...this.state.data];
                            // // data[cellInfo.index]['unsaved'] = {}
                            // // data[cellInfo.index]['unsaved'][cellInfo.column.id] = e.target.innerHTML;

                            // this.state.data[cellInfo.index][cellInfo.column.id] = 'A'

                            // this.setState({ data });

                        }
                    }
                    dangerouslySetInnerHTML={{
                        __html: this.state.data[cellInfo.index][cellInfo.column.id]
                    }}
                />

                <button type="button" onClick={e => {
                    this.showModal(this.state.inputValue[cellInfo.index])


                    // this.setState({ show: true });
                    // console.log('a')
                }
                    
                }>
                    open
                </button>
            </>
        );
    }
    render() {
        return <>
            <ReactTable
                data={this.state.data}
                filterable
                columns={[
                    {
                        Header: "ID",
                        accessor: "id"
                    },
                    {
                        Header: "Description",
                        accessor: "description",
                        Cell: this.renderEditable,
                        filterMethod: (filter, row) => {
                            if (filter.value === "all") {
                                return true;
                            }
                            if (this.state.data.map(item => item.description).includes(filter.value)) {
                                return row[filter.id] === filter.value
                            } else {
                                if (this.state.data.map(item => item.description).includes(this.state.after_alter)) {
                                    return row[filter.id] === this.state.after_alter
                                }
                            }

                        },
                        Filter: ({ filter, onChange }) =>
                            <select
                                onChange={event => onChange(event.target.value)}
                                style={{ width: "100%" }}
                            >
                                <option selected value="all">All</option>

                                {this.state.data.map(item => {
                                    if (item.description === this.state.after_alter) {
                                        return <option selected value={this.state.after_alter}>{this.state.after_alter}</option>
                                    }
                                    else {
                                        return <option value={item.description}>{item.description}</option>
                                    }
                                })}
                            </select>
                    },
                    {
                        Header: "Created at",
                        accessor: "created_at"
                    },
                    {
                        Header: "Amount",
                        accessor: "amount"
                    },
                    {
                        Header: "Title",
                        accessor: "title"
                    }
                ]}
                defaultPageSize={10}
                className="-striped -highlight"
            />
            <Modal show={this.state.show} handleClose={this.hideModal} line={this.state.modalData}/>
        </>
    }
}
