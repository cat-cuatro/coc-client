import React, { Component } from 'react';
import { Table, Divider } from 'antd';

const reqColumns = [
  {
    title: 'Senate',
    dataIndex: 'senate_division',
    editable: false,
  },
  {
    title: 'Filled',
    dataIndex: 'SlotsFilled',
    editable: false,
  },
  {
    title: 'Required',
    dataIndex: 'SlotMinimum',
    editable: false,
  },
  {
    title: 'To Be Filled',
    dataIndex: 'SlotsRemaining',
    editable: false,
  },
];

export default class RequirementsTable extends Component {
  render() {
    return (
      <div>
        <Divider type="horizontal" orientation="left">
          Requirements
        </Divider>
        <Table
          rowKey="senate_division"
          bordered
          dataSource={this.props.data}
          columns={reqColumns}
          pagination={false}
          size="small"
        />
      </div>
    );
  }
}
