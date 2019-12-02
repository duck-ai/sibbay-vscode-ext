import fetch from 'node-fetch';

const ENDPOINT = 'https://1246105.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/sibbay-ai-mri-co-write/processon';

const GET = async (path: string) => {
  let url = `${ ENDPOINT }${ path }`;
  let res = await fetch(url);
  let data = await res.json();
  return data.mapdata;
};

export default class {
  constructor () {}

  async getMindmapJSON (params: { mapurl: string }) {
    let path = `/parse-processon-mindmap?url=${ params.mapurl }`;
    let data = await GET(path);
    return data;
  }
}