import { invoke } from '@tauri-apps/api/tauri';

const SITE_CATE_COMMON = "common";
const SITE_CATE_CODE_REPO = "codeRepo";
const SITE_CATE_TECH_SITE = "techSite";
const SITE_CATE_DOC = "doc";
const SITE_CATE_ARTIFACT = "artifact";

export type SiteCate = {
    cateId: string;
    cateName: string;
    siteCount: number;
};

export type Site = {
    siteId: string;
    siteName: string;
    searchTpl: string;
    cateId: string;
    defaultSite: boolean;
    useProxy: boolean;
};

const siteList: Site[] = [
    {
        siteId: "baidu",
        siteName: "百度",
        searchTpl: "https://www.baidu.com/s?wd=KEYWORD",
        cateId: SITE_CATE_COMMON,
        defaultSite: false,
        useProxy: true,
    },
    {
        siteId: "bing",
        siteName: "必应",
        searchTpl: "https://www.bing.com/search?q=KEYWORD",
        cateId: SITE_CATE_COMMON,
        defaultSite: true,
        useProxy: false,
    },
    {
        siteId: "360",
        siteName: "360搜索",
        searchTpl: "https://www.so.com/s?q=KEYWORD",
        cateId: SITE_CATE_COMMON,
        defaultSite: false,
        useProxy: false,
    },
    {
        siteId: "sogou",
        siteName: "搜狗",
        searchTpl: "https://www.sogou.com/web?query=KEYWORD",
        cateId: SITE_CATE_COMMON,
        defaultSite: false,
        useProxy: false,
    },
    {
        siteId: "atomgit",
        siteName: "atomgit",
        searchTpl: "https://atomgit.com/search?scope=repository&search=KEYWORD",
        cateId: SITE_CATE_CODE_REPO,
        defaultSite: false,
        useProxy: false,
    },
    {
        siteId: "gitcode",
        siteName: "gitcode",
        searchTpl: "https://gitcode.net/search?search=KEYWORD",
        cateId: SITE_CATE_CODE_REPO,
        defaultSite: false,
        useProxy: true,
    },
    {
        siteId: "github",
        siteName: "github",
        searchTpl: "https://github.com/search?q=KEYWORD",
        cateId: SITE_CATE_CODE_REPO,
        defaultSite: false,
        useProxy: true,
    },
    {
        siteId: "gitee",
        siteName: "gitee",
        searchTpl: "https://search.gitee.com/?q=KEYWORD",
        cateId: SITE_CATE_CODE_REPO,
        defaultSite: true,
        useProxy: false,
    },
    {
        siteId: "juejin",
        siteName: "掘金",
        searchTpl: "https://juejin.cn/search?query=KEYWORD",
        cateId: SITE_CATE_TECH_SITE,
        defaultSite: false,
        useProxy: true,
    },
    {
        siteId: "csdn",
        siteName: "csdn",
        searchTpl: "https://so.csdn.net/so/search?q=KEYWORD",
        cateId: SITE_CATE_TECH_SITE,
        defaultSite: false,
        useProxy: false,
    },
    {
        siteId: "osChina",
        siteName: "osChina",
        searchTpl: "https://www.oschina.net/search?q=KEYWORD",
        cateId: SITE_CATE_TECH_SITE,
        defaultSite: false,
        useProxy: true,
    },
    {
        siteId: "rsDoc",
        siteName: "rsDoc",
        searchTpl: "https://docs.rs/releases/search?query=KEYWORD",
        cateId: SITE_CATE_DOC,
        defaultSite: false,
        useProxy: false,
    },
    {
        siteId: "gemDoc",
        siteName: "gemDoc",
        searchTpl: "https://gemdocs.org/search?q=KEYWORD",
        cateId: SITE_CATE_DOC,
        defaultSite: false,
        useProxy: false,
    },
    {
        siteId: "goDoc",
        siteName: "goDoc",
        searchTpl: "https://pkg.go.dev/search?q=KEYWORD",
        cateId: SITE_CATE_DOC,
        defaultSite: false,
        useProxy: true,
    },
    {
        siteId: "anaconda",
        siteName: "anaconda",
        searchTpl: "https://anaconda.org/search?q=KEYWORD",
        cateId: SITE_CATE_ARTIFACT,
        defaultSite: false,
        useProxy: false,
    },
    {
        siteId: "helm",
        siteName: "helm",
        searchTpl: "https://artifacthub.io/packages/search?ts_query_web=KEYWORD",
        cateId: SITE_CATE_ARTIFACT,
        defaultSite: false,
        useProxy: false,
    },
    {
        siteId: "sonatype",
        siteName: "sonatype",
        searchTpl: "https://central.sonatype.com/search?q=KEYWORD",
        cateId: SITE_CATE_ARTIFACT,
        defaultSite: false,
        useProxy: false,
    },
    {
        siteId: "conan",
        siteName: "conan",
        searchTpl: "https://conan.io/center/recipes/KEYWORD",
        cateId: SITE_CATE_ARTIFACT,
        defaultSite: false,
        useProxy: false,
    },
    {
        siteId: "mvn",
        siteName: "mvn",
        searchTpl: "https://mvnrepository.com/search?q=KEYWORD",
        cateId: SITE_CATE_ARTIFACT,
        defaultSite: false,
        useProxy: false,
    },
    {
        siteId: "npmmirror",
        siteName: "npmmirror",
        searchTpl: "https://npmmirror.com/packages?q=KEYWORD",
        cateId: SITE_CATE_ARTIFACT,
        defaultSite: false,
        useProxy: false,
    },
    {
        siteId: "pkgs",
        siteName: "pkgs",
        searchTpl: "https://pkgs.org/search/?q=KEYWORD",
        cateId: SITE_CATE_ARTIFACT,
        defaultSite: false,
        useProxy: true,
    },
    {
        siteId: "pypi",
        siteName: "pypi",
        searchTpl: "https://pypi.org/search/?q=KEYWORD",
        cateId: SITE_CATE_ARTIFACT,
        defaultSite: false,
        useProxy: true,
    },
    {
        siteId: "gems",
        siteName: "gems",
        searchTpl: "https://rubygems.org/search?query=KEYWORD",
        cateId: SITE_CATE_ARTIFACT,
        defaultSite: false,
        useProxy: true,
    },
    {
        siteId: "npmjs",
        siteName: "npmjs",
        searchTpl: "https://www.npmjs.com/search?q=KEYWORD",
        cateId: SITE_CATE_ARTIFACT,
        defaultSite: false,
        useProxy: true,
    },
    {
        siteId: "nuget",
        siteName: "nuget",
        searchTpl: "https://www.nuget.org/packages?q=KEYWORD",
        cateId: SITE_CATE_ARTIFACT,
        defaultSite: false,
        useProxy: true,
    },
];

function getSiteCount(cateId: string) {
    return siteList.filter(item => item.cateId == cateId).length;
}

//列出站点类别
export function list_site_cate(): SiteCate[] {
    return [
        {
            cateId: SITE_CATE_COMMON,
            cateName: "通用",
            siteCount: getSiteCount(SITE_CATE_COMMON),
        },
        {
            cateId: SITE_CATE_CODE_REPO,
            cateName: "代码仓库",
            siteCount: getSiteCount(SITE_CATE_CODE_REPO),
        },
        {
            cateId: SITE_CATE_TECH_SITE,
            cateName: "技术站点",
            siteCount: getSiteCount(SITE_CATE_TECH_SITE),
        },
        {
            cateId: SITE_CATE_DOC,
            cateName: "代码库文档",
            siteCount: getSiteCount(SITE_CATE_DOC),
        },
        {
            cateId: SITE_CATE_ARTIFACT,
            cateName: "构件仓库",
            siteCount: getSiteCount(SITE_CATE_ARTIFACT),
        },
    ];
}

//列出站点
export function list_site(cateId: string,
): Site[] {
    return siteList.filter(item => item.cateId == cateId);
}

//列出我的站点
export async function list_my_site(): Promise<Site[]> {
    const cmd = 'plugin:pub_search_api|list_my_site';
    const siteIdList = await invoke<string[]>(cmd, {});
    if (siteIdList.length > 0) {
        return siteIdList.map(siteId => siteList.find(item => item.siteId == siteId)).filter(item => item != undefined) as Site[];
    } else {
        return siteList.filter(item => item.defaultSite);
    }
}

//获取搜索记录
export async function get_search_history(): Promise<string[]> {
    const cmd = 'plugin:pub_search_api|get_search_history';
    return invoke<string[]>(cmd, {});
}

//增加搜索记录
export async function add_search_history(keyword: string): Promise<void> {
    const cmd = 'plugin:pub_search_api|add_search_history';
    return invoke<void>(cmd, { keyword: keyword });
}

//设置我的站点
export async function set_my_site(site_list: string[]): Promise<void> {
    const cmd = 'plugin:pub_search_api|set_my_site';
    return invoke<void>(cmd, { siteList: site_list });
}