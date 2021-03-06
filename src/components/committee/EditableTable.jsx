import React from 'react';
import {
  Table,
  Button,
  InputNumber,
  Form,
  Input,
  Popconfirm,
  DatePicker,
  message,
  Divider,
} from 'antd';
import moment from 'moment';
import axios from 'axios';

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }

    if (this.props.inputType === 'date') {
      return <DatePicker />;
    }
    return <Input />;
  };

  getDefaultValue = value => {
    if (this.props.inputType === 'date') {
      return moment(value);
    }

    return value;
  };

  renderCell = ({ getFieldDecorator }) => {
    const { editing, dataIndex, title, record, children } = this.props;

    return (
      <td>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
                {
                  validator: this.props.validateDate,
                },
              ],
              initialValue: this.getDefaultValue(record[dataIndex]),
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editingKey: '' };

    const operations = {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => {
        const { editingKey } = this.state;
        const editable = this.isEditing(record);
        return editable ? (
          <span>
            <EditableContext.Consumer>
              {form => (
                <Button
                  type="link"
                  onClick={() =>
                    this.save(form, record.facultyEmail, this.props.committeeId)
                  }
                  style={{ marginRight: 8 }}
                >
                  Save
                </Button>
              )}
            </EditableContext.Consumer>
            <Popconfirm
              title="Cancel without saving?"
              onConfirm={() => this.cancel(record.facultyEmail)}
            >
              <Button type="link">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <React.Fragment>
            <Button
              type="link"
              disabled={editingKey !== ''}
              onClick={() => this.edit(record.facultyEmail)}
            >
              Edit
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title="Delete this field?"
              onConfirm={() =>
                this.delete(record.facultyEmail, this.props.committeeId)
              }
            >
              <Button type="link">Delete</Button>
            </Popconfirm>
          </React.Fragment>
        );
      },
    };

    this.columns = this.props.columns;
    this.columns.push(operations);
  }

  isEditing = record => record.facultyEmail === this.state.editingKey;

  validateDateHandler = (rule, value, callback) => {
    const { form } = this.props;
    if (
      value &&
      value.format('YYYY/MM/DD') <
        form.getFieldValue('startDate').format('YYYY/MM/DD')
    ) {
      callback('End date must come after start date.');
    } else {
      callback();
    }
  };

  updateAssignment = async (email, committeeId, startDate, endDate) => {
    const res = await axios.put('api/committee-assignment', {
      email: email,
      committeeId: committeeId,
      startDate: startDate,
      endDate: endDate,
    });

    return res;
  };

  deleteAssignment = async (email, committeeId) => {
    const res = await axios.delete(
      `api/committee-assignment/${committeeId}/${email}`
    );

    return res;
  };

  save(form, email, committee_id) {
    const errorMessages = {
      400: 'Missing field(s) in request',
      404: 'Unable to update committee assignment with requested email and id',
      409: 'Start date must come before end date',
      500: 'Unable to save record',
    };

    const handleErrors = error => {
      const { status } = error.response;
      const errorMessage = errorMessages[status];

      if (!errorMessage) {
        message.error('Unknown error');
      } else {
        message.error(errorMessage);
      }
    };

    form.validateFields((error, row) => {
      if (error) {
        return;
      }

      this.setState({
        editingKey: '',
      });

      const dateFormat = 'YYYY/MM/DD';
      this.updateAssignment(
        email,
        committee_id,
        row['startDate'].format(dateFormat),
        row['endDate'].format(dateFormat)
      )
        .then(() => {
          message.success('Record updated successfully!');
        })
        .catch(err => {
          handleErrors(err);
        });
    });

    this.props.rerenderParentCallback();
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  delete = (email, committeeId) => {
    const errorMessages = {
      404: 'No committee assignment with requested id and email',
      500: 'Unable to delete record',
    };

    const handleErrors = error => {
      const { status } = error.response;
      const errorMessage = errorMessages[status];

      if (!errorMessage) {
        message.error('Unknown error');
      } else {
        message.error(errorMessage);
      }
    };

    this.deleteAssignment(email, committeeId)
      .then(() => {
        message.success('Record deleted successfully!');
      })
      .catch(err => {
        handleErrors(err);
      });

    this.props.rerenderParentCallback();
  };

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          validateDate: this.validateDateHandler,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          rowKey="facultyEmail"
          size="small"
          components={components}
          bordered
          dataSource={this.props.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={false}
        />
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
