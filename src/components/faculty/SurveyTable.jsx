import React, { Component } from 'react';
import { Divider, Table, Descriptions } from 'antd';
import 'antd/dist/antd.css';

export default class SurveyTable extends Component {
  render() {
    const columns = [
      {
        title: 'Choice',
        dataIndex: 'choice_id',
        editable: false,
        inputType: 'number',
      },
      {
        title: 'Committee Name',
        dataIndex: 'name',
        editable: false,
        inputType: 'text',
      },
    ];
    const keys = ['Survey Date', 'Is Interested', 'Expertise'];
    const items = [];
    let i = 0;
    if (this.props.data !== null) {
      Object.entries(this.props.data).forEach(([key, value]) => {
        if (key !== 'choices') {
          if (typeof value === 'boolean') {
            value = 'yes';
          }
          items.push(
            <Descriptions.Item key={key} label={keys[i]}>
              {value}
            </Descriptions.Item>
          );
        }
        i++;
      });
    }

    let choices = [];
    if (this.props.data !== null) {
      choices = this.props.data.choices;
    }
    return (
      <div>
        <Divider type="horizontal" orientation="left">
          Most Recent Survey
        </Divider>
        <Descriptions>{items}</Descriptions>
        <div style={{ marginBottom: 16 }}>
          <Table rowKey="choice_id" dataSource={choices} columns={columns} />
        </div>
      </div>
    );
  }
}
