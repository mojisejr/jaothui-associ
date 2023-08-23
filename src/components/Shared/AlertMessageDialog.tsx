import Modal from "./Modal";

interface AlertMessageDialogProps {
  title: string;
  message: string;
}

const AlertMessageDialog = ({ title, message }: AlertMessageDialogProps) => {
  return (
    <Modal id="alert_message_dialog">
      <div>
        <h1 className="font-bold">{title}</h1>
        <p>{message}</p>
      </div>
    </Modal>
  );
};

export default AlertMessageDialog;
