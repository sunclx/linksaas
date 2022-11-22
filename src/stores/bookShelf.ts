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

    get pageType(): PAGE_TYPE {
        return this._pageType;
    }

    get curBookId(): string {
        return this._curBookId;
    }

    setShowBookList() {
        runInAction(() => {
            this._pageType = PAGE_TYPE.PAGE_BOOK_LIST;
            this._curBookId = "";
        });
    }

    setShowBook(bookId: string) {
        runInAction(() => {
            this._pageType = PAGE_TYPE.PAGE_BOOK;
            this._curBookId = bookId;
        });
    }
}