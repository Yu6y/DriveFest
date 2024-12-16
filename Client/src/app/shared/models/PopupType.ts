export const POPUP_TYPE = {
  ADD: 'add',
  DELETE: 'delete',
  EDIT: 'edit',
  EDITREGISTRY: 'edit_registry',
  DELETEREGISTRY: 'delete_registry',
  ADDCAR: 'add_car',
  EDITCAR: 'edit_car',
  DELETECAR: 'delete_car',
  DEFAULT: '',
} as const;

export type PopupType = (typeof POPUP_TYPE)[keyof typeof POPUP_TYPE];
