import { Modal } from "antd";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  closable?: boolean;
};

export const Dialaog = ({
  open,
  onClose,
  children,
  title = "Event Creation",
  closable = false,
}: DialogProps) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      okText="Create Event"
      footer={null}
      title={title}
      closable={closable}
      maskClosable={false}
    >
      {children}
    </Modal>
  );
};
