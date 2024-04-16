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
    search_by_name_dialog: {
      showModal: () => void;
      hasAttribute: (name: string) => boolean;
    };
    register_result_dialog: {
      showModal: () => void;
      hasAttribute: (name: string) => boolean;
    };
    alert_message_dialog: {
      showModal: () => void;
      hasAttribute: (name: string) => boolean;
    };
    edit_profile_dialog: {
      showModal: () => void;
      hasAttribute: (name: string) => boolean;
    };
    edit_farm_dialog: {
      showModal: () => void;
      close: () => void;
      hasAttribute: (name: string) => boolean;
    };
    key_dialog: {
      showModal: () => void;
      close: () => void;
      hasAttribute: (name: string) => boolean;
    };
    certificate_approve_dialog: {
      showModal: () => void;
      close: () => void;
      hasAttribute: (name: string) => boolean;
    };
  }
}
