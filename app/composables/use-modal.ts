export const useModal = (onClose?: () => void) => {
  const isOpen = useState<boolean>("modalIsOpen", () => false);
  const component = useState<any>("modalComponent", () => null);
  const props = useState<object>("modalProps", () => ({}));
  const runOnClose = useState<Function>("onModalClose", () => () => {});

  const openModal = (
    modalComponent: any,
    modalProps: object = {},
    onCloseCallback: () => Promise<void> = async () => Promise.resolve()
  ) => {
    component.value = markRaw(modalComponent);
    props.value = modalProps;
    isOpen.value = true;
    runOnClose.value = onCloseCallback;
  };

  const closeModal = () => {
    isOpen.value = false;
    component.value = null;
    props.value = {};

    runOnClose.value();
  };

  return {
    isOpen,
    component,
    props,
    openModal,
    closeModal
  };
};
