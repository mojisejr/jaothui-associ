export {};

declare global {
  interface Window {
    member_dialog: {
      showModal: () => void;
    };
  }
}
