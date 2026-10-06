type AlertMessageProps = {
  type: "success" | "error";
  message: string;
};

function AlertMessage({
  type,
  message
}: AlertMessageProps) {
  return (
    <div
      className={`alert-message alert-${type}`}
      role="alert"
    >
      <span className="alert-icon">
        {type === "success" ? "✓" : "!"}
      </span>

      <p>{message}</p>
    </div>
  );
}

export default AlertMessage;