import jsonData from '../../../.env.json';
const loadData = () => JSON.parse(JSON.stringify(jsonData));
const envs = loadData();
export const env = envs;
