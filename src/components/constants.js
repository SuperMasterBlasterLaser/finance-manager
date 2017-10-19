
export let SERVER_URL = "http://35.156.112.74:3000/";
export let classifyUrl = SERVER_URL + 'classify_transaction';

export const TAB_TABLE = 0;
export const TAB_GRAPH = 1;

export const FILTER_TITLES = ["Все", "Приходы", "Расходы"];
export const FILTER_ALL = 0;
export const FILTER_INCOME = 1;
export const FILTER_OUTCOME = 2;

export const filters = [
	((t) => true),
	((t) => t.value > 0),
	((t) => t.value < 0),
];