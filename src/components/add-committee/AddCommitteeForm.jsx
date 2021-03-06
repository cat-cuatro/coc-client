import { Form, Input, Button, InputNumber } from 'antd';
import React from 'react';
import axios from 'axios';

const { TextArea } = Input;

class AddCommitteeForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.postCommittee(
          values['committeeName'],
          values['description'],
          values['totalSlots']
        ).catch(err => {
          console.log(err.response);
        });
      }
    });
  };
  postCommittee = async (committeeName, description, totalSlots) => {
    const res = await axios
      .post('/api/committee', {
        name: committeeName,
        description: description,
        totalSlots: totalSlots,
      })
      .then(response => {
        const split = response.headers.location.split('/');
        this.props.onSuccess(split[5]);
      });
    return res;
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    return (
      <Form onSubmit={this.handleSubmit} {...formItemLayout} labelAlign="left">
        <h1>Add New Committee</h1>
        <Form.Item label="Committee Name">
          {getFieldDecorator('committeeName', {
            rules: [
              {
                required: true,
                message: 'Please input committee name',
                labelAlign: 'left',
              },
            ],
          })(<Input placeholder="Committee Name" />)}
        </Form.Item>
        <Form.Item label="Description">
          {getFieldDecorator('description', {
            rules: [
              {
                required: true,
                message: 'Please input committee description',
              },
            ],
          })(<TextArea rows={4} placeholder="Enter list of responsibilities" />)}
        </Form.Item>
        <Form.Item label="Total Slots">
          {getFieldDecorator('totalSlots', {
            rules: [
              {
                required: true,
                message: 'Please input total slots',
              },
            ],
          })(<InputNumber min={1} placeholder="Total slots" />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedDisplayForm = Form.create({ name: 'AddCommittee' })(AddCommitteeForm);

export default WrappedDisplayForm;
