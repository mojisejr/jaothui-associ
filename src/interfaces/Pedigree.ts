export interface CreatePedigreeRequest {
  wallet: string;
  ownerName: string;
  buffaloId: string;
  bornAt: string;
  momId?: string;
  dadId?: string;
  mGrandmaId?: string;
  mGrandpaId?: string;
  dGrandmaId?: string;
  dGrandpaId?: string;
  slipUrl: string;
}
