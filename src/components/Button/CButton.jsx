import React from "react";
import "./CButton.scss";

function CButton({ children, red }) {
  return <button style={{ background: red }}>{children}</button>;
}

export default CButton;
