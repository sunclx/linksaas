import type { RootStore } from './index';
import { makeAutoObservable, runInAction } from 'mobx';

export enum PAGE_TYPE {
    PAGE_BOOK_LIST,
    PAGE_BOOK,
};

export default class BookShelfStore {
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }
    rootStore: RootStore;
    private _pageType = PAGE_TYPE.PAGE_BOOK_LIST;
    private _curBookId = "";
    private _markId = ""

    get pageType(): PAGE_TYPE {
        return this._pageType;
    }

    get curBookId(): string {
        return this._curBookId;
    }

    get markId(): string {
        return this._markId;
    }

    setShowBookList() {
        runInAction(() => {
            this._pageType = PAGE_TYPE.PAGE_BOOK_LIST;
            this._curBookId = "";
        });
    }

    setShowBook(bookId: string, markId: string = "") {
        runInAction(() => {
            this._pageType = PAGE_TYPE.PAGE_BOOK;
            this._curBookId = bookId;
            this._markId = markId;
        });
    }
}