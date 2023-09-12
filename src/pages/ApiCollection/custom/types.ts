import type { ApiGroupInfo, ApiItemInfo } from "@/api/http_custom";


export type GroupInfo = ApiGroupInfo & {
    item_list: ApiItemInfo[];
};