import fetch from 'node-fetch';

const GET = async (url: string) => {
  let res = await fetch(url);
  let data = await res.json();
  return data;
};

export default async (params: { mapurl: string }) => {
  let url = `https://1246105.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/map-to-mri/build/?mapurl=${ params.mapurl }`;
  console.log(url);
  let data = await GET(url);
  return data;
}