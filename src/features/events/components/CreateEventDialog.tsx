import { Modal } from "antd";

type CreateEventDialogProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const CreateEventDialog = ({
  open,
  onClose,
  children,
}: CreateEventDialogProps) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      okText="Create Event"
      footer={null}
      title="Event Creation"
      closable={false}
      maskClosable={false}
    >
      {children}
    </Modal>
  );
};
