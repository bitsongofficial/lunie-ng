import { Dictionary } from 'lodash';

export interface IcoData {
  ico_start_date: string;
  ico_end_date: string;
  short_desc: string;
  description: string;
  links: Dictionary<string[]>,
  softcap_currency: string;
  hardcap_currency: string;
  total_raised_currency: number;
  softcap_amount: number;
  hardcap_amount: number;
  total_raised: number;
  quote_pre_sale_currency: number;
  base_pre_sale_amount: number;
  quote_pre_sale_amount: number;
  quote_public_sale_currency: string;
  base_public_sale_amount: boolean;
  quote_public_sale_amount: boolean;
  accepting_currencies: string[];
  country_origin: string;
  pre_sale_start_date: string;
  pre_sale_end_date: string;
  whitelist_url: string[];
  whitelist_start_date: string;
  whitelist_end_date: string;
  bounty_detail_url: string;
  amount_for_sale: boolean;
  kyc_required: boolean;
  whitelist_available: boolean;
  pre_sale_available: boolean;
  pre_sale_ended: boolean;
}

export interface CoinGeckoResponse {
	id: string;
	symbol: string;
	name: string;
	asset_platform_id: string;
	platforms: Dictionary<number>,
	block_time_in_minutes: number;
	hashing_algorithm: string;
	categories: string[];
  public_notice: string;
	additional_notices: string[];
	localization: Dictionary<string>;
	description: Dictionary<string>;
  links: Dictionary<string[]>;
  image: Dictionary<string>;
  country_origin: string;
	genesis_date: string;
	contract_address: number;
	sentiment_votes_up_percentage: number;
	sentiment_votes_down_percentage: number;
	ico_data: IcoData,
	market_cap_rank: number;
	coingecko_rank: number;
	coingecko_score: number;
	developer_score: number;
	community_score: number;
	liquidity_score: number;
	public_interest_score: number;
  market_data: {
    current_price: Dictionary<number>;
    market_cap: Dictionary<number>;
    total_volume: Dictionary<number>;
  }
}
