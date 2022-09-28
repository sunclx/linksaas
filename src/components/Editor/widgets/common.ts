export interface WidgetProps {
  editMode: boolean; //true表示编辑模式，false表示阅读模式
  initData: unknown; //初始化数据
  removeSelf: () => void; //编辑模式下从文档从删除自身节点
  writeData: (data: unknown) => void; //写入数据
  collapse?: boolean;
}
