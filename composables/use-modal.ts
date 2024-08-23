export const useModal = () => {
  const isOpen = useState<boolean>("modalIsOpen", () => false);
  const component = useState<any>("modalComponent", () => null);
  const props = useState<object>("modalProps", () => ({}));

  const openModal = (modalComponent: any, modalProps: object = {}) => {
    component.value = modalComponent;
    props.value = modalProps;
    isOpen.value = true;
  };

  const closeModal = () => {
    isOpen.value = false;
    component.value = null;
    props.value = {};
  };

  return {
    isOpen,
    component,
    props,
    openModal,
    closeModal
  };
};
