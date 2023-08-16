export {};

declare global {
  interface Window {
    member_dialog: {
      showModal: () => void;
    };
    please_connect_wallet_dialog: {
      showModal: () => void;
    };
    search_dialog: {
      showModal: () => void;
      hasAttribute: (name: string) => boolean;
    };
  }
}
