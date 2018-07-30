import React from "react";
import { Message } from "semantic-ui-react";

const propTypes = {};
const defaultProps = {};

const ErrorInternalServerPage = props => <Message header="Internal Server Error" />;

ErrorInternalServerPage.propTypes = propTypes;
ErrorInternalServerPage.defaultProps = defaultProps;

export default ErrorInternalServerPage;
