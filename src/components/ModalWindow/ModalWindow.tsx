import { Modal } from "antd";
import { ModalItem } from "../../interfaces";

export const ModalWindow = ({
  modal,
  isModalOpen,
  handleCancel,
  handleOk,
}: {
  modal: ModalItem;
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
}) => {
  return (
    <Modal
      title={modal?.name}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      className="modal"
    >
      <div className="modal__container">
        <h3 className="modal__header">Address:</h3>
        <p className="modal__info">
          {modal?.city}, {modal?.street}, {modal?.suite}, {modal?.zipcode}, (
          {modal?.geo.lat}, {modal?.geo.lng})
        </p>
        <h3 className="modal__header">Company:</h3>
        <p className="modal__info">
          {modal?.name}, {modal?.bs}, {modal?.catchPhrase}
        </p>
      </div>
    </Modal>
  );
};
