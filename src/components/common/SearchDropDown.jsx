import React from 'react';
import { Select, Divider, Button } from 'antd';

class SearchDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfo: this.props.showInfo,
      filtered: false,
      filteredList: [],
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      showInfo: true,
    });

    this.props.onChange(event);
  }

  handleFilter = value => {
    const filteredList = this.props.dataMembers.filter(
      faculty => faculty.props.title === value
    );
    this.setState({
      filtered: true,
      filteredList: filteredList,
    });
  };

  handleClick = () => {
    this.setState({
      filtered: false,
    });
  };

  render() {
    return (
      <div>
        {this.props.filter && (
          <Select
            style={{ marginBottom: 16, marginRight: 16 }}
            showSearch
            className="aligner-item aligner-item-center select"
            placeholder={this.props.filterPlaceholder || 'Enter text here'}
            optionFilterProp="children"
            onChange={this.handleFilter}
            dropdownMatchSelectWidth={false}
            size="large"
            loading={this.state.loading}
            defaultValue={this.props.default}
          >
            {this.props.filter}
          </Select>
        )}
        {this.props.filter && (
          <Button type="primary" className="add-button" onClick={this.handleClick}>
            Clear Filter
          </Button>
        )}
        <Select
          showSearch
          className="aligner-item aligner-item-center select"
          placeholder={this.props.placeholder || 'Enter text here'}
          optionFilterProp="children"
          onChange={this.handleChange}
          dropdownMatchSelectWidth={false}
          size="large"
          loading={this.state.loading}
          defaultValue={this.props.default}
        >
          {this.state.filtered ? this.state.filteredList : this.props.dataMembers}
        </Select>
        {this.state.showInfo && (
          <div>
            <Divider orientation="left">{this.props.dividerText || ''}</Divider>
          </div>
        )}
      </div>
    );
  }
}

export default SearchDropDown;
