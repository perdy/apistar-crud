import PropTypes from "prop-types";
import React from "react";
import { Form, Input } from "semantic-ui-react";

const types = Object.freeze(
  Object.assign(
    ...["string", "integer", "boolean", "float", "time", "date", "datetime", "unknown"].map(item => ({ [item]: item }))
  )
);

const propTypes = {
  type: PropTypes.string.isRequired,
  format: PropTypes.string
};

const defaultProps = {
  format: null
};

class PolymorphicInput extends React.PureComponent {
  static getType(type, format) {
    switch (type) {
      case "integer":
        return types.integer;
      case "number":
        return types.float;
      case "string":
        switch (format) {
          case "time":
            return types.time;
          case "date":
            return types.date;
          case "datetime":
            return types.datetime;
          default:
            return types.string;
        }
      case "boolean":
        return types.boolean;
      default:
        return types.unknown;
    }
  }

  renderInput(inputProps) {
    const { type, format, ...remainingProps } = this.props;
    return <Form.Field control={Input} {...inputProps} {...remainingProps} />;
  }

  renderTimePicker() {
    const { type, format, placeholder, ...remainingProps } = this.props;
    return <Form.Field control={Input} placeholder="HH:MM:SS" {...remainingProps} />;
  }

  renderDatePicker() {
    const { type, format, placeholder, ...remainingProps } = this.props;
    return <Form.Field control={Input} placeholder="YYYY/MM/DD" {...remainingProps} />;
  }

  renderDateTimePicker() {
    const { type, format, placeholder, ...remainingProps } = this.props;
    return <Form.Field control={Input} placeholder="YYYY/MM/DD HH:MM:SS" {...remainingProps} />;
  }

  renderCheckbox() {
    const { type, format, placeholder, value, ...remainingProps } = this.props;
    return <Form.Checkbox checked={value === true} {...remainingProps} />;
  }

  renderTextArea() {
    const { type, format, ...remainingProps } = this.props;
    return <Form.TextArea {...remainingProps} />;
  }

  render() {
    const { type, format } = this.props;

    switch (PolymorphicInput.getType(type, format)) {
      case types.integer:
        return this.renderInput({ type: "number", step: 1 });
      case types.float:
        return this.renderInput({ type: "number", step: "any" });
      case types.string:
        return this.renderInput();
      case types.time:
        return this.renderTimePicker();
      case types.date:
        return this.renderDatePicker();
      case types.datetime:
        return this.renderDateTimePicker();
      case types.boolean:
        return this.renderCheckbox();
      default:
        return this.renderTextArea();
    }
  }
}

PolymorphicInput.propTypes = propTypes;
PolymorphicInput.defaultProps = defaultProps;

export default PolymorphicInput;
