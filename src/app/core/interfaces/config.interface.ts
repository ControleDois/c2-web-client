export interface Config {
  id: string | number;
  company_id: string | number;
  sale_people_default: any;
  sale_people_default_id: string | number;
  sale_category_default: any;
  sale_bank_account_default: any;
  sale_bank_account_default_id: string | number;
  sale_category_default_id: string | number;
  dropbox_client_id?: string;
  dropbox_client_secret?: string;
  dropbox_refresh_token?: string;
}
